import RouteLayout from "./Routes/RouteLayout";
import { useContext, useMemo, useEffect } from "react";
import { Context } from "./context/context";
import "./App.css";
import Loader from "./components/Loader/Loader";

function App() {

  const { loadProfile, userInfo } = useContext(Context);
  const user = useMemo(() => userInfo, [userInfo]);
  useEffect(() => {
    if (!user?._id) loadProfile();
  }, []);

  return (
    <div className="App">
      <Loader />
      <RouteLayout />
    </div>
  );
}

export default App;
