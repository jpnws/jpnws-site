import { useContext } from "react";
import Badge from "../components/Badge/Badge";
import ExternalLinkIcon from "../components/ExternalLinkIcon/ExternalLinkIcon";
import styles from "./OtherProject.module.css";
import { ThemeContext } from "../ThemeContext";
import { backendUrl } from "../utils";

const OtherProject = ({ project }: { project: any }) => {
  const { theme } = useContext(ThemeContext);
  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });
  const links = project.hero.links.map((item: any) => {
    return (
      <a
        key={item.id}
        href={item.link.url}
        className={`${styles.link} ${
          theme === "dark" ? styles.linkDark : styles.linkLight
        }`}
        target="_blank"
        rel="noreferrer"
      >
        {item.link.label}
        <ExternalLinkIcon header={false} />
      </a>
    );
  });
  return (
    <div className={styles.item}>
      <div className={styles.imageContainer}>
        {project.hero.media && (
          <img
            src={`${backendUrl}${project.hero.media.url}`}
            alt={project.hero.media.alt}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.badgeGroup}>{badges}</div>
      <div className={styles.content}>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.shortDescription}>
          {project.hero.shortDescription}
        </p>
      </div>
      <div className={styles.linkGroup}>{links}</div>
    </div>
  );
};

export default OtherProject;
