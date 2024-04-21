import { useContext, useEffect, useState } from "react";
import styles from "./ProjectPage.module.css";
import { useParams } from "react-router-dom";
import Hero from "./Hero";
import RichText from "../components/RichText";
import OnThisPage from "./OnThisPage";
import { ThemeContext } from "../ThemeContext";

interface IBadge {
  id: string;
  name: string;
}

export interface IProject {
  title: string;
  badges: IBadge[];
  hero: {
    shortDescription: string;
    description: string;
  };
  media: {
    alt: string;
    url: string;
  };
  content: any;
}

const ProjectInfoPage = () => {
  const [projectInfo, setProjectInfo] = useState<IProject>();
  const params = useParams();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects?where[slug][equals]=${params.slug}`,
      );
      const { docs } = await response.json();
      setProjectInfo(docs[0]);
    };

    fetchData();
  }, [params]);

  return (
    <>
      {projectInfo && <Hero project={projectInfo} />}
      <main
        className={`${styles.outerContainer} ${theme === "dark" ? styles.outerContainerDark : styles.outerContainerLight}`}
      >
        <div className={styles.mainContainer}>
          <div className={styles.mainContent}>
            <RichText
              className={styles.richText}
              content={projectInfo?.content}
            />
          </div>
          <aside className={styles.sidebar}>
            <div className={styles.sideNav}>
              <div className={styles.onThisPageTitle}>On this Page</div>
              <OnThisPage content={projectInfo?.content} />
            </div>
          </aside>
        </div>
      </main>
    </>
  );
};

export default ProjectInfoPage;
