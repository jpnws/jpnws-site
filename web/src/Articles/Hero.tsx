import { useContext, useEffect, useState } from "react";
import styles from "./Hero.module.css";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { ThemeContext } from "../ThemeContext";
import { backendUrl } from "../utils";
import qs from "qs";

const queryStr = qs.stringify(
  {
    where: {
      slug: {
        equals: "articles",
      },
    },
  },
  { addQueryPrefix: true },
);

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  const [title, setTitle] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const query = `${backendUrl}/api/pages${queryStr}`;
      const response = await fetch(query);
      const { docs } = await response.json();
      const { title } = docs[0];
      setTitle(title);
    };

    fetchData();
  }, []);

  return (
    <div
      className={`${styles.outerContainer} ${
        theme === "dark"
          ? styles.outerContainerDark
          : styles.outerContainerLight
      }`}
    >
      <div className={styles.innerContainer}>
        <Breadcrumb title={undefined} />
        <h1>{title}</h1>
      </div>
    </div>
  );
};

export default Hero;
