import React, { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/Layout';

const Signup: React.FC<{ setUser: (user: any) => void }> = ({ setUser }) => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, password }),
      });
      if (res.ok) {
        const user = await res.json();
        setUser(user);
        Router.push('/');
      } else {
        // Handle signup error
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <h1>Kayıt Ol</h1>
        <input
          autoFocus
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Nickname"
          type="text"
          value={nickname}
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          value={password}
        />
        <input disabled={!nickname || !password} type="submit" value="Kayıt Ol" />
        <a className="back" href="#" onClick={() => Router.push('/')}>
          or Cancel
        </a>
      </form>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type='text'],
        input[type='password'] {
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

export default Signup;
