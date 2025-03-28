import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [warningText, setWarningText] = React.useState('');
  const [inputtedUser, setUser] = React.useState('');
  const [inputtedPwd, setPassword] = React.useState('');

  localStorage.removeItem("user");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("guestBudget");
  localStorage.removeItem("budgetOwner");
  localStorage.removeItem("currentBudget");

  const navigate = useNavigate();

  async function login() {
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                'username': inputtedUser,
                'password': inputtedPwd
            })
        });
        const resObj = await response.json();
        if (resObj.isError) {
            switch (resObj.responseMsg) {
                case ("noUser"):
                    noUser();
                    break;
                case ("badPwd"):
                    badPwd();
                    break;
                default:
                    alert("An error occurred: " + resObj.responseMsg);
            }
        }
        else {
            noWarning();
            localStorage.setItem("currentUser", inputtedUser);
            localStorage.setItem("currentBudget", resObj.data.user.budgets[0].budgetName);
            localStorage.setItem("user", JSON.stringify(resObj.data.user));
            console.log("logged in");
            window.location.href = "home.html";
        }
    }
    catch {
        console.log("Login Error");
    }
  }

  function noWarning() {
    setWarningText("");
  }

  function noUser() {
    setWarningText("User does not exist");
  }

  function badPwd() {
    setWarningText("The password is incorrect");
  }

  function updateUser(username) {
    setUser(username.target.value);
  }

  function updatePassword(pwd) {
    setPassword(pwd.target.value);
  }

  return (
    <main>
      <div className="main-filler"></div>
      <div className="main-container">
        <h2 className="sign-in-title">Sign In</h2>
        <div className="sign-in-box">
          <form method="get" action="projected.html" className="form-container">
                <div className="textbox-container">
                  <label htmlFor="username" className="textbox-label">Username:</label>
                  <input type="text" className="form-control" id="username" placeholder="Username" required onChange={(user) => updateUser(user)}/>
                </div>
                <div>
                  <div className="textbox-container">
                    <label htmlFor="password" className="textbox-label">Password:</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" required onChange={(pwd) => updatePassword(pwd)}/>
                  </div>
                  <div id="password-container">{warningText}</div>
                </div>
                <div className="form-buttons">
                  <button type="button" className="btn btn-light login" onClick={() => login()}>Login</button>
                  <div></div>
                  <div className="new-user" onClick={() => navigate("/new-user")} style={{textDecoration: "underline"}}>New user?</div>
                </div>
              </form>
            </div>
            <div className="space"></div>
            <div className="img-frame">
              <img alt="Blue Budgie" src="../../budgie-images/login-budgie.jpg" className="bird-img" />
            </div>
            <div className="space"></div>
          </div>
          <div className="main-filler"></div>
    </main>
  );
}