import { useState } from "react";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import {
  ThemeContext,
  getSystemTheme,
  getThemeCookie,
  setMetaTheme,
  setThemeCookie,
} from "./ThemeContext";

import Header from "./Header/Header";
import HomePage from "./Home/HomePage";
import Footer from "./Footer/Footer";

import styles from "./App.module.css";
import NotFound from "./NotFound/NotFound";

const Layout = ({ onThemeSwitcherClick }: { onThemeSwitcherClick: any }) => {
  return (
    <>
      <Header onThemeSwitcherClick={onThemeSwitcherClick} />
      <Outlet />
      <Footer />
    </>
  );
};

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
      <BrowserRouter>
        <div className={styles.rootContainer}>
          <Routes>
            <Route
              element={
                <Layout onThemeSwitcherClick={handleThemeSwitcherClick} />
              }
            >
              <Route index element={<HomePage />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </ThemeContext.Provider>
  );
};

export default App;
