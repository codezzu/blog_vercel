import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
import Router from 'next/router';
import { getCookie } from 'cookies-next';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const userId = getCookie('userId', { req, res });

  if (!userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: { nickname: true },
  });

  if (!user || user.nickname !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // No props needed
  };
};

const Admin: React.FC = () => {
  const [surveys, setSurveys] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState('');

  useEffect(() => {
    async function fetchSurveys() {
      const res = await fetch('/api/surveys');
      const data = await res.json();
      setSurveys(data);
    }
    fetchSurveys();
  }, []);

  const createSurvey = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/surveys/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, questions: questions.split(',') }),
      });
      
      if (response.ok) {
        setTitle('');
        setQuestions('');
        await Router.push('/admin');
      } else {
        const errorData = await response.json();
        console.error('Error:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Layout>
      <div>
        <form onSubmit={createSurvey}>
          <h1>New Survey</h1>
          <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
            className="mb-2 p-2 border rounded"
          />
          <textarea
            cols={50}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Questions (comma separated)"
            rows={8}
            value={questions}
            className="mb-2 p-2 border rounded"
          />
          <input
            disabled={!title || !questions}
            type="submit"
            value="Create"
            className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
          />
          <a className="ml-4 text-blue-500" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
        <ul>
          {surveys.map((survey) => (
            <li key={survey.id}>{survey.title}</li>
          ))}
        </ul>
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #0070f3;
          border: 0;
          padding: 1rem 2rem;
          color: white;
          cursor: pointer;
        }

        a {
          color: #0070f3;
        }
      `}</style>
    </Layout>
  );
};

export default Admin;
