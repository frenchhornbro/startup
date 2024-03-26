//Feature: Be able to see components of the sum for each cell
//Feature: Insert commas after every third integer
//Feature: Switch the $ and - on negative numbers
//Feature: Be able to edit field names after creation

// TODO: Add a delete button for fields
// TODO: Prevent generating duplicate headers -- maybe do this in the load function
//TODO: Upon change of income/expense type to "Initial", month selector is disabled


let addSelection = document.querySelector("#add-selector").options[0];
let headerSelection = document.querySelector("#header-selector").options[0];
let monthSelection = document.querySelector("#month-selector").options[0];

let incomeRestarted = false;
let expenseRestarted = false;
let viewNum = 12;

let user = localStorage.getItem("currentUser");
let budget = localStorage.getItem("currentBudget");
let users = JSON.parse(localStorage.getItem("users"));
let thisUser = null;
let userData = null;
for (thisUser of users) {
    if (thisUser.username === user) {
        thisUser = thisUser;
        break;
    }
}

for (thisBudget of thisUser.budgets) {
    if (thisBudget.budgetName === budget) {
        userData = thisBudget;
        break;
    }
}


//TODO: Make load async
function load(isProjected) {
    unload();
    initialClass();
    loadData(true, isProjected); // Load Income
    loadData(false, isProjected); // Load Expenses
    loadTitle();
    loadCurrSelections();
}


function unload() {
    incomeRestarted = true;
    expenseRestarted = true;
    while (document.querySelector(".inputted-data-row") !== null) {
        document.querySelector(".inputted-data-row").remove();
    }
    while (document.querySelector("#inputted-option") !== null) {
        document.querySelector("#inputted-option").remove();
    }
}


function initialClass() {
    let initial = document.querySelector("#initial");
    initial.textContent = "$" + userData.initial.toFixed(2);
    initial.className = dataClass(initial.textContent.slice(1), true);
    initial.className = dataClass(userData.initial, true);
}


function loadData(isIncome, isProjected) {
    let list = (isIncome) ? ((isProjected) ? userData.pIncome : userData.aIncome) : ((isProjected) ? userData.pExpenses : userData.aExpenses);

    //Generate header and data for each row and pass that into loadRow()
    for (let i = 0; i < list.length; i++) {
        header = list[i][0];
        data = [];
        for (let j = 0; j < list[i].length; j++) data.push(list[i][j]);
        loadRow(header, data, isIncome);
    }
}

function loadTitle() {
    let title = document.querySelector("#title");
    title.textContent = thisBudget.budgetName;
}

function loadCurrSelections() {
    document.querySelector("#add-selector").value = addSelection.value;
    document.querySelector("#header-selector").value = headerSelection.value;
    document.querySelector("#month-selector").value = monthSelection.value;
}


function loadRow(header, data, isIncome) {
    let row = document.createElement("div");
    row.className = "budget-data-row inputted-data-row";

    let rowHeader = document.createElement("div");
    rowHeader.className = "budget-data-header";
    rowHeader.textContent = header;
    row.appendChild(rowHeader);

    //Add header name to header-selector
    let headerOption = document.createElement("option");
    headerOption.textContent = header;
    headerOption.className = (isIncome) ? "option-income" : "option-expenses";
    headerOption.id = "inputted-option";
    let headerID = (isIncome) ? "#header-income" : "#header-expenses";
    document.querySelector(headerID).appendChild(headerOption);
    
    let total = 0
    for (const i in data) {
        if (i !== String(0)) {
            let rowData = document.createElement("div");
            rowData.className = dataClass(data[i], isIncome);
            rowData.textContent = "$" + data[i];
            row.appendChild(rowData);
            
            total += data[i];
        }
    }

    let rowTotal = document.createElement("div");
    rowTotal.textContent = "$" + Number(total).toFixed(2);
    rowTotal.className = dataClass(total, isIncome);
    row.appendChild(rowTotal);
    if (isIncome) document.querySelector(".income-container").appendChild(row);
    else document.querySelector(".expenses-container").appendChild(row);
    
    calculateMonth(data, isIncome);
}


function dataClass(num, isIncome) {
    num = Number(num);
    num = num.toFixed(2);
    if (isIncome) {
        if (num > 0) return "budget-data pos";
        else if (num < 0) return "budget-data neg";
        else return "budget-data neut";
    }
    else {
        if (num > 0) return "budget-data neg";
        else if (num < 0) return "budget-data pos";
        else return "budget-data neut";
    }
}


function addIncome(isProjected) {
    addData(true, isProjected, true);
}


function addExpense(isProjected) {
    addData(false, isProjected, true);
}


function addData(isIncome, isProjected, first, headerName = "") {
    if (first) {
        //Initialize header
        if (isIncome) headerName = prompt("Enter name for income field");
        else headerName = prompt("Enter name for expense field");
        //If they clicked cancel, don't continue
        if (headerName === null || headerName === "") return;
        //If the name is a duplicate, alert them and don't continue
        if (headerName === "Initial") {
            alert("That field name is already in use");
            return;
        }
        for (let i = 0; i < userData.pIncome.length; i++) {
            if (userData.pIncome[i][0] === headerName) {
                alert("That field name is already in use");
                return;
            }
            else console.log(`Income header ${userData.pIncome[i][0]} != inputted header ${headerName}}`);
        }
        for (let i = 0; i < userData.pExpenses.length; i++) {
            if (userData.pExpenses[i][0] === headerName) {
                alert("That field name is already in use");
                return;
            }
            else console.log(`Expense header ${userData.pExpenses[i][0]} != inputted header ${headerName}}`);
        }
    }
    
    //Initialize data
    let data = [headerName];
    for (let i = 0; i < viewNum; i++) {
        data.push(0);
    }
    
    //Store the header and data
    //For each user, if the user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == user) {
            if (isIncome) {
                if (isProjected) userData.pIncome.push(data);
                else userData.aIncome.push(data);
            }
            else {
                if (isProjected) userData.pExpenses.push(data);
                else userData.aExpenses.push(data);
            }
            for (let j = 0; j < users[i].budgets.length; j++) {
                if (users[i].budgets[j].budgetName === budget) {
                    users[i].budgets[j] = userData
                    localStorage.setItem("users", JSON.stringify(users));
                    break;
                }
            }
            break;
        }
    }

    //Store row for the opposite sheet, or load header and data
    if (first) {
        addData(isIncome, !isProjected, false, headerName);
        loadRow(headerName, data, isIncome);
    }

    //TODO: Make this display according to view
}


function calculateMonth(data, isIncome) {
    sums = []
    let monthTag = (isIncome) ? "#month-income" : "#month-expenses";
    if ((!incomeRestarted && monthTag === "#month-income") || (!expenseRestarted && monthTag === "#month-expenses")) {
        for (let i = 1; i <= viewNum; i++) sums.push(Number(document.querySelector(monthTag).children[i].textContent.slice(1)));
    }
    else {
        for (let i = 1; i <= viewNum; i++) sums.push(0);
    }
    if (monthTag === "#month-income") incomeRestarted = false;
    else expenseRestarted = false;

    for (let i = 1; i < data.length; i++) {
        sums[i-1] += Number(data[i]);
        loadMonthData(i, sums[i-1]);
    }
    
    //Calculate the total for the inputted row
    let total = 0;
    for (let i = 0; i < sums.length; i++) total += Number(sums[i]);
    loadMonthData(viewNum+1,total);

    //Update the net and total values
    let netGainSum = 0;
    calculateMonthNet();
    calculateTotal();


    function loadMonthData(counter, currSum) {
        //Change the month's data to reflect the new data
        let id = "#month-expenses";
        if (isIncome) id = "#month-income";
        let monthData = document.querySelector(id).children[counter];
        monthData.textContent = "$" + Number(currSum).toFixed(2);
        monthData.className = dataClass(parseFloat(currSum), isIncome);
    }


    function calculateMonthNet() {
        let net = document.querySelector("#month-net");
        for (let i = 1; i < document.querySelector("#month-income").children.length - 1; i++) {
            let monthIncome = parseFloat(document.querySelector("#month-income").children[i].textContent.slice(1));
            let monthExpenses = parseFloat(document.querySelector("#month-expenses").children[i].textContent.slice(1));
            let monthSum = (monthIncome - monthExpenses);
            net.children[i].textContent = "$" + monthSum.toFixed(2);
            net.children[i].className = dataClass(monthSum, true);
            netGainSum += parseFloat((monthSum).toFixed(2));
        }
    }

    
    function calculateTotal() {
        let initial = document.querySelector("#initial");
        let net = document.querySelector("#month-net");
        let total = document.querySelector("#month-total");
        for (let i = 1; i < net.children.length; i++) {
            if (i === 1){
                let currValue = (parseFloat(initial.textContent.slice(1))
                + parseFloat(net.children[i].textContent.slice(1))).toFixed(2);
                total.children[i].textContent = "$" + currValue;
                total.children[i].className = dataClass(currValue, true);
            }
            else {
                let currValue = (parseFloat(total.children[i-1].textContent.slice(1))
                + parseFloat(net.children[i].textContent.slice(1))).toFixed(2)
                total.children[i].textContent = "$" + currValue;
                total.children[i].className = dataClass(currValue, true);
                if (i === net.children.length-1) {
                    //Set Total Savings
                    document.querySelector("#total").textContent = "$" + currValue;
                    document.querySelector("#total").className = dataClass(currValue, true);
                    //Set Total Net Gain
                    document.querySelector("#net-gain").textContent = "$" + netGainSum.toFixed(2);
                    document.querySelector("#net-gain").className = dataClass(netGainSum, true);
                }
            }
        }
    }
}




function makeChange(isProjected) {
    let input = parseFloat((parseFloat((document.querySelector("#edit-cell").value))).toFixed(2));
    if (!input) input = Number((0).toFixed(2));

    let addOrReplace = document.querySelector("#add-selector").value;

    let headerSelector = document.querySelector("#header-selector");
    let currSelection = headerSelector.options[headerSelector.selectedIndex];

    let monthNum = monthToNum(document.querySelector("#month-selector").value);
    
    let childNum = null;

    if (currSelection.className !== "option-initial") {
        let containerClass = (currSelection.className === "option-income") ? ".income-container" : ".expenses-container";
        let container = document.querySelector(containerClass);
        
        //Select row based on the first one with that given header name
        let rowToChange = null;
        for (let i = 0; i < container.children.length; i++) {
            if (container.children[i].children[0].textContent === currSelection.value) {
                rowToChange = container.children[i];
                childNum = i;
                break;
            }
        }
        
        let cellToChange = rowToChange.children[monthNum+1];
        if (addOrReplace === "Replace") {
            let storageType = (currSelection.className === "option-income") ? "income" : "expenses";
            storeData(input, storageType);
        }
        else {
            let value = Number(cellToChange.textContent.slice(1)) + Number(input);
            let storageType = (currSelection.className === "option-income") ? "income" : "expenses";
            storeData(value, storageType);
        }
    }
    else {
        initial(isProjected);
    }
    load(isProjected);
    
    function initial(isProjected) {
        let initial = document.querySelector("#initial");
        if (addOrReplace === "Replace") {
            initial.textContent = "$" + input.toFixed(2);
            initial.className = dataClass(input, true);
            storeData(input, "initial");
        }
        else {
            let initNum = Number(initial.textContent.slice(1)) + input;
            initial.textContent = "$" + (initNum).toFixed(2);
            initial.className = dataClass(initNum, true);
            storeData(initNum, "initial");
        }
    }
        
    function storeData(numToStore, storageType) {
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === user) {
                if (storageType === "income") {
                    if (isProjected) userData.pIncome[childNum][monthNum+1] = numToStore;
                    else userData.aIncome[childNum][monthNum+1] = numToStore;
                }
                else if (storageType === "expenses") {
                    if (isProjected) userData.pExpenses[childNum][monthNum+1] = numToStore;
                    else userData.aExpenses[childNum][monthNum+1] = numToStore;
                }
                else {
                    userData.initial = numToStore;
                }
                for (let j = 0; j < users[i].budgets.length; j++) {
                    if (users[i].budgets[j].budgetName === budget) {
                        users[i].budgets[j] = userData
                        localStorage.setItem("users", JSON.stringify(users));
                        break;
                    }
                }
                break;
            }
        }
    }
}


function monthToNum(month) {
    switch (month) {
        case "Jan": return 0;
        case "Feb": return 1;
        case "Mar": return 2;
        case "Apr": return 3;
        case "May": return 4;
        case "Jun": return 5;
        case "Jul": return 6;
        case "Aug": return 7;
        case "Sep": return 8;
        case "Oct": return 9;
        case "Nov": return 10;
        case "Dec": return 11;
        default: return 0;
    }
}


function changeAddSelection() {
    let optionNum = 0;
    let selection = document.querySelector("#add-selector");
    while (selection.options[optionNum].value !== selection.value) optionNum++;
    addSelection = selection.options[optionNum];
}

function changeHeaderSelection() {
    let optionNum = 0;
    let selection = document.querySelector("#header-selector");
    while (selection.options[optionNum].value !== selection.value) optionNum++;
    headerSelection = selection.options[optionNum];

    console.log(selection.options[optionNum].className); //TODO: <<< If this is equal to "option-initial", disable the month-selector
}

function changeMonthSelection() {
    let optionNum = 0;
    let selection = document.querySelector("#month-selector");
    while (selection.options[optionNum].value !== selection.value) optionNum++;
    monthSelection = selection.options[optionNum];
}

function projected() {
    window.location.href = "projected.html";
}

function actual() {
    window.location.href = "actual.html";
}

function seeGroup() {
    window.location.href = "group.html";
}

function clearStorage() {
    localStorage.clear();
    console.log("Cleared");
}