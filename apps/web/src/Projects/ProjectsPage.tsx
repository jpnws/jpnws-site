import FeaturedProjects from "./FeaturedProjects";
import Hero from "./Hero";
import OtherProjects from "./OtherProjects";

import styles from "./ProjectsPage.module.css";

const ProjectsPage = () => {
  return (
    <>
      <Hero />
      <main className={styles.outerContainer}>
        <div className={styles.main}>
          <FeaturedProjects />
          <OtherProjects />
        </div>
      </main>
    </>
  );
};

export default ProjectsPage;
