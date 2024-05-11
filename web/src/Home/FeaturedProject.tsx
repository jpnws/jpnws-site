import Badge from "../components/Badge/Badge";
import styles from "./FeaturedProject.module.css";
import PrimaryButton from "../components/PrimaryButton/PrimaryButton";
import { backendUrl } from "../utils";

const FeaturedProject = ({ project }: { project: any }) => {
  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });

  const [infoPositionStyle, imagePositionStyle] =
    project.hero.homepageImagePosition === "left"
      ? [styles.infoContainerOrderLeft, styles.imageContainerOrderLeft]
      : [styles.infoContainerOrderRight, styles.imageContainerOrderRight];

  return (
    <div className={styles.container}>
      <div className={`${styles.infoContainer} ${infoPositionStyle}`}>
        <h2 className={styles.title}>{project.title}</h2>
        <p className={styles.shortDescription}>
          {project.hero.shortDescription}
        </p>
        <div className={styles.badgeGroup}>{badges}</div>
        <div className={styles.buttonContainer}>
          <PrimaryButton
            text="View case study"
            link={`/projects/${project.slug}`}
          />
        </div>
      </div>
      <div className={`${styles.imageContainer} ${imagePositionStyle}`}>
        {project.hero.media && (
          <img
            src={`${backendUrl}${project.hero.media.url}`}
            alt={project.hero.media.alt}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.mobileButtonContainer}>
        <PrimaryButton
          text="View case study"
          link={`/projects/${project.slug}`}
        />
      </div>
    </div>
  );
};

export default FeaturedProject;
