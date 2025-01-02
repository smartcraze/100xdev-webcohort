import React, { useContext } from "react";
import { BulbContext, BulbProvider } from "./Themeprovider";

function App() {
  const appStyle = {
    backgroundColor: "black",
    color: "white",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div style={appStyle}>
      <BulbProvider>
        <Light />
        <ToggleButton />
      </BulbProvider>
    </div>
  );
}

function Light() {
  const { bulb } = useContext(BulbContext);
  return <div>{bulb ? "Light on" : "Light off"}</div>;
}
function ToggleButton() {
  const { setBulb } = useContext(BulbContext);
  function togglebtn() {
    setBulb((bulb) => !bulb);
  }
  return (
    <div>
      <button onClick={togglebtn}>Toggle</button>
    </div>
  );
}
export default App;
