import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar: React.FC<{ user: any; logout: () => void }> = ({ user, logout }) => {
  const router = useRouter();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <a className="text-white text-lg font-bold">Sosyal Turnuva</a>
        </Link>
        <div>
          {user ? (
            <>
              <span className="text-white mr-4">Hoşgeldin {user.nickname}</span>
              <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded">Çıkış Yap</button>
            </>
          ) : (
            <>
              <Link href="/login">
                <a className="text-white mr-4">Giriş Yap</a>
              </Link>
              <Link href="/signup">
                <a className="bg-blue-500 text-white px-4 py-2 rounded">Kayıt Ol</a>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
