import FeaturedProjects from "./FeaturedProjects";
import styles from "./HomeMain.module.css";
import { useEffect, useState } from "react";

const HomeMain = () => {
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
    <div className={styles.homeMain}>
      <h2 className={styles.projectSectionTitle}>Projects</h2>
      <FeaturedProjects projects={projects} />
    </div>
  );
};

export default HomeMain;
