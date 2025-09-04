import React from "react";
import Body from "./components/Body.jsx";
import useGetProfile from "./hooks/useGetProfile.js";

function App() {
  // Fetch the user profile at the highest level of the app.
  useGetProfile();

  return (
    <div className="App">
      <Body />
    </div>
  );
}

export default App;
