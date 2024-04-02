import Header from "./Header/Header";
import styles from "./App.module.css";
import Hero from "./Hero/Hero";
import HomeMain from "./Home/HomeMain";
import Footer from "./Footer/Footer";

const App = () => {
  return (
    <div className={styles.rootContainer}>
      <Header />
      <Hero />
      <HomeMain />
      <Footer />
    </div>
  );
};

export default App;
