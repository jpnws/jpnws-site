// import RichText from "../../components/RichText";
import styles from "./Hero.module.css";
import Breadcrumb from "../../components/Breadcrumb";
import { ProjectInfo } from "../ProjectInfoPage";
import Badge from "../../components/Badge/Badge";
// import { Media } from "../../../../cms/src/payload-types";

const Hero = ({ projectInfo }: { projectInfo: ProjectInfo }) => {
  const badges = projectInfo.badges.map((badge: any) => {
    return <Badge key={badge.id} text={badge.name} />;
  });

  return (
    <div className={styles.heroContainer}>
      <div className={styles.innerContainer}>
        <Breadcrumb title={projectInfo.title} />
        <h1>{projectInfo.title}</h1>
        <p>{projectInfo.hero.shortDescription}</p>
        <div className={styles.badgeGroup}>{badges}</div>
      </div>
    </div>
  );
};

export default Hero;
