import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar'; // Navbar component ko import karein
import Footer from '../components/Footer'; // Footer component ko import karein
import { CartProvider } from '../context/CartContext'; // CartProvider ko import karein

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'My Store',
  description: 'Discover unique handcrafted items, made with passion and precision.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Aap yahan apni website ka title, meta tags, favicons add kar sakte hain */}
        <title>My Awesome Craft Store</title>{/* No whitespace here */}
        <meta name="description" content="Discover unique handcrafted items." />{/* No whitespace here */}
      </head>
      {/* Body tag par global styling apply karein */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-gray-100 text-gray-800`}>
        {/* CartProvider poori application ko wrap karega */}
        <CartProvider>
          {/* Navbar yahan render hoga, har page ke upar */}
          <Navbar />

          {/* 'children' prop yahan render hota hai. Iska matlab hai ki aapki 'app/page.tsx'
              file ka content is jagah par show hoga. */}
          <main className="flex-grow">
            {children}
          </main>

          {/* Footer yahan render hoga, har page ke neeche */}
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
