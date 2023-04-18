import RouteLayout from "./Routes/RouteLayout";

import "./App.css";
import Loader from "./components/Loader/Loader";
import Error from "./components/Error/Error";
import { useContext, useEffect, useState } from "react";
import { Context } from "./context/context";

function App() {
  const { loadProfile, userInfo, userStatus, setLoading } = useContext(Context);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    setLoading(true);
    if (!userInfo?._id && userStatus) {
      loadProfile().then(() => setIsProfileLoaded(true));
    } else {
      loadProfile()
      setIsProfileLoaded(true);
      setLoading(false);
    }
  }, []);

  if (!isProfileLoaded) {
    return <Loader />;
  } else
    return (
      <div className="App">
        <Loader />
        <Error />
        <RouteLayout />
      </div>
    );
}

export default App;
