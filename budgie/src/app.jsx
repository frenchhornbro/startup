import React from 'react';
import {BrowserRouter, NavLink, Route, Routes} from 'react-router-dom';
import {Login} from './login/login.jsx';
import {NewUser} from './new-user/new-user.jsx';
import {Home} from './home/home.jsx';
import {Budget} from './budget/budget.jsx';
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
              <a className="navbar-brand brand-name" href="home.html">Budgie</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <NavLink to="/login" className="nav-link active" aria-current="page">Login</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/" className="nav-link">Home</NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/budget" className="nav-link">Budget</NavLink>
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
          <Route path="/" element={<Home />} exact />
          <Route path="/login" element={<Login />} />
          <Route path="/new-user" element={<NewUser />} />
          <Route path="/budget" element={<Budget />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Login to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    );
}
        // <BrowserRouter>
        // <div className="app">
        //   <nav>
        //     <NavLink to="/login">Login</NavLink>
        //     <NavLink to="/home">Home</NavLink>
        //     <NavLink to="/budget">Budget</NavLink>
        //     <NavLink to="/about">About</NavLink>
        //   </nav>
  
        //   <main>
        //     <Routes>
        //         //TODO: Create these elements
        //       <Route path="/" element={<Home />} exact />
        //       <Route path="/login" element={<Login />} />
        //       <Route path="/new-user" element={<NewUser />} />
        //       <Route path="/budget" element={<Budget />} />
        //       <Route path="/about" element={<About />} />
        //       <Route path="*" element={<Navigate to="/" replace />} />
        //     </Routes>
        //   </main>
  
        //   <footer>Footer</footer>
        // </div>
        // </BrowserRouter>

export default App;