import Badge from "../../components/Badge/Badge";
import ExternalLinkIcon from "../../components/ExternalLinkIcon/ExternalLinkIcon";
import styles from "./OtherProject.module.css";

const OtherProject = ({ project }: { project: any }) => {
  const badges = project.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });
  console.log(project.hero.links);
  const links = project.hero.links.map((item: any) => {
    return (
      <a
        key={item.id}
        href={item.link.url}
        className={styles.link}
        target="_blank"
        rel="noreferrer"
      >
        {item.link.label}
        <ExternalLinkIcon />
      </a>
    );
  });
  return (
    <div className={styles.projectItem}>
      <div className={styles.imageContainer}>
        {project.hero.media && (
          <img
            src={`${import.meta.env.VITE_API_URL}${project.hero.media.url}`}
            alt={project.hero.media.alt}
            className={styles.image}
          />
        )}
      </div>
      <div className={styles.badgeGroup}>{badges}</div>
      <div className={styles.content}>
        <h3 className={styles.projectTitle}>{project.title}</h3>
        <p className={styles.shortDescription}>
          {project.hero.shortDescription}
        </p>
      </div>
      <div className={styles.linkGroup}>{links}</div>
    </div>
  );
};

export default OtherProject;
