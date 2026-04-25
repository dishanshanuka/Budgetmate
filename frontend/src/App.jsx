import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
//import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyWallet from "./pages/MyWallet";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-wallet" element={<MyWallet />} />
      </Routes>
    </Router>
  );
}

export default App;