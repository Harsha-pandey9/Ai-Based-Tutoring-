import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { API_ENDPOINTS } from '../config/api';

export default function VideoLectures() {
  const { getToken } = useAuth();
  const [form, setForm] = useState({ year: '', branch: '' });
  const [videos, setVideos] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const recordVideoWatch = async (value) => {
    try {
      const token = await getToken();
      await fetch(API_ENDPOINTS.RECORD_ACTIVITY, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: 'video', value }),
      });
    } catch (error) {
      console.error('Failed to record video watch:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    const { year, branch } = form;
    let result = [];

    if (year === '1st' && branch === 'CSE') {
      result = [
        {
          title: 'Introduction to Programming',
          link: 'https://www.youtube.com/embed/1gyT7X6VMZg?si=7qAlrGXIeWc10_Kh',
        },
        {
          title: 'Fundamentals of Mechanics',
          link: 'https://www.youtube.com/embed/0xaq-X-vR5M?si=22pAfnwaCx39L7I7',
        },
      ];
    } else if (year === '2nd' && branch === 'CSE') {
      result = [
        {
          title: 'Computer Organization & Architecture',
          link: 'https://www.youtube.com/embed/DsK35f8wyUw?si=5p2lgNQ5NNn-Rgw-',
        },
        {
          title: 'Operating Systems',
          link: 'https://www.youtube.com/embed/xw_OuOhjauw?si=Mc1bIxgGYu-O3mYv',
        },
        {
          title: 'Theory of Computation',
          link: 'https://www.youtube.com/embed/9kuynHcM3UA?si=0NNM07or_FdzLreZ',
        },
      ];
    }

    setVideos(result);
    if (result.length > 0) {
      recordVideoWatch(result.length);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-black py-10 px-4 flex justify-center items-start transition-colors duration-300">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-xl p-6 text-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold text-center mb-6">Find Your Lecture Videos</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="year" className="block font-medium mb-1">Studying Year:</label>
            <select
              name="year"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Year</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>

          <div>
            <label htmlFor="branch" className="block font-medium mb-1">Branch:</label>
            <select
              name="branch"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">Select Branch</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics and Communication</option>
              <option value="ME">Mechanical</option>
              <option value="CE">Civil</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              Get Videos
            </button>
          </div>
        </form>

        <div className="grid gap-6 mt-6">
          {submitted && videos.length > 0 ? (
            videos.map((video, idx) => (
              <div
                key={idx}
                className="shadow-md border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <h3 className="bg-blue-100 dark:bg-gray-800 px-4 py-2 font-semibold text-gray-800 dark:text-gray-100">
                  {video.title}
                </h3>
                <div className="aspect-video">
                  <iframe
                    src={video.link}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  ></iframe>
                </div>
              </div>
            ))
          ) : submitted && videos.length === 0 ? (
            <p className="text-center text-red-500 font-medium">No videos available for this selection.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
