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
  const [loginNav, setLoginNav] = React.useState('nav-link active');
  const [homeNav, setHomeNav] = React.useState('nav-link');
  const [budgetNav, setBudgetNav] = React.useState('nav-link');
  const [aboutNav, setAboutNav] = React.useState('nav-link');

  function updateLoginNav() {
    setLoginNav('nav-link active');
    setHomeNav('nav-link');
    setBudgetNav('nav-link');
    setAboutNav('nav-link');
  }

  function updateHomeNav() {
    setHomeNav('nav-link active');
    setLoginNav('nav-link');
    setBudgetNav('nav-link');
    setAboutNav('nav-link');
    window.location.href="home.html";
  }

  function updateBudgetNav() {
    setBudgetNav('nav-link active');
    setHomeNav('nav-link');
    setLoginNav('nav-link');
    setAboutNav('nav-link');
    window.location.href="projected.html";
  }

  function updateAboutNav() {
    setAboutNav('nav-link active');
    setBudgetNav('nav-link');
    setHomeNav('nav-link');
    setLoginNav('nav-link');
  }

    return (
      <BrowserRouter>
        <div className="body">
          <header>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
              <div className="container-fluid">
                <img alt="Budgie logo" src="../budgie-images/budgie-logo.png" className="logo" />
                <NavLink to="/" className="navbar-brand brand-name">Budgie</NavLink>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <NavLink to="/login" className={loginNav} onClick={() => updateLoginNav()} aria-current="page">Login</NavLink>
                    </li>
                    <li className="nav-item">
                      <a className={homeNav} onClick={() => updateHomeNav()}>Home</a>
                    </li>
                    <li className="nav-item">
                      <a className={budgetNav} onClick={() => updateBudgetNav()}>Budget</a>
                    </li>
                    <li className="nav-item">
                      <NavLink to="/about" className={aboutNav} onClick={() => updateAboutNav()}>About</NavLink>
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
        </div>
      </BrowserRouter>
    );
}

export default App;