import { useEffect, useState } from "react";
import styles from "./Hero.module.css";
import Breadcrumb from "../../components/Breadcrumb";

const Hero = () => {
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pages/660753e604cf9801f9cb395d?locale=undefined&draft=true&depth=1`,
      );
      const { title } = await response.json();
      setTitle(title);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.innerContainer}>
        <Breadcrumb title={undefined} />
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default Hero;
