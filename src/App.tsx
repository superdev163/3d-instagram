import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { Carousel } from "./Carousel";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <Carousel />
    </div>
  );
}

export default App;
