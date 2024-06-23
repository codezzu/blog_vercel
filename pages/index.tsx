import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
  const [surveys, setSurveys] = useState([]);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    async function fetchSurveys() {
      const res = await fetch('/api/surveys');
      if (res.ok) {
        const data = await res.json();
        setSurveys(data);
      } else {
        console.error('Failed to fetch surveys');
      }
    }
    fetchSurveys();

    // Hoş geldin mesajı için daktilo efekti
    let index = 0;
    const message = `Hoşgeldiniz...`;
    const intervalId = setInterval(() => {
      setWelcomeMessage((prev) => prev + message[index]);
      index++;
      if (index === message.length) clearInterval(intervalId);
    }, 150);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{welcomeMessage}</h1>
        <h2 className="text-2xl font-bold mb-4 animate-fadeIn">Anketler</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-gray-100 p-6 rounded-lg border shadow-md">
              <Link href={`/surveys/${survey.id}`}>
                <a className="text-xl font-semibold text-blue-600 font-mono block text-center">{survey.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
          font-family: 'Courier New', Courier, monospace;
        }
        .bg-gray-100 {
          background-color: #f7fafc;
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
        .animate-fadeIn {
          animation: fadeIn 2s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        h1 {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          animation: typing 3.5s steps(30, end), blink-caret .75s step-end infinite;
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
        @keyframes blink-caret {
          from, to { border-color: transparent; }
          50% { border-color: black; }
        }
      `}</style>
    </Layout>
  );
}

export default Home;
