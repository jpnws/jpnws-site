import FeaturedArticle from "./FeaturedArticle";
import styles from "./FeaturedArticles.module.css";
import { useEffect, useState } from "react";
import { backendUrl } from "../utils";

const FeaturedArticles = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${backendUrl}/api/articles?where[featured][equals]=true`,
      );
      const { docs } = await response.json();
      docs.sort((a: any, b: any) => a.featuredPriority - b.featuredPriority);
      setArticles(docs);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.featuredArticles}>
      {articles.map((article: any) => {
        return <FeaturedArticle key={article.id} article={article} />;
      })}
    </div>
  );
};

export default FeaturedArticles;
