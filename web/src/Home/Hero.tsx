import { useContext, useEffect, useState } from "react";
import RichText from "../components/RichText";
import styles from "./Hero.module.css";
import { ThemeContext } from "../ThemeContext";
import { backendUrl } from "../utils";
import qs from "qs";

interface IMedia {
  url: string;
  alt: string;
}

const queryStr = qs.stringify(
  {
    where: {
      slug: {
        equals: "home",
      },
    },
  },
  { addQueryPrefix: true },
);

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  const [content, setContent] = useState(null);
  const [media, setMedia] = useState<IMedia>();

  useEffect(() => {
    const fetchData = async () => {
      const query = `${backendUrl}/api/pages${queryStr}`;
      const response = await fetch(query);
      const { docs } = await response.json();
      const { hero } = docs[0];
      setContent(hero.content);
      setMedia(hero.media);
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
        {media && (
          <img
            className={styles.profilePhoto}
            src={`${backendUrl}${media.url}`}
            alt={media.alt}
            height="200"
            width="200"
          />
        )}
        {content && <RichText className={styles.richText} content={content} />}
      </div>
    </div>
  );
};

export default Hero;
