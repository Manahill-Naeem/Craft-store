'use client'; // This page will contain client-side interactivity if you add more later

import React from 'react';

const AboutPage = () => {
  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
        About Our Craft Store
      </h1>

      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">
          Our Story
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Welcome to My Craft Store, where passion meets craftsmanship. Founded in 2023, our journey began with a simple desire: to bring unique, handmade treasures to your home. We believe in the beauty of artisanal work and the stories behind each piece.
        </p>
        <p className="text-gray-700 text-lg leading-relaxed">
          Every item in our collection is meticulously crafted by skilled artisans, ensuring the highest quality and a touch of individuality. From elegant pearl jewelry to whimsical home decor, we curate products that inspire joy and add character to your life.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10 mb-8">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">
          Our Mission
        </h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          Our mission is to support independent artists and provide a platform for their incredible talent. We are committed to ethical sourcing, sustainable practices, and fostering a community that appreciates the art of handmade goods. We strive to offer a diverse range of products that cater to various tastes and occasions, always with a focus on quality and originality.
        </p>
      </section>

      <section className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <h2 className="text-3xl font-bold text-emerald-700 mb-6">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside text-gray-700 text-lg leading-relaxed space-y-3">
          <li>
            <strong className="text-emerald-600">Handpicked Quality:</strong> Each product is carefully selected for its craftsmanship and durability.
          </li>
          <li>
            <strong className="text-emerald-600">Unique Designs:</strong> Discover items you won't find anywhere else.
          </li>
          <li>
            <strong className="text-emerald-600">Support Artisans:</strong> Your purchase directly contributes to the livelihoods of talented creators.
          </li>
          <li>
            <strong className="text-emerald-600">Customer Satisfaction:</strong> We are dedicated to providing an exceptional shopping experience.
          </li>
        </ul>
      </section>
    </div>
  );
};

export default AboutPage;
