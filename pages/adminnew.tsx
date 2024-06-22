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

  return {
    props: { 
      survey: {
        ...survey,
        createdAt: survey.createdAt.toISOString(),
        updatedAt: survey.updatedAt.toISOString(),
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
      <div>
        <h1>{survey.title}</h1>
        {survey.questions.map((q, index) => (
          <div key={index}>
            <input type="radio" name="choice" value={index} onChange={(e) => setChoice(parseInt(e.target.value))} />
            {q}
          </div>
        ))}
        <button onClick={submitVote}>Vote</button>
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
