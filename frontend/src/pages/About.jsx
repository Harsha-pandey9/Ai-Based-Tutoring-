import { useEffect, useState } from "react";
import { API_ENDPOINTS } from '../config/api';

export default function About() {
  const [stats, setStats] = useState({ users: 0, logins: 0, activities: 0 });
  const [animatedStats, setAnimatedStats] = useState({ users: 0, logins: 0, activities: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.STATS);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const animateValue = (start, end, duration, setter, key) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setter(prev => ({ ...prev, [key]: Math.floor(progress * (end - start) + start) }));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    animateValue(0, stats.users, 2000, setAnimatedStats, 'users');
    animateValue(0, stats.logins, 2000, setAnimatedStats, 'logins');
    animateValue(0, stats.activities, 2000, setAnimatedStats, 'activities');
  }, [stats]);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-lg shadow transition-all duration-300">
      <h2 className="text-3xl font-bold mb-4 text-blue-600 dark:text-yellow-400">About Alpha X</h2>

      <p className="text-gray-700 dark:text-gray-300 mb-4">
        Welcome to <span className="font-semibold">Alpha X</span>, your ultimate online learning companion.
        Our platform is designed to help students excel by offering a unique combination of progress tracking,
        comprehensive resources, and an intuitive learning experience.
      </p>

      <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 space-y-2">
        <li>
          <span className="font-semibold">PDF Notes:</span> Easy-to-access, well-structured notes to help you revise key concepts.
        </li>
        <li>
          <span className="font-semibold">Video Lectures:</span> Engaging video tutorials to enhance your understanding of complex topics.
        </li>
        <li>
          <span className="font-semibold">Previous Year Papers:</span> Practice with real exam questions from past years to prepare effectively.
        </li>
        <li>
          <span className="font-semibold">Progress Tracking:</span> Stay on top of your learning journey with our smart tracking system
          that shows how much you've covered and what’s left to master.
        </li>
      </ul>

      <p className="text-gray-700 dark:text-gray-300">
        At <span className="font-semibold">Alpha X</span>, we believe that every student can achieve their academic goals with the right
        tools and support. We’re here to make learning accessible, efficient, and enjoyable.
      </p>

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4 text-center">Platform Stats</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600">{animatedStats.users}</div>
            <p>Users</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-600">{animatedStats.logins}</div>
            <p>Logins</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-purple-600">{animatedStats.activities}</div>
            <p>Activities</p>
          </div>
        </div>
      </div>
    </div>
  );
}
