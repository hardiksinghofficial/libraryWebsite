import React, { useEffect, useState } from 'react';
import { FaBriefcase } from 'react-icons/fa6';
import { FiGithub, FiLinkedin } from 'react-icons/fi';

export default function Socials() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsDarkMode(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  const lightShadow = {
    boxShadow: `
      rgba(0, 0, 0, 0.5) 0px 15px 25px,
      rgba(0, 0, 0, 0.35) 0px 10px 15px,
      rgba(0, 0, 0, 0.25) 0px 4px 6px
    `
  };

  const darkShadow = {
    boxShadow: `
      rgba(200, 200, 200, 0.2) 2px 2px 6px,
      rgba(160, 160, 160, 0.15) 0px 6px 10px
    `
  };

  const hoverClass = isDarkMode
    ? 'hover:brightness-200'
    : 'hover:brightness-90';

  return (
    <div className="mt-6 flex gap-4">
      <a
        href="https://github.com/hardiksinghofficial"
        target="_blank"
        rel="noopener noreferrer"
        className={`p-5 rounded-lg transition-all duration-300 transform hover:-translate-y-[4px] dark:brightness-75 ${hoverClass}`}
        style={isDarkMode ? darkShadow : lightShadow}
      >
        <FiGithub className="w-6 h-6" />
      </a>

      <a
        href="https://www.linkedin.com/in/hardik-singh-83056b32a/"
        target="_blank"
        rel="noopener noreferrer"
        className={`p-5 rounded-lg transition-all duration-300 transform hover:-translate-y-[4px] dark:brightness-75 ${hoverClass}`}
        style={isDarkMode ? darkShadow : lightShadow}
      >
        <FiLinkedin className="w-6 h-6" />
      </a>

      <a
        href="https://www.linkedin.com/in/hardik-singh-83056b32a/"
        target="_blank"
        rel="noopener noreferrer"
        className={`p-5 rounded-lg transition-all duration-300 transform hover:-translate-y-[4px] dark:brightness-75 ${hoverClass}`}
        style={isDarkMode ? darkShadow : lightShadow}
      >
        <FaBriefcase className="w-6 h-6" />
      </a>
    </div>
  );
}
