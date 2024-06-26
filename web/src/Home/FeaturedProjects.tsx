import FeaturedProject from "./FeaturedProject";
import styles from "./FeaturedProjects.module.css";
import { useEffect, useState } from "react";
import { backendUrl } from "../utils";

const FeaturedProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${backendUrl}/api/projects?where[featured][equals]=true`,
      );
      const { docs } = await response.json();
      docs.sort((a: any, b: any) => a.featuredPriority - b.featuredPriority);
      setProjects(docs);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.featuredProjects}>
      {projects.map((project: any) => {
        return <FeaturedProject key={project.id} project={project} />;
      })}
    </div>
  );
};

export default FeaturedProjects;
