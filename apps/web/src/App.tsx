import Header from "./Header/Header";
import styles from "./App.module.css";
import Hero from "./Hero/Hero";
import HomeMain from "./HomeMain";

const App = () => {
  return (
    <div className={styles.rootContainer}>
      <Header />
      <Hero />
      <HomeMain />
    </div>
  );
};

export default App;
