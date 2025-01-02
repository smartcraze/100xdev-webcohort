import React, { useContext } from "react";
import { Authcontext, AuthProvider } from "./Authcontext";

function App() {
  return (
    <div>
      <AuthProvider>
        <Navbar />
        <Dashboard />
      </AuthProvider>
    </div>
  );
}

function Navbar() {
  return (
    <nav
      style={{ padding: "10px", backgroundColor: "#282c34", color: "white" }}
    >
      <h1>My App</h1>
      <LoginButton />
      <LogoutButton />
    </nav>
  );
}

function Dashboard() {
  const { user, isLoggedin, setUser } = useContext(Authcontext);
  function handlechange(e) {
    setUser(e.target.value);
  }
  return (
    <div>
      <input onChange={handlechange} type="text" />
      <h1>Hi Welcome {user}</h1>
      <h1>{isLoggedin ? "You are LogedIn" : "You are LogedOuT"}</h1>
    </div>
  );
}

function LoginButton() {
  const { setUser, setIsLoggedin } = useContext(Authcontext);

  function Login() {
    setIsLoggedin(true);
  }
  return (
    <div>
      <button onClick={Login}>Login </button>
    </div>
  );
}

function LogoutButton() {
  const { setIsLoggedin } = useContext(Authcontext);

  function Logout() {
    setIsLoggedin(false);
  }
  return <button onClick={Logout}>Logout </button>;
}

export default App;
