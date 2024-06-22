import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';

const Admin: React.FC = () => {
  const [surveys, setSurveys] = useState([]);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState('');
  const creatorId = 1; // Hardcoded admin ID, bunu dinamik olarak ayarlamanız gerekebilir.

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
        body: JSON.stringify({ title, questions: questions.split(','), creatorId }),
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
          />
          <textarea
            cols={50}
            onChange={(e) => setQuestions(e.target.value)}
            placeholder="Questions (comma separated)"
            rows={8}
            value={questions}
          />
          <input disabled={!title || !questions} type="submit" value="Create" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
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
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Admin;
