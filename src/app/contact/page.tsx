'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react'; // Icons

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setResponseMessage(null);

    try {
      const response = await fetch('/api/contact', { // New API route for contact messages
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message.');
      }

      setStatus('success');
      setResponseMessage('Your message has been sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
    } catch (error: any) {
      setStatus('error');
      setResponseMessage(`Failed to send message: ${error.message}`);
      console.error('Contact form submission error:', error);
    }
  };

  return (
    <div className="flex-grow container mx-auto p-4 md:p-8">
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900 mb-12">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-bold text-emerald-700 mb-6">Get in Touch</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Have a question, feedback, or a custom order request? We'd love to hear from you! Reach out to us through the form or using the contact details below.
            </p>
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Mail size={24} className="text-emerald-600 mr-3" />
                <span>info@mycraftstore.com</span>
              </div>
              <div className="flex items-center text-gray-700">
                <Phone size={24} className="text-emerald-600 mr-3" />
                <span>+1 (123) 456-7890</span>
              </div>
              <div className="flex items-start text-gray-700">
                <MapPin size={24} className="text-emerald-600 mr-3 mt-1" />
                <span>123 Craft Lane, Artisan City, AC 12345</span>
              </div>
            </div>
          </div>
          {/* Optional: Social Media Links */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              {/* Replace with actual social media icons/links */}
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition duration-200">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition duration-200">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.002 3.797.048.843.04 1.168.109 1.402.198.64.233 1.09.493 1.515.908.425.415.685.865.919 1.504.089.234.159.56.198 1.402.046 1.013.048 1.377.048 3.797s-.002 2.43-.048 3.797c-.04.844-.109 1.169-.198 1.402-.233.64-.493 1.09-.908 1.515-.415.425-.865.685-1.504.919-.234.089-.56.159-1.402.198-1.013.046-1.377.048-3.797.048s-2.43-.002-3.797-.048c-.844-.04-1.169-.109-1.402-.198-.64-.233-1.09-.493-1.515-.908-.415-.425-.685-.865-.919-1.504-.089-.234-.159-.56-.198-1.402-.046-1.013-.048-1.377-.048-3.797s.002-2.43.048-3.797c.04-.844.109-1.169.198-1.402.233-.64.493-1.09.908-1.515.415-.425.865-.685.919-1.504.089-.234.159-.56.198-1.402.046-1.013.048-1.377.048-3.797Z" clipRule="evenodd" /><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm0 1a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM18 5.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" /></svg>
              </a>
              <a href="#" className="text-gray-600 hover:text-emerald-600 transition duration-200">
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M.05 3.166A8.773 8.773 0 0 1 8.5 0C13.844 0 16.89 2.135 16.89 6.847c0 4.71-2.946 6.847-8.39 6.847-5.445 0-8.39-2.137-8.39-6.847 0-4.712 3.045-6.847 8.39-6.847Z" /><path fillRule="evenodd" d="M22.657 1.884C21.731.857 20.461.25 19.043.25c-1.396 0-2.607.51-3.52 1.547-1.042 1.157-1.562 2.68-1.562 4.673 0 1.993.52 3.516 1.562 4.673.913 1.037 2.124 1.547 3.52 1.547 1.418 0 2.688-.607 3.614-1.634.926-1.027 1.388-2.55 1.388-4.543 0-1.993-.462-3.516-1.388-4.543Z" clipRule="evenodd" /></svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-3xl font-bold text-emerald-700 mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-800 text-sm font-medium mb-2">Your Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-800 text-sm font-medium mb-2">Your Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-gray-800 text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-800 text-sm font-medium mb-2">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition duration-200 resize-y"
                required
              ></textarea>
            </div>

            {status === 'loading' && (
              <p className="text-center text-emerald-600">Sending your message...</p>
            )}
            {status === 'success' && (
              <p className="text-center text-green-600">{responseMessage}</p>
            )}
            {status === 'error' && (
              <p className="text-center text-red-600">{responseMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-amber-500 text-gray-900 font-bold px-6 py-3 rounded-lg shadow-md hover:bg-amber-400 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
