import { useState } from 'react';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickname, password }),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}
