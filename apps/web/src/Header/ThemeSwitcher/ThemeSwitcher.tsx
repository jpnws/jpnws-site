import { useContext } from "react";
import MoonIcon from "./MoonIcon";
import styles from "./ThemeSwitcher.module.css";
import { ThemeContext } from "../../ThemeContext";

const ThemeSwitcher = ({
  onThemeSwitcherClick,
}: {
  onThemeSwitcherClick: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => void;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={styles.container}>
      <div
        className={
          theme === "light"
            ? styles.themeSwitcherLight
            : styles.themeSwitcherDark
        }
        onClick={onThemeSwitcherClick}
      >
        <button className={styles.themeSwitcherButton}></button>
      </div>
      <MoonIcon />
    </div>
  );
};

export default ThemeSwitcher;
