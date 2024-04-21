import { Link } from "react-router-dom";
import styles from "./FeaturedArticle.module.css";
import { parseISO, format } from "date-fns";
import { ThemeContext } from "../ThemeContext";
import { useContext } from "react";

const FeaturedArticle = ({ article }: { article: any }) => {
  const { theme } = useContext(ThemeContext);

  const categories = article.categories.map((category: any) => {
    return (
      category.name !== "Featured" && (
        <span
          key={category.id}
          className={`${styles.category} ${theme === "dark" ? styles.categoryDark : styles.categoryLight}`}
        >
          {category.name}
        </span>
      )
    );
  });

  return (
    <div className={styles.featuredArticle}>
      <Link
        className={`${styles.link} ${theme === "dark" ? styles.linkDark : styles.linkLight}`}
        to={`/articles/${article.slug}`}
      >
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.publishedDate}>
          {format(parseISO(article.publishedDate), "MMMM d, yyyy")}
        </div>
        <p className={styles.shortDescription}>
          {article.hero.shortDescription}
        </p>
        <span className={styles.categories}>{categories}</span>
      </Link>
    </div>
  );
};

export default FeaturedArticle;
