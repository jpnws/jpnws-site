import styles from "./Hero.module.css";
import Breadcrumb from "../components/Breadcrumb";
import { IProject } from "./ProjectPage";
import Badge from "../components/Badge/Badge";

const Hero = ({ project }: { project: IProject }) => {
  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });

  return (
    <div className={styles.heroContainer}>
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
