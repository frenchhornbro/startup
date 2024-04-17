import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function Login() {
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