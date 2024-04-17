import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
// TODO: Actually import all the elements (Home, Login, Budget, About)
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

//  BrowserRouter will have NavLinks for the navBar, Routes for the body, and Footer for the footer

function Header() {
  return (
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
                <a className="nav-link active" aria-current="page" href="index.html">Login</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="home.html">Home</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="projected.html">Budget</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="about.html">About</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    );
}

function Login() {
  return (
    <main>
      <div className="main-filler"></div>
      <div className="main-container">
        <h2 className="sign-in-title">Sign In</h2>
        <div className="sign-in-box">
          <form method="get" action="projected.html" className="form-container">
                <div className="textbox-container">
                  <label htmlFor="username" className="textbox-label">Username:</label>
                  <input type="text" className="form-control" id="username" placeholder="Username" required/>
                </div>
                <div>
                  <div className="textbox-container">
                    <label htmlFor="password" className="textbox-label">Password:</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" required/>
                  </div>
                  <div id="password-container"></div>
                </div>
                <div className="form-buttons">
                  <button type="button" className="btn btn-light login" onClick={(login())}>Login</button>
                  <div></div>
                  <div className="new-user"><a href="new-user.html">New user?</a></div>
                </div>
              </form>
            </div>
            <div className="space"></div>
            <div className="img-frame">
              <img alt="Blue Budgie" src="budgie-images/login-budgie.jpg" className="bird-img" />
            </div>
            <div className="space"></div>
          </div>
          <div className="main-filler"></div>
    </main>
    );
}

function login() {
  console.log("placeholder");
}

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
      <div>
        <Header />
        <Login />
        <Footer />
      </div>
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
        //       <Route path="/budget" element={<Budget />} />
        //       <Route path="/about" element={<About />} />
        //       <Route path="*" element={<Navigate to="/" replace />} />
        //     </Routes>
        //   </main>
  
        //   <footer>Footer</footer>
        // </div>
        // </BrowserRouter>

export default App;