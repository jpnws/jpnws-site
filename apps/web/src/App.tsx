import Header from "./Header/Header";
import styles from "./App.module.css";
import Hero from "./Hero/Hero";

const App = () => {
  return (
    <div className={styles.rootContainer}>
      <Header />
      <Hero />
    </div>
  );
};

export default App;
