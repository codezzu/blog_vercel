import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC<{ user: any; logout: () => void }> = ({ user, logout }) => {
  const router = useRouter();

  return (
    <nav className="sticky top-0 p-4 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-black text-lg font-mono">Sosyal Turnuva</a>
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-black mr-4 font-mono">Hoşgeldin {user.nickname}</span>
              <button onClick={logout} className="text-black px-4 py-2 border rounded font-mono">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="text-black mr-4 font-mono">Giriş Yap</a>
              </Link>
              <Link href="/signup">
                <a className="text-black px-4 py-2 border rounded font-mono">Kayıt Ol</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
