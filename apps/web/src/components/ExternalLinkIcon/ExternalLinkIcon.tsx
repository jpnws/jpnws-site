import { useContext } from "react";
import styles from "./ExternalLinkIcon.module.css";
import { ThemeContext } from "../../ThemeContext";

const ExternalLinkIcon = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="13"
      height="14"
      viewBox="0 0 13 14"
    >
      <path
        className={`${theme === "dark" ? styles.fillColorDark : styles.fillColorLight}`}
        d="M.688.875h3.937v.875h-3.5v10.5h10.5v-3.5h.875v3.938l-.437.437H.688l-.438-.438V1.313L.688.875z"
      ></path>
      <path
        className={`${theme === "dark" ? styles.fillColorDark : styles.fillColorLight}`}
        d="M12.5 1.313V7h-.875V2.369L5.712 8.28l-.618-.618 5.912-5.913h-4.63V.875h5.687l.437.438z"
      ></path>
    </svg>
  );
};

export default ExternalLinkIcon;
