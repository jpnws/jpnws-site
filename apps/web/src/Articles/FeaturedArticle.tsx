import { Link } from "react-router-dom";
import styles from "./FeaturedArticle.module.css";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

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
    <div className={styles.item}>
      <Link
        className={`${styles.articleLink} ${theme === "dark" ? styles.articleLinkDark : styles.articleLinkLight}`}
        to={`/articles/${article.slug}`}
      >
        <div className={styles.content}>
          <h3 className={styles.title}>{article.title}</h3>
          <p className={styles.shortDescription}>
            {article.hero.shortDescription}
          </p>
          <span className={styles.categories}>{categories}</span>
        </div>
      </Link>
    </div>
  );
};

export default FeaturedArticle;
