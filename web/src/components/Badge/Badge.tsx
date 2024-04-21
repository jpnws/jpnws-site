import { useContext } from "react";
import styles from "./Badge.module.css";
import { ThemeContext } from "../../ThemeContext";

const Badge = ({ text }: { text: string }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <span
      className={`${styles.badge} ${theme === "dark" ? styles.badgeDark : styles.badgeLight}`}
    >
      {text}
    </span>
  );
};

export default Badge;
