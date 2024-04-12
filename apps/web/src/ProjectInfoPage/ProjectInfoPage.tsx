import { useEffect, useState } from "react";
import styles from "./ProjectInfoPage.module.css";
import { useParams } from "react-router-dom";
import Hero from "./Hero/Hero";
import RichText from "../components/RichText";
import OnThisPage from "./OnThisPage";

interface Badge {
  id: string;
  name: string;
}

export interface ProjectInfo {
  title: string;
  badges: Badge[];
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
  const [projectInfo, setProjectInfo] = useState<ProjectInfo>();
  const params = useParams();

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
      {projectInfo && <Hero projectInfo={projectInfo} />}
      <div className={styles.outerContainer}>
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
      </div>
    </>
  );
};

export default ProjectInfoPage;
