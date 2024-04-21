import { useContext } from "react";
import styles from "./PrimaryButton.module.css";
import { ThemeContext } from "../../ThemeContext";

const PrimaryButton = ({ text, link }: { text: string; link: string }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <a
      href={link}
      className={`${styles.button} ${theme === "dark" ? styles.buttonDark : styles.buttonLight}`}
      role="button"
    >
      {text}
    </a>
  );
};

export default PrimaryButton;
