import React from 'react';
import { GetServerSideProps } from 'next';
import Layout from '../components/Layout';
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

  const votes = await prisma.vote.findMany({
    include: {
      user: {
        select: { nickname: true },
      },
      survey: {
        select: { title: true },
      },
    },
  });

  // Date alanlarını stringe dönüştürme
  const serializedVotes = votes.map(vote => ({
    ...vote,
    createdAt: vote.createdAt.toISOString(),
  }));

  return {
    props: {
      votes: serializedVotes,
    },
  };
};

const Dashboard: React.FC<{ votes: any[] }> = ({ votes }) => {
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
        }
      `}</style>
    </Layout>
  );
};

export default Dashboard;
