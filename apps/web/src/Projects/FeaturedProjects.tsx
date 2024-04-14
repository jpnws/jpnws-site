import FeaturedProject from "./FeaturedProject";
import styles from "./FeaturedProjects.module.css";
import { useEffect, useState } from "react";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects?where[featured][equals]=true`,
      );
      const { docs } = await response.json();
      docs.sort((a: any, b: any) => a.featuredPriority - b.featuredPriority);
      setProjects(docs);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.featuredWrapper}>
      <h2 className={styles.sectionTitle}>Featured</h2>
      <div className={styles.projectsContainer}>
        {projects.map((project: any) => {
          return <FeaturedProject key={project.id} project={project} />;
        })}
      </div>
    </div>
  );
};

export default FeaturedProjects;
