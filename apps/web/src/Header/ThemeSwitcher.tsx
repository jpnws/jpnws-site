import MoonIcon from "./MoonIcon";
import styles from "./ThemeSwitcher.module.css";

const ThemeSwitcher = ({
  onThemeSwitcherClick,
}: {
  onThemeSwitcherClick: () => void;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.themeSwitcher} onClick={onThemeSwitcherClick}>
        <button className={styles.themeSwitcherButton}></button>
      </div>
      <MoonIcon />
    </div>
  );
};

export default ThemeSwitcher;
