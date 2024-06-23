import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { getCookie } from 'cookies-next';

Chart.register(...registerables);

export const getServerSideProps: GetServerSideProps = async ({ params, req, res }) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      creator: {
        select: { nickname: true },
      },
      votes: true,
    },
  });

  if (!survey) {
    return {
      notFound: true,
    };
  }

  const votes = survey.votes.map(vote => ({
    ...vote,
    createdAt: vote.createdAt.toISOString(),
  }));

  const userId = getCookie('userId', { req, res });
  const hasVoted = survey.votes.some(vote => vote.userId === Number(userId));

  return {
    props: {
      survey: {
        ...survey,
        createdAt: survey.createdAt ? survey.createdAt.toISOString() : null,
        votes,
      },
      hasVoted,
    },
  };
};

const Survey = ({ survey, hasVoted }) => {
  const [choice, setChoice] = useState(0);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [userHasVoted, setUserHasVoted] = useState(hasVoted);

  useEffect(() => {
    async function fetchResults() {
      const res = await fetch(`/api/surveys/${survey.id}`);
      const data = await res.json();
      setResults(data.results);
    }
    fetchResults();
  }, [survey.id]);

  async function submitVote() {
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice, surveyId: survey.id }),
      });
      if (res.ok) {
        setUserHasVoted(true);
        const data = await res.json();
        setResults(data.results);
        setError('');
      } else {
        const errorData = await res.json();
        setError(errorData.error);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  }

  const data = {
    labels: survey.questions,
    datasets: [
      {
        label: '# of Votes',
        data: results,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  if (!survey) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{survey.title}</h1>
        {!userHasVoted ? (
          <>
            {survey.questions.map((q, index) => (
              <div key={index} className="mb-4">
                <label className="inline-flex items-center w-full">
                  <input
                    type="radio"
                    name="choice"
                    value={index}
                    onChange={(e) => setChoice(parseInt(e.target.value))}
                    className="form-radio"
                  />
                  <span className="ml-2 text-lg">{q}</span>
                </label>
              </div>
            ))}
            <button onClick={submitVote} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
              Oy Ver
            </button>
          </>
        ) : (
          <div className="text-green-500 text-lg">Zaten oy verdin 😠</div>
        )}
        {error && <div className="mt-4 text-red-500">{error}</div>}
        <div className="mt-6">
          <Bar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <style jsx>{`
        .bg-white {
          background-color: #ffffff;
        }
        .rounded-lg {
          border-radius: 12px;
        }
        .border {
          border: 1px solid #e2e8f0;
        }
        .shadow-md {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .hover\\:shadow-lg:hover {
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        }
        h1 {
          font-family: 'Courier New', Courier, monospace;
        }
      `}</style>
    </Layout>
  );
};

export default Survey;
