import { format, parseISO } from "date-fns";
import styles from "./OtherArticle.module.css";
import { Link } from "react-router-dom";

const OtherArticle = ({ article }: { article: any }) => {
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
          <div className={styles.publishedDate}>
            {format(parseISO(article.publishedDate), "MMMM d, yyyy")}
          </div>
          <p className={styles.shortDescription}>
            {article.hero.shortDescription}
          </p>
          <span className={styles.categories}>{categories}</span>
        </div>
      </Link>
    </div>
  );
};

export default OtherArticle;
