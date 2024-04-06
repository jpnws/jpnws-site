import Header from "./Header/Header";
import styles from "./App.module.css";
import Hero from "./Hero/Hero";
import HomeMain from "./Home/HomeMain";
import Footer from "./Footer/Footer";
import {
  ThemeContext,
  getSystemTheme,
  getThemeCookie,
  setMetaTheme,
  setThemeCookie,
} from "./ThemeContext";
import { useState } from "react";

const App = () => {
  const cookieTheme = getThemeCookie();
  const systemTheme = getSystemTheme();

  const [theme, setTheme] = useState(cookieTheme || systemTheme || "light");

  const handleThemeSwitcherClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const newTheme: string = theme === "light" ? "dark" : "light";
    setMetaTheme(newTheme);
    setTheme(newTheme);
    setThemeCookie(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={styles.rootContainer}>
        <Header onThemeSwitcherClick={handleThemeSwitcherClick} />
        <Hero />
        <HomeMain />
        <Footer />
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
