import RouteLayout from "./Routes/RouteLayout";

import "./App.css";
import { Context } from "./context/context";
import { useContext, useEffect, useMemo } from "react";

function App() {
  const { loadProfile, userInfo } = useContext(Context);
  const user = useMemo(() => userInfo, [userInfo]);
  useEffect(() => {
    if (!user?._id) loadProfile();
  }, []);
  return (
    <div className="App">
      <RouteLayout />
    </div>
  );
}

export default App;
