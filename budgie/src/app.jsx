import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
// TODO: Actually import all the elements (Home, Login, Budget, About)
import 'bootstrap/dist/css/bootstrap.min.css';

//TODO: App function should return BrowserRouter
//  BrowserRouter will have NavLinks for the navBar, Routes for the body, and Footer for the footer

function App() {
    return (
        <BrowserRouter>
        <div className="app">
          <nav>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/budget">Budget</NavLink>
            <NavLink to="/about">About</NavLink>
          </nav>
  
          <main>
            <Routes>
                //TODO: Create these elements
              <Route path="/" element={<Home />} exact />
              <Route path="/login" element={<Login />} />
              <Route path="/budget" element={<Budget />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
  
          <footer>Footer</footer>
        </div>
        </BrowserRouter>
    );
}

export default App;