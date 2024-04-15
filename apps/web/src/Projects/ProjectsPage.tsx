import { useContext } from "react";
import FeaturedProjects from "./FeaturedProjects";
import Hero from "./Hero";
import OtherProjects from "./OtherProjects";

import styles from "./ProjectsPage.module.css";
import { ThemeContext } from "../ThemeContext";

const ProjectsPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <>
      <Hero />
      <main
        className={`${styles.container} ${theme === "dark" ? styles.containerDark : styles.containerLight}`}
      >
        <div className={styles.main}>
          <FeaturedProjects />
          <OtherProjects />
        </div>
      </main>
    </>
  );
};

export default ProjectsPage;
