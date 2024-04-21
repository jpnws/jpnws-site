import Logo from "../Header/Logo";
import styles from "./Footer.module.css";

const Footer = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <footer className={styles.footer}>
      <Logo width={16} height={16} />
      <span className={styles.copyright}>{currentYear} • JI PARK</span>
    </footer>
  );
};

export default Footer;
