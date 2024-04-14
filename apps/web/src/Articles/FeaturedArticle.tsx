import styles from "./FeaturedArticle.module.css";

const FeaturedArticle = ({ article }: { article: any }) => {
  return (
    <div className={styles.projectItem}>
      <div className={styles.content}>
        <h3 className={styles.projectTitle}>{article.title}</h3>
        <p className={styles.shortDescription}>
          {article.hero.shortDescription}
        </p>
      </div>
    </div>
  );
};

export default FeaturedArticle;
