import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

const Home: React.FC = () => {
  const [surveys, setSurveys] = useState([]);

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
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Anketler</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {surveys.map((survey) => (
            <div key={survey.id} className="bg-gray-100 p-4 rounded border">
              <Link href={`/surveys/${survey.id}`}>
                <a className="text-xl font-semibold text-blue-600">{survey.title}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        .bg-gray-100 {
          background-color: #f7fafc;
        }
        .rounded {
          border-radius: 8px;
        }
        .border {
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </Layout>
  );
}

export default Home;
