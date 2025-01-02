import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const mousePosition = useRef({ x: 0, y: 0 }); // To track mouse coordinates
  const [color, setColor] = useState("#fff");

  // Update mouse position on mouse move
  const handleMouseMove = (e) => {
    mousePosition.current = { x: e.clientX, y: e.clientY };

    const newColor = `rgb(${e.clientX % 255}, ${e.clientY % 255}, 150)`;
    setColor(newColor);
  };

  // Attach mouse move listener on mount
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove); // Cleanup on unmount
    };
  }, []);

  return (
    <div style={{ backgroundColor: color, height: "100vh" }}>
      <div className="container">
        <div className="card">
          <h2>Mouse Position:</h2>
          <p>
            X: {mousePosition.current.x}, Y: {mousePosition.current.y}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
