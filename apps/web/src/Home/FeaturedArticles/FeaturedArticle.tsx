import styles from "./FeaturedArticle.module.css";
import { parseISO, format } from "date-fns";

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
    <div className={styles.featuredArticle}>
      <a className={styles.articleLink} href={`/articles/${article.slug}`}>
        <h2 className={styles.title}>{article.title}</h2>
        <div className={styles.publishedDate}>
          {format(parseISO(article.publishedDate), "MMMM d, yyyy")}
        </div>
        <p className={styles.shortDescription}>
          {article.hero.shortDescription}
        </p>
        <span className={styles.categories}>{categories}</span>
      </a>
    </div>
  );
};

export default FeaturedArticle;
