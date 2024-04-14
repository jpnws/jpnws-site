import FeaturedProjects from "./FeaturedProjects";
import Hero from "./Hero";
import OtherProjects from "./OtherProjects";

import styles from "./ProjectsPage.module.css";

const ProjectsPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.projectsOuterContainer}>
        <div className={styles.projectsMain}>
          <FeaturedProjects />
          <OtherProjects />
        </div>
      </main>
    </>
  );
};

export default ProjectsPage;
