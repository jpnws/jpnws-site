import styles from "./Hero.module.css";
import Breadcrumb from "../components/Breadcrumb/Breadcrumb";
import { IProject } from "./ProjectPage";
import Badge from "../components/Badge/Badge";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

const Hero = ({ project }: { project: IProject }) => {
  const { theme } = useContext(ThemeContext);

  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });

  return (
    <div
      className={`${styles.outerContainer} ${theme === "dark" ? styles.outerContainerDark : styles.outerContainerLight}`}
    >
      <div className={styles.innerContainer}>
        <Breadcrumb title={project.title} />
        <h1>{project.title}</h1>
        <p>{project.hero.shortDescription}</p>
        <div className={styles.badgeGroup}>{badges}</div>
      </div>
    </div>
  );
};

export default Hero;
