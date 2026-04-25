import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
//import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyWallet from "./pages/MyWallet";
import Investments from "./pages/Investments";
import Analytics from "./pages/Analytics";
import Expenses from "./pages/Expenses";
import Bills from "./pages/Bills";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-wallet" element={<MyWallet />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/bills" element={<Bills />} />

      </Routes>
    </Router>
  );
}

export default App;