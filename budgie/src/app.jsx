import React from 'react';
import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login.jsx';
import {NewUser} from './new-user/new-user.jsx';
import {About} from './about/about.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

function Footer() {
  return (
    <footer>
        <span>Created by Hyrum Durfee</span>
        <a href="https://github.com/frenchhornbro/startup">GitHub</a>
    </footer>
  );
}

function App() {
    return (
      <BrowserRouter>
        <header>
          <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
              <img alt="Budgie logo" src="budgie-images/budgie-logo.png" className="logo" />
              <NavLink to="/" className="navbar-brand brand-name">Budgie</NavLink>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link active" aria-current="page">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => window.location.href="home.html"}>Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={() => window.location.href="projected.html"}>Budget</a>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/about" className="nav-link">About</NavLink>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/about" element={<About />} />
          <Route path="/*" element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
}

export default App;