import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../app.css';
import './home.css';

export function Home() {
    return (
        <main>
            <div className="home-main-container">
                <div className="home-container">
                    <div className="budget-info-title" style={{display:'flex'}}>
                        <h2>Home</h2>
                        <div className="info-filler"></div>
                        <div className="budget-info-buttons-container">
                            <button type="button" className="btn btn-light" onClick={logout()}>Log Out</button>
                        </div>
                    </div>
                    <div className="add-friend-container">
                        <input type="text" className="form-control add-friend-textbox" id="new-request" placeholder="username" required/>
                        <button type="submit" className="btn btn-light add-friend-button" onClick={addFriend()}>Add Friend</button>
                    </div>
                    <div className="budget-info-title" style={{display:'flex'}}>
                        <h3>My Budgets</h3>
                        <div className="info-filler"></div>
                        <div className="budget-info-buttons-container">
                            <button type="button" className="btn btn-light" onClick={newBudget()}>New Budget</button>
                        </div>
                    </div>
                    <div id="my-budgets-container"></div>
                    <h3 className="budget-info-title">My Friends' Budgets</h3>
                    <div id="my-friends-container"></div>
                </div>
                <div className="center-filler"></div>
                <div className="message-container">
                    <h2 className="budget-info-title" id="message-title"></h2>
                    <div id="messages"></div>
                    <div className="response">
                        <input type="text" className="form-control response-textbox" id="response" placeholder="Send a message" required />
                        <button type="submit" className="btn btn-light response-button" onClick={sendMessage()}>Send</button>
                    </div>
                </div>
            </div>
        </main>
    );
}

function addFriend() {
    console.log("placeholder");
}

function newBudget() {
    console.log("placeholder");
}

function logout() {
    console.log("placeholder");
}

function sendMessage() {
    console.log("placeholder");
}