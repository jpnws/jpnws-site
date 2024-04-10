import { useEffect, useState } from "react";
// import RichText from "../../components/RichText";
import styles from "./Hero.module.css";
import Breadcrumb from "../../components/Breadcrumb";
// import { Media } from "../../../../cms/src/payload-types";

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      <div className={styles.innerContainer}>
        <Breadcrumb />
      </div>
    </div>
  );
};

export default Hero;
