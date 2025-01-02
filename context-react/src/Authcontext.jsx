import { createContext, useState } from "react";

export const Authcontext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [isLoggedin, setIsLoggedin] = useState(false);

  const contextvalue = {
    user,
    setUser,
    isLoggedin,
    setIsLoggedin,
  };

  return (
    <Authcontext.Provider value={contextvalue}>{children}</Authcontext.Provider>
  );
}
