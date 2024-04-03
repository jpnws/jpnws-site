import { createContext } from "react";

export const ThemeContext = createContext({
  theme: "light",
});

export const getThemeCookie = () => {
  const cookieArray = document.cookie.split("; ");
  const cookieObject = cookieArray.reduce(
    (acc, currentCookie) => {
      const [key, value] = currentCookie.split("=");
      acc[key] = value;
      return acc;
    },
    {} as { [key: string]: string },
  );
  return cookieObject["theme"] || "";
};

export const getSystemTheme = () => {
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isLightMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;
  if (isDarkMode) {
    return "dark";
  } else if (isLightMode) {
    return "light";
  }
  return null;
};

export const setThemeCookie = (theme: string) => {
  const expDate = new Date();
  expDate.setMonth(expDate.getMonth() + 1);
  const cookieStr = `theme=${theme}; expires=${expDate.toUTCString()}; path=/`;
  document.cookie = cookieStr;
};

export const setMetaTheme = (theme: string) => {
  const metaThemeColor = document.querySelector("meta[name='theme-color']");
  if (metaThemeColor) {
    if (theme === "dark") {
      metaThemeColor.setAttribute("content", "#191a23");
    } else if (theme === "light") {
      metaThemeColor.setAttribute("content", "#fefefe");
    }
  } else {
    console.error("Meta tag with name='theme-color' not found.");
  }
};
