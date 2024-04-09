import styles from "./FeaturedProject.module.css";

const FeaturedProject = ({ project }: { project: any }) => {
  console.log(project);
  return (
    <div className={styles.projectItem}>
      <div className={styles.imageContainer}>
        {project.hero.media && (
          <img
            src={`${import.meta.env.VITE_API_URL}${project.hero.media.url}`}
            alt={project.hero.media.alt}
            className={styles.image}
          />
        )}
      </div>
      <h3 className={styles.projectTitle}>{project.title}</h3>
      <p className={styles.shortDescription}>{project.hero.shortDescription}</p>
    </div>
  );
};

export default FeaturedProject;
