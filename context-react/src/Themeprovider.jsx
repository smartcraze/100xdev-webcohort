import React, { createContext, useState } from "react";

export const BulbContext = createContext();

export function BulbProvider({ children }) {
  const [bulb, setBulb] = useState(false);

  return (
    <BulbContext.Provider value={{ bulb, setBulb }}>
      {children}
    </BulbContext.Provider>
  );
}
