import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';

const Dashboard: React.FC = () => {
  const [votes, setVotes] = useState([]);

  useEffect(() => {
    async function fetchVotes() {
      const res = await fetch('/api/votes');
      const data = await res.json();
      setVotes(data);
    }
    fetchVotes();
  }, []);

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Survey</th>
              <th className="py-2 px-4 border-b">Choice</th>
            </tr>
          </thead>
          <tbody>
            {votes.map((vote) => (
              <tr key={vote.id}>
                <td className="py-2 px-4 border-b">{vote.user.nickname}</td>
                <td className="py-2 px-4 border-b">{vote.survey.title}</td>
                <td className="py-2 px-4 border-b">{vote.choice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style jsx>{`
        .container {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
