import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';

export function NewUser() {
    return (
    <main>
        <div className="main-filler"></div>
        <div className="main-container">
            <h2 className="sign-in-title">Create New Account</h2>
            <div className="sign-in-box">
                <form method="get" action="projected.html" className="form-container">
                    <div className="textbox-container">
                        <label htmlFor="username" className="textbox-label">Username:</label>
                        <input type="text" className="form-control" id="username" placeholder="Username" required/>
                    </div>
                    <div className="textbox-container">
                        <label htmlFor="password" className="textbox-label">Password:</label>
                        <input type="password" className="form-control" id="password" placeholder="Password" required/>
                    </div>
                    <div>
                      <div className="textbox-container">
                        <label htmlFor="confirm" className="textbox-label">Confirm:</label>
                        <input type="password" className="form-control" id="confirm" placeholder="Confirm Password" required/>
                      </div>
                      <div id="password-container"></div>
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="btn btn-light login" onClick={createNewUser()}>Create Account</button>
                        <div></div>
                        <div className="new-user"><a href="index.html">Already a user?</a></div>
                    </div>
                </form>
            </div>
            <div className="space"></div>
            <div className="img-frame">
                <img alt="Green Budgie" src="budgie-images/new-user-budgie.jpg" className="bird-img"/>
            </div>
            <div className="space"></div>
        </div>
        <div className="main-filler"></div>
    </main>
    );
}

function createNewUser() {
    console.log("placeholder");
}