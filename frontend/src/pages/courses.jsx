// src/pages/Courses.jsx
import React from "react";

const courses = [
  {
    title: "HTML",
    description: "Learn the structure of web pages.",
    videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
  },
  {
    title: "CSS",
    description: "Style your web content beautifully.",
    videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
  },
  {
    title: "JavaScript",
    description: "Make websites interactive.",
    videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
  },
  {
    title: "Java",
    description: "Object-oriented programming basics.",
    videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34",
  },
  {
    title: "Python",
    description: "Beginner-friendly scripting language.",
    videoUrl: "https://www.youtube.com/embed/_uQrJ0TkZlc",
  },
  {
    title: "SQL",
    description: "Handle databases efficiently.",
    videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY",
  },
  {
    title: "MongoDB",
    description: "NoSQL database tutorial.",
    videoUrl: "https://www.youtube.com/embed/-56x56UppqQ",
  },
  {
    title: "React",
    description: "Build modern UI with React.",
    videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8",
  },
  {
    title: "Node.js",
    description: "JavaScript backend framework.",
    videoUrl: "https://www.youtube.com/embed/TlB_eWDSMt4",
  },
  {
    title: "C++",
    description: "Foundation of many modern languages.",
    videoUrl: "https://www.youtube.com/embed/vLnPwxZdW4Y",
  },
];

export default function Courses() {
  return (
    <div className="bg-white min-h-screen p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Courses We Offer</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course, index) => (
          <div
            key={index}
            className="bg-gray-100 rounded-xl shadow hover:shadow-xl transform hover:-translate-y-1 transition duration-300 p-4"
          >
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-700 mb-3">{course.description}</p>
            <div className="aspect-video">
              <iframe
                className="w-full h-full rounded-md"
                src={course.videoUrl}
                title={course.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
