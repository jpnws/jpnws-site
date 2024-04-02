import Logo from "../Header/Logo";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Logo width={16} height={16} />
      <span className={styles.copyright}>2024 • JI PARK</span>
    </footer>
  );
};

export default Footer;
