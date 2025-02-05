import React from "react";
import { useTheme } from "next-themes";

const DarkModeToggle = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      {resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
    </button>
  );
};

export default DarkModeToggle;
