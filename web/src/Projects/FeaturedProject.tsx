import PrimaryButton from "../components/PrimaryButton/PrimaryButton";
import styles from "./FeaturedProject.module.css";
import { backendUrl } from "../utils";

const FeaturedProject = ({ project }: { project: any }) => {
  return (
    <div className={styles.item}>
      <div className={styles.imageContainer}>
        {project.hero.media && (
          <img
            src={`${backendUrl}${project.hero.media.url}`}
            alt={project.hero.media.alt}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.shortDescription}>
          {project.hero.shortDescription}
        </p>
      </div>
      <PrimaryButton
        text="View case study"
        link={`/projects/${project.slug}`}
      />
    </div>
  );
};

export default FeaturedProject;
