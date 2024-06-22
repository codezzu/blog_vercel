import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const survey = await prisma.survey.findUnique({
    where: {
      id: Number(params?.id),
    },
    include: {
      creator: {
        select: { nickname: true },
      },
    },
  });

  if (!survey) {
    return {
      notFound: true,
    };
  }

  return {
    props: { 
      survey: {
        ...survey,
        createdAt: survey.createdAt ? survey.createdAt.toISOString() : null,
      }
    },
  };
};

const Survey = ({ survey }) => {
  const [choice, setChoice] = useState(0);

  async function submitVote() {
    await fetch('/api/votes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ choice, surveyId: survey.id, userId: 1 }), // Hardcoded user ID, should be dynamic
    });
  }

  if (!survey) return <div>Loading...</div>;

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">{survey.title}</h1>
        {survey.questions.map((q, index) => (
          <div key={index} className="mb-2">
            <label className="inline-flex items-center">
              <input type="radio" name="choice" value={index} onChange={(e) => setChoice(parseInt(e.target.value))} className="form-radio" />
              <span className="ml-2">{q}</span>
            </label>
          </div>
        ))}
        <button onClick={submitVote} className="bg-blue-500 text-white px-4 py-2 rounded">Vote</button>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Survey;
