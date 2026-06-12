import React, { useState } from 'react';
import Navbar from './navbar';
import Footer from './footer';

function About() {
  const [showMore, setShowMore] = useState(false);
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="bg-gradient-to-b from-[#d5deef] to-white min-h-screen text-[#032030] font-poppins">
      <Navbar />

      <div className="container mx-auto px-6 py-10">
        <div className="bg-white shadow-xl rounded-2xl p-8 transition-all hover:shadow-2xl hover:scale-[1.01] duration-300">
          <h1 className="text-4xl font-bold text-[#004d74] mb-6 border-b-2 border-[#004d74] pb-2">
            About AirQuality Map
          </h1>

          <p className="mb-4 text-lg leading-relaxed">
            AirQuality Map is a powerful tool built to visualize and analyze air quality data across locations and time.
          </p>

          <p className="mb-4 text-lg leading-relaxed">
            It delivers real-time data on pollutants like <span className="font-semibold">PM2.5, NO<sub>2</sub>, and CO</span> so you can make informed choices about your environment and health.
          </p>

          {showMore && (
            <p className="mb-4 text-gray-700 text-base leading-relaxed">
              The platform leverages trusted monitoring stations to provide reliable, live air quality readings. With user-friendly tools, we help communities stay informed and safe.
            </p>
          )}

          <button
            onClick={() => setShowMore(!showMore)}
            className="text-blue-600 hover:text-blue-800 underline mb-4"
          >
            {showMore ? 'Read Less ▲' : 'Read More ▼'}
          </button>

          <div className="mt-6">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="text-xl font-semibold text-[#004d74] flex items-center gap-2 mb-2 hover:text-[#032030] transition"
            >
              Key Features
              <span className={`transition-transform ${showFeatures ? 'rotate-180' : 'rotate-0'}`}>▼</span>
            </button>

            {showFeatures && (
              <ul className="list-disc list-inside pl-4 text-gray-800 text-base space-y-1">
                <li className="hover:text-[#004d74] transition">🌍 Interactive map displaying air quality data</li>
                <li className="hover:text-[#004d74] transition">📡 Real-time updates on pollutant levels</li>
                <li className="hover:text-[#004d74] transition">📈 Historical data analysis and trend visualization</li>
                <li className="hover:text-[#004d74] transition">📍 Custom filters for location and time</li>
                <li className="hover:text-[#004d74] transition">🔍 In-depth analytics on air quality patterns</li>
              </ul>
            )}
          </div>

          <p className="mt-6 text-base text-gray-800 leading-relaxed">
            Our mission is to raise awareness and encourage action for cleaner air — because what we breathe matters.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default About;
