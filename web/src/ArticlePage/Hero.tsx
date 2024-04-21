import styles from "./Hero.module.css";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { IArticle } from "./ArticlePage";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Hero = ({ article }: { article: IArticle }) => {
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
    <div
      className={`${styles.outerContainer} ${theme === "dark" ? styles.outerContainerDark : styles.outerContainerLight}`}
    >
      <div className={styles.innerContainer}>
        <Breadcrumb title={article.title} />
        <h1>{article.title}</h1>
        <p>{article.hero.shortDescription}</p>
        <span className={styles.categories}>{categories}</span>
      </div>
    </div>
  );
};

export default Hero;
