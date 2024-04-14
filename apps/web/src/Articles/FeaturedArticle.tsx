import { Link } from "react-router-dom";
import styles from "./FeaturedArticle.module.css";

const FeaturedArticle = ({ article }: { article: any }) => {
  const categories = article.categories.map((category: any) => {
    return (
      category.name !== "Featured" && (
        <span key={category.id} className={styles.category}>
          {category.name}
        </span>
      )
    );
  });
  return (
    <div className={styles.item}>
      <Link className={styles.articleLink} to={`/articles/${article.slug}`}>
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
