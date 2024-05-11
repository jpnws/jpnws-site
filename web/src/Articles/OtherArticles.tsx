import OtherArticle from "./OtherArticle";
import styles from "./OtherArticles.module.css";
import { useEffect, useState } from "react";
import { backendUrl } from "../utils";

const OtherArticles = () => {
  const [articles, setArticles] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${backendUrl}/api/articles?where[featured][equals]=false`,
      );
      const { docs } = await response.json();
      setArticles(docs);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>All Articles</h2>
      <div className={styles.container}>
        {articles.map((article: any) => {
          return <OtherArticle key={article.id} article={article} />;
        })}
      </div>
    </div>
  );
};

export default OtherArticles;
