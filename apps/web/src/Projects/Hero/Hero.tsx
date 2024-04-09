import { useEffect } from "react";
// import RichText from "../../components/RichText";
import styles from "./Hero.module.css";
import Breadcrumb from "../../components/Breadcrumb";
// import { Media } from "../../../../cms/src/payload-types";

const Hero = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pages/6607538b5c32a56efd1cffbb?locale=undefined&draft=true&depth=1`,
      );
      const data = await response.json();
      console.log(data);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.heroContainer}>
      <div className={styles.innerContainer}>
        <Breadcrumb />
      </div>
    </div>
  );
};

export default Hero;
