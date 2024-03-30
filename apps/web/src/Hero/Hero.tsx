import { useEffect, useState } from "react";
import RichText from "../components/RichText";

const Hero = () => {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/pages/6607541c04cf9801f9cb399e?locale=undefined&draft=true&depth=1`,
      );
      const { hero } = await response.json();
      setContent(hero.content);
    };

    fetchData();
  }, []);

  return (
    <div>
      <RichText content={content} />
    </div>
  );
};

export default Hero;
