import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import Head from 'next/head';
import { Alata } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

const alata = Alata({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>DemanualAI</title>
        <meta name="description" content="Put Your Business on Autopilot" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`min-h-screen flex flex-col ${alata.className}`}>
        <Header />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
      </div>
      <Toaster />
    </>
  );
};

export default Layout;
