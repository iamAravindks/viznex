import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Login from './pages/Login';
import Home from './pages/Home';
import { useMemo, useContext, useEffect } from 'react';
import {Context} from './context/context'
import PrivateRoutingLayout from './components/Routes/PrivateRoutingLayout';

function App() {

  const { loadProfile, userInfo } = useContext(Context);
  const user = useMemo(() => userInfo, [userInfo]);
  useEffect(() => {
    if (!user?._id) loadProfile();
  }, []);


  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoutingLayout />} >

        <Route path="/" element={<Home />} />


</Route>
<Route path="/login" element={<Login />} />


      </Routes>
      
      
      
      </BrowserRouter>
    </div>
  );
}

export default App;
