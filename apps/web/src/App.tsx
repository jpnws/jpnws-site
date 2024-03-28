import { useEffect } from "react";

const App = () => {
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/globals/header?locale=undefined&draft=false&depth=1`,
      );
      const data = await response.json();
      console.log(data);
    };
    fetchData();
  });

  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
};

export default App;
