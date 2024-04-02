import FeaturedProject from "./FeaturedProject";
import styles from "./FeaturedProjects.module.css";

const FeaturedProjects = ({ projects }: { projects: any }) => {
  if (projects.length > 0) {
    console.log(projects);
  }
  return (
    <div className={styles.featuredProjects}>
      {projects.map((project: any) => {
        return <FeaturedProject key={project.id} project={project} />;
      })}
    </div>
  );
};

export default FeaturedProjects;
