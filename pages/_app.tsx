import '../styles/globals.css';
import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import Navbar from '../components/Navbar';

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // Implement logout logic, e.g., clear cookies or local storage
  };

  return (
    <>
      <Navbar user={user} logout={logout} />
      <Component {...pageProps} setUser={handleLogin} />
    </>
  );
}

export default MyApp;
