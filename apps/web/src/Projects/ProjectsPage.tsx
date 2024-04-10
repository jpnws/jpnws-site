import FeaturedProjects from "./FeaturedProjects/FeaturedProjects";
import Hero from "./Hero/Hero";
import OtherProjects from "./OtherProjects/OtherProjects";

import styles from "./ProjectsPage.module.css";

const ProjectsPage = () => {
  return (
    <>
      <Hero />
      <div className={styles.projectsOuterContainer}>
        <div className={styles.projectsMain}>
          <FeaturedProjects />
          <OtherProjects />
        </div>
      </div>
    </>
  );
};

export default ProjectsPage;
