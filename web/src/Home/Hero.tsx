import { useContext, useEffect, useState } from "react";
import RichText from "../components/RichText";
import styles from "./Hero.module.css";
import { Media } from "../../../cms/src/payload-types";
import { ThemeContext } from "../ThemeContext";

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  const [content, setContent] = useState(null);
  const [media, setMedia] = useState<Media>();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pages/6607541c04cf9801f9cb399e?locale=undefined&draft=true&depth=1`,
      );
      const { hero } = await response.json();
      setContent(hero.content);
      setMedia(hero.media as Media);
    };

    fetchData();
  }, []);

  return (
    <div
      className={`${styles.outerContainer} ${theme === "dark" ? styles.outerContainerDark : styles.outerContainerLight}`}
    >
      <div className={styles.innerContainer}>
        {media && (
          <img
            className={styles.profilePhoto}
            src={`${import.meta.env.VITE_API_URL}${media.url}`}
            alt={media.alt}
            height="200"
            width="200"
          />
        )}
        <RichText className={styles.richText} content={content} />
      </div>
    </div>
  );
};

export default Hero;
