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
      setProjects(docs);
    };
    fetchData();
  }, []);

  return (
    <div className={styles.homeMain}>
      <FeaturedProjects projects={projects} />
    </div>
  );
};

export default HomeMain;
