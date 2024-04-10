import { useEffect, useState } from "react";
import styles from "./ProjectInfoPage.module.css";
import { useParams } from "react-router-dom";

const ProjectInfoPage = () => {
  const [title, setTitle] = useState<string | null>(null);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/projects?where[slug][equals]=${params.slug}`,
      );
      const { docs } = await response.json();
      console.log(docs[0]);
      setTitle(title);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Project Info Page</h1>
    </div>
  );
};

export default ProjectInfoPage;
