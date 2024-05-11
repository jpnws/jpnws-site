import OtherProject from "./OtherProject";
import styles from "./OtherProjects.module.css";
import { useEffect, useState } from "react";
import { backendUrl } from "../utils";

const OtherProjects = () => {
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${backendUrl}/api/projects?where[featured][equals]=false`,
      );
      const { docs } = await response.json();
      setProjects(docs);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>All Projects</h2>
      <div className={styles.container}>
        {projects.map((project: any) => {
          return <OtherProject key={project.id} project={project} />;
        })}
      </div>
    </div>
  );
};

export default OtherProjects;
