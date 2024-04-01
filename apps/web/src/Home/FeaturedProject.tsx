import Badge from "./Badge";
import styles from "./FeaturedProject.module.css";
import PrimaryButton from "./PrimaryButton";

const FeaturedProject = ({ project }: { project: any }) => {
  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{project.title}</h2>
      <p className={styles.shortDescription}>{project.hero.shortDescription}</p>
      <div className={styles.badgeGroup}>{badges}</div>
      <img
        src={`${import.meta.env.VITE_API_URL}${project.hero.media.url}`}
        alt={project.hero.media.alt}
        className={styles.image}
      />
      <PrimaryButton
        text="View case study"
        link={`/projects/${project.slug}`}
      />
    </div>
  );
};

export default FeaturedProject;
