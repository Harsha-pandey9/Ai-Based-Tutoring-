import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_ENDPOINTS } from '../config/api';

export default function QuantumNotes() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({ year: '', branch: '', subject: '' });
  const [quantumLink, setQuantumLink] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const recordQuantumRead = async () => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.RECORD_ACTIVITY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'quantum' }),
      });
    } catch (error) {
      console.error('Failed to record quantum read:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const { year, branch, subject } = form;
    let link = '';

    if (year === '1st' && branch === 'CSE' && subject === 'maths2') {
      link = 'https://t.me/QuantumSeriesaktu1/63';
    } else if (year === '2nd' && branch === 'CSE' && subject === 'COA') {
      link = 'https://t.me/QuantumSeriesaktu1/11';
    } else if (year === '1st' && branch === 'CSE' && subject === 'PPS') {
      link = 'https://t.me/QuantumSeriesaktu1/64';
    } else if (year === '2nd' && branch === 'CSE' && subject === 'Data Structure') {
      link = 'https://t.me/QuantumSeriesaktu1/9';
    }

    setQuantumLink(link || null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Find Your Quantum PDF
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="year" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Studying Year</label>
            <select
              name="year"
              id="year"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div>
            <label htmlFor="branch" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Branch</label>
            <select
              name="branch"
              id="branch"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics and Communication</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>

          <div>
            <label htmlFor="subject" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Subject</label>
            <select
              name="subject"
              id="subject"
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Subject</option>
              <option value="maths2">Mathematics 1</option>
              <option value="COA">COA</option>
              <option value="Data Structure">Data Structure</option>
              <option value="PPS">PPS</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Get Quantum PDF
          </button>
        </form>

        <div className="mt-6 text-center">
          {submitted && quantumLink ? (
            <a
              href={quantumLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              onClick={recordQuantumRead}
            >
              📄 Download Quantum PDF for {form.subject}
            </a>
          ) : submitted && quantumLink === null ? (
            <p className="text-red-500 font-medium mt-4">No Quantum PDF available for this selection.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
