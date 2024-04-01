import styles from "./PrimaryButton.module.css";

const PrimaryButton = ({ text, link }: { text: string; link: string }) => {
  return (
    <a href={link} className={styles.button} role="button">
      {text}
    </a>
  );
};

export default PrimaryButton;
