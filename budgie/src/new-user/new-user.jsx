import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';
import { useNavigate } from 'react-router-dom';

export function NewUser() {
    const [warningText, setWarningText] = React.useState('');
    const [username, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirm, setConfirm] = React.useState('');

    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    localStorage.removeItem("guestBudget");
    localStorage.removeItem("budgetOwner");
    localStorage.removeItem("currentBudget");
    
    const navigate = useNavigate();

    async function createNewUser() {
        try {
            const response = await fetch('/api/new-user', {
                method: 'POST',
                headers: {'content-type': 'application/json'},
                body: JSON.stringify({
                    'username': username,
                    'password': password,
                    'confirm': confirm
                })
            });
            const resObj = await response.json();
            if (resObj.isError) {
                switch (resObj.responseMsg) {
                    case ("dupeUser"):
                        dupeUser();
                        break;
                    case ("shortPwd"):
                        shortPwd();
                        break;
                    case ("badConf"):
                        badConf();
                        break;
                    default:
                        alert("An error occurred: " + resObj.responseMsg);
                }
            }
            else {
                storeData(resObj.data.user);
                navigate("/");
            }
        }
        catch {
            console.log("Create Error");
        }
    }
    
    function dupeUser() {
        setWarningText("That username is taken");
    }
    
    function shortPwd() {
        setWarningText("Password must be at least 7 characters long");
    }
    
    function badConf() {
        setWarningText("Inputted passwords must be the same");
    }

    function storeData(newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("currentUser", newUser.username);
        localStorage.setItem("currentBudget", newUser.budgets[0].budgetName);
    }

    function updateUser(username) {
      setUser(username.target.value);
    }
  
    function updatePassword(pwd) {
      setPassword(pwd.target.value);
    }
  
    function updateConfirm(conf) {
      setConfirm(conf.target.value);
    }

    return (
    <main>
        <div className="main-filler"></div>
            <div className="main-container">
                <h2 className="sign-in-title">Create New Account</h2>
                <div className="sign-in-box">
                    <form method="get" action="projected.html" className="form-container">
                        <div className="textbox-container">
                            <label htmlFor="username" className="textbox-label">Username:</label>
                            <input type="text" className="form-control" id="username" placeholder="Username" required onChange={(user) => updateUser(user)}/>
                        </div>
                        <div className="textbox-container">
                            <label htmlFor="password" className="textbox-label">Password:</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required onChange={(pwd) => updatePassword(pwd)}/>
                        </div>
                        <div>
                          <div className="textbox-container">
                            <label htmlFor="confirm" className="textbox-label">Confirm:</label>
                            <input type="password" className="form-control" id="confirm" placeholder="Confirm Password" required onChange={(conf) => updateConfirm(conf)}/>
                          </div>
                          <div id="password-container">{warningText}</div>
                        </div>
                        <div className="form-buttons">
                            <button type="button" className="btn btn-light login" onClick={() => createNewUser()}>Create Account</button>
                            <div></div>
                            <div className="new-user" onClick={() => navigate("/login")} style={{textDecoration: "underline"}}>Already a user?</div>
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