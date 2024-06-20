import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes, Navigate } from 'react-router-dom';
import Registration from './Page/Register';
import Login from './Page/Login';
import Home from './Page/Home';

function App() {
  const isAuthenticated = !localStorage.getItem('token'); 
  return (
    
      <div className="App">
        <Routes>    
          <Route path="/register" element={<Registration/>} />
          <Route path="/"  element={<Login/>} />
          <Route path="/home" element={isAuthenticated ? <Navigate to="/" /> :<Home/> } />
          </Routes>
        
      </div>
    
  );
}


export default App;
