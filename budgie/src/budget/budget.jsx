import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
// import {load} from './budget';
import '../app.css';
import './budget.css';

export function Budget() {
    return (
        //TODO: Implement onLoad=load(true)
        <main>
            <div className="all-buttons-container">
                <div className="edit-budget-container">
                    <div className="button-container">
                        <button type="button" className="btn btn-light stretch-button income" onClick={addIncome(true)}>+ Add Income</button>
                        <div className="small-space"></div>
                        <button type="button" className="btn btn-light stretch-button expense" onClick={addExpense(true)}>- Add Expense</button>
                    </div>
                    <div className="button-container">
                        <select className="form-select stretch-button" id="add-selector" onChange={changeAddSelection()}>
                            <option>Add to</option>
                            <option>Replace</option>
                        </select>
                        <div className="small-space"></div>
                        <select className="form-select stretch-button" id="header-selector" onChange={changeHeaderSelection()}>
                            <option className="option-initial">Initial</option>
                            <optgroup label="Income" id="header-income"></optgroup>
                            <optgroup label="Expense" id="header-expenses"></optgroup>
                        </select>
                        <div className="small-space"></div>
                        <select className="form-select stretch-button" id="month-selector" onChange={changeMonthSelection()}>
                            <option>Jan</option>
                            <option>Feb</option>
                            <option>Mar</option>
                            <option>Apr</option>
                            <option>May</option>
                            <option>Jun</option>
                            <option>Jul</option>
                            <option>Aug</option>
                            <option>Sep</option>
                            <option>Oct</option>
                            <option>Nov</option>
                            <option>Dec</option>
                        </select>
                    </div>
                    <div className="textbox-container">
                        <label htmlFor="edit-cell" className="stretch-button">Input Amount: $</label>
                        <input type="number" className="form-control stretch-button" id="edit-cell" placeholder="0.00" />
                        <div className="small-space"></div>
                        <button type="submit" className="btn btn-light stretch-button" onClick={makeChange(true)}>Make change</button>
                    </div>
                </div>
                <div className="button-spacer">
                    <h2 className="data-format" id="title"></h2>
                    <div className="budget-data-container data-format">
                        <div className="initial-savings"></div>
                        <div className="initial-savings">Initial Savings:</div>
                        <div id="initial"></div>
                        <div className="initial-savings"></div>
                    </div>
                    <div className="cumulative-stats-container">
                        <div>By End of Year:</div>
                        <div className="data-format">
                            <div>Net Gain:</div>
                            <div className="small-space"></div>
                            <div className="budget-data neut" id="net-gain">$0.00</div>
                        </div>
                        <div className="data-format">
                            <div>Total Savings:</div>
                            <div className="small-space"></div>
                            <div className="budget-data neut" id="total">$0.00</div>
                        </div>
                    </div>
                </div>
                <div className="controls-container">
                    <div className="button-container">
                        <div className="stretch-button" id="username" style={{fontSize:'larger'}}></div>
                        <button type="button" className="btn btn-light stretch-button" onClick={logout()}>Log Out</button>
                    </div>
                    <div className="button-container">
                        <div className="stretch-button" id="budget-owner"></div>
                        <button type="button" className="btn btn-light stretch-button" onClick={seeHome()}>Home</button>
                    </div>
                    <div className="button-container">
                        <button type="button" className="btn stretch-button" disabled style={{backgroundColor: 'green'}}>Projected</button>
                        <button type="button" className="btn btn-light stretch-button" onClick={actual()}>Actual</button>
                    </div>
                </div>
            </div>
            <div className="budget-data-container">
                <h2 className="income">Income</h2>
                <div className="budget-data-table">
                    <div className="budget-data-row">
                        <div className="budget-data-header"></div>
                        <div className="budget-data-header">Jan</div>
                        <div className="budget-data-header">Feb</div>
                        <div className="budget-data-header">Mar</div>
                        <div className="budget-data-header">Apr</div>
                        <div className="budget-data-header">May</div>
                        <div className="budget-data-header">Jun</div>
                        <div className="budget-data-header">Jul</div>
                        <div className="budget-data-header">Aug</div>
                        <div className="budget-data-header">Sep</div>
                        <div className="budget-data-header">Oct</div>
                        <div className="budget-data-header">Nov</div>
                        <div className="budget-data-header">Dec</div>
                        <div className="budget-data-header">Yearly Total By Category</div>
                    </div>
                    <div className="income-container" />
                    <div className="budget-data-row" id="month-income">
                        <div className="budget-data-header">Month's income</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                    </div>
                </div>
            </div>
            <div className="budget-data-container">
                <h2 className="expense">Expenses</h2>
                <div className="budget-data-table">
                    <div className="budget-data-row">
                        <div className="budget-data-header"></div>
                        <div className="budget-data-header">Jan</div>
                        <div className="budget-data-header">Feb</div>
                        <div className="budget-data-header">Mar</div>
                        <div className="budget-data-header">Apr</div>
                        <div className="budget-data-header">May</div>
                        <div className="budget-data-header">Jun</div>
                        <div className="budget-data-header">Jul</div>
                        <div className="budget-data-header">Aug</div>
                        <div className="budget-data-header">Sep</div>
                        <div className="budget-data-header">Oct</div>
                        <div className="budget-data-header">Nov</div>
                        <div className="budget-data-header">Dec</div>
                    </div>
                    <div className="budget-data-header">Yearly Total By Category</div>
                </div>
                <div className="expenses-container" />
                <div className="budget-data-row" id="month-expenses">
                    <div className="budget-data-header">Month’s Expenses</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                    <div className="budget-data neut">$0.00</div>
                </div>
            </div>
            <div className="budget-data-container">
                <div className="budget-data-table">
                    <div className="budget-data-row">
                        <div className="budget-data-header"></div>
                        <div className="budget-data-header">Jan</div>
                        <div className="budget-data-header">Feb</div>
                        <div className="budget-data-header">Mar</div>
                        <div className="budget-data-header">Apr</div>
                        <div className="budget-data-header">May</div>
                        <div className="budget-data-header">Jun</div>
                        <div className="budget-data-header">Jul</div>
                        <div className="budget-data-header">Aug</div>
                        <div className="budget-data-header">Sep</div>
                        <div className="budget-data-header">Oct</div>
                        <div className="budget-data-header">Nov</div>
                        <div className="budget-data-header">Dec</div>
                    </div>
                    <div className="budget-data-row" id="month-net">
                        <div className="budget-data-header">Month’s Net Gain</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                    </div>
                    <div className="budget-data-row" id="month-total">
                        <div className="budget-data-header">Total Savings by End of Month</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>
                        <div className="budget-data neut">$0.00</div>                    
                    </div>
                </div>
            </div>
        </main>
    );
}

function logout() {
    console.log("placeholder");
}

function seeHome() {
    console.log("placeholder");
}

function actual() {
    console.log("placeholder");
}

function addIncome() {
    console.log("placeholder");
}

function addExpense() {
    console.log("placeholder");
}

function changeAddSelection() {
    console.log("placeholder");
}

function changeHeaderSelection() {
    console.log("placeholder");
}

function changeMonthSelection() {
    console.log("placeholder");
}

function makeChange() {
    console.log("placeholder");
}