import FeaturedProjects from "./FeaturedProjects";
import styles from "./HomeMain.module.css";

const HomeMain = () => {
  return (
    <div className={styles.homeMain}>
      <FeaturedProjects />
    </div>
  );
};

export default HomeMain;
