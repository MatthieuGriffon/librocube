// DarkModeToggle.tsx
import React from "react";

const DarkModeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = React.useState<boolean>(false);

  React.useEffect(() => {
    const className = "dark";
    const bodyClass = window.document.body.classList;
    darkMode ? bodyClass.add(className) : bodyClass.remove(className);
  }, [darkMode]);

  return (
    <button
      type="button"
      onClick={() => setDarkMode(!darkMode)}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
    >
      Switch to {darkMode ? "light" : "dark"} mode
    </button>
  );
};

export default DarkModeToggle;
