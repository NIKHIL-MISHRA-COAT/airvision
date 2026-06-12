import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import { Navigate } from 'react-router-dom';
import About from './components/About';
import LoginForm from './Pages/login';
import RegisterForm from './Pages/register';
import Dashboard from './Pages/Dashboard';
import Map from './components/Map';
import 'leaflet/dist/leaflet.css';
// import AirQualityMap from './Pages/AirQualityMap';
import EnvDash from  "./EnvrionmentDashboard/EnvDash"
// import MyMap from "./components/MyMap";
function App() {


  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    return token ? children : <Navigate to="/" />;
  };
  
  // Usage in Routes
  
  

  return (
    <Router future={{ v7_startTransition: true ,  v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<LoginForm />} />  
        <Route path="/register" element={<RegisterForm />} />  
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/about" element={<About />} />{/* Using element={ <About /> } */}
        
        <Route path="/maps" element={<Map />} />{/* Using element={ <About /> } */}
        <Route path="/dashboard" element={<Dashboard />} />  
        {/* <Route path="/air-maps" element={<AirQualityMap />} />Using element={ <About /> } */}
        <Route path="//environment" element={< EnvDash/>} />{/* Using element={ <About /> } */}

        {/* <Route path="/mymap" element={<MyMap />} />Using element={ <About /> } */}
       
      </Routes>
    </Router>
  );
}

export default App;
