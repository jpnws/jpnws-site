import { useContext, useEffect, useState } from "react";
import styles from "./ArticlePage.module.css";
import { useParams } from "react-router-dom";
import Hero from "./Hero";
import RichText from "../components/RichText";
import OnThisPage from "./OnThisPage";
import { ThemeContext } from "../ThemeContext";

interface ICategory {
  id: string;
  name: string;
}

export interface IArticle {
  title: string;
  categories: ICategory[];
  hero: {
    shortDescription: string;
    description: string;
  };
  media: {
    alt: string;
    url: string;
  };
  content: any;
}

const ArticlePage = () => {
  const [article, setArticle] = useState<IArticle>();
  const params = useParams();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/articles?where[slug][equals]=${params.slug}`,
      );
      const { docs } = await response.json();
      setArticle(docs[0]);
    };

    fetchData();
  }, [params]);

  return (
    <>
      {article && <Hero article={article} />}
      <main
        className={`${styles.outerContainer} ${theme === "dark" ? styles.outerContainerDark : styles.outerContainerLight}`}
      >
        <div className={styles.mainContainer}>
          <div className={styles.mainContent}>
            <RichText className={styles.richText} content={article?.content} />
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.sideNav}>
              <div className={styles.onThisPageTitle}>On this Page</div>
              <OnThisPage content={article?.content} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default ArticlePage;
