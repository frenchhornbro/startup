import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

export function Header() {
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