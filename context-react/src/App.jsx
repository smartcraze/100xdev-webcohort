import React from "react";
import "./App.css";
import { createContext } from "react";
import { useState } from "react";
import { useContext } from "react";

const Bulbcontext = createContext();

/*
 * create context
 * make provider
 */

function App() {
  const [bulb, setBulb] = useState(false);

  return (
    <div>
      <Bulbcontext.Provider
        value={{
          bulb,
          setBulb,
        }}
      >
        <Light />
        <ToggleButton />
      </Bulbcontext.Provider>
    </div>
  );
}

function Light() {
  const { bulb } = useContext(Bulbcontext);
  return <div>{bulb ? "Light on" : "Light off"}</div>;
}
function ToggleButton() {
  const { setBulb } = useContext(Bulbcontext);
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
