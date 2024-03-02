//Feature: Be able to see components of the sum for each cell
//Feature: Don't allow income/expense header to be the same name as username (otherwise it wipes out that data,
//although this won't be necessary once we have a SQL database probably) -- also don't allow other keywords
//Feature: Insert commas after every third integer
//Feature: Switch the $ and - on negative numbers

// TODO: Add a delete button for fields
// TODO: Add a way to edit field names
// TODO: Prevent generating duplicate headers -- maybe do this in the load function

// TODO: Update projected and actual sheet's rows based on each other's calls (maybe store stuff in localStorage?)
// ^^^ Implement this with a load() function

let viewNum = 12;
let user = localStorage.getItem("currentUser");
let users = JSON.parse(localStorage.getItem("users"));
let userData = null
for (data of users) {
    if (data.username === user) userData = data;
}
load();


//TODO: Make load async
//TODO: Either have a parameter for load() or a different page for acutal, otherwise they'll both load the same data
function load() {
    initialClass()
    loadData(true); // Load Income
    loadData(false); // Load Expenses
}


function initialClass() {
    let initial = document.querySelector("#initial");
    //TODO: See if this works without the commented out code
    // sliceNum = initial.textContent.includes("-") ? 2 : 1;
    // initial.className = dataClass(initial.textContent.slice(sliceNum), true);
    initial.className = dataClass(userData.initial, true);
}


function loadData(isIncome) {
    let list = userData.expenses;
    if (isIncome) list = userData.income;

    //Generate header and data for each row and pass that into loadRow()
    for (let i = 0; i < list.length; i++) {
        header = list[i][0];
        data = [];
        for (let j = 0; j < list[i].length; j++) data.push(list[i][j]);
        loadRow(header, data, isIncome);
    }
}


function loadRow(header, data, isIncome) {
    let row = document.createElement("div");
    row.className = "budget-data-row";

    let rowHeader = document.createElement("div");
    rowHeader.className = "budget-data-header";
    rowHeader.textContent = header;
    row.appendChild(rowHeader);

    //Add header name to header-selector
    let headerOption = document.createElement("option");
    headerOption.textContent = header;
    let headerID = (isIncome) ? "#header-income" : "#header-expenses";
    document.querySelector(headerID).appendChild(headerOption)
    
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
    rowTotal.textContent = "$" + total.toFixed(2);
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


function addIncome() {
    addData(true);
}


function addExpense() {
    addData(false);
}


function addData(isIncome) {
    //Initialize header
    let headerName = "";
    if (isIncome) headerName = prompt("Enter name for income field");
    else headerName = prompt("Enter name for expense field");
    //If they clicked cancel, don't continue
    if (headerName === null || headerName === "") return;
    
    //Initialize data
    let data = [headerName];
    for (let i = 0; i < viewNum; i++) {
        data.push(0.01*i);
    }
    
    //Store the header and data
    //For each user, if the user
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == user) {
            if (isIncome) userData.income.push(data);
            else userData.expenses.push(data);
            users[i] = userData;
            localStorage.setItem("users", JSON.stringify(users));
            break;
        }
    }

    //Load header and data
    loadRow(headerName, data, isIncome);

    //TODO: Make sure a header name with quotation marks won't mess with JSON
    //TODO: Make this display according to view
}


function calculateMonth(data, isIncome) {
    //This calculates the first of every header of that type, and so forth
    let list = userData.expenses;
    if (isIncome) list = userData.income;
    
    sum = []
    for (let i = 0; i < viewNum; i++) sum.push(0);
    //For each header, add up the sum of each data point
    for (let i = 0; i < list.length; i++) {
        for (let j = 1; j < data.length; j++) {
            sum[j-1] += data[j];
            loadMonthData(j, sum[j-1]);
        }
    }
    
    //Calculate the total for the inputted row
    let total = 0;
    for (let i = 0; i < sum.length; i++) total += sum[i];
    loadMonthData(viewNum+1,total);

    //Update the net and total values
    let netGainSum = 0;
    calculateMonthNet();
    calculateTotal();


    function loadMonthData(counter, currSum) {
        //Change the month's data to reflect the new data
        let id = "#month-expenses";
        if (isIncome) id = "#month-income";
        let monthData = document.querySelector(id).children[counter]
        monthData.textContent = "$" + currSum.toFixed(2);
        monthData.className = dataClass(parseFloat(currSum), isIncome);
    }


    function calculateMonthNet() {
        let net = document.querySelector("#month-net");
        for (let i = 1; i < document.querySelector("#month-income").children.length - 1; i++) {
            let income = parseFloat(document.querySelector("#month-income").children[i].textContent.slice(1));
            let expense = parseFloat(document.querySelector("#month-expenses").children[i].textContent.slice(1));
            let monthSum = (income - expense);
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
            let initSlice = initial.className.includes("neg") ? 2 : 1;
            let netSlice = net.children[i].className.includes("neg") ? 2 : 1;
            let totalSlice = total.children[i].className.includes("neg") ? 2 : 1;
            let neg = net.children[i].className.includes("neg") ? -1 : 1;
            if (i === 1){
                let currValue = (parseFloat(initial.textContent.slice(initSlice))
                + neg*parseFloat(net.children[i].textContent.slice(netSlice))).toFixed(2)
                total.children[i].textContent = "$" + currValue;
                total.children[i].className = dataClass(currValue, true);
            }
            else {
                let currValue = (parseFloat(total.children[i-1].textContent.slice(totalSlice))
                + neg*parseFloat(net.children[i].textContent.slice(netSlice))).toFixed(2)
                total.children[i].textContent = "$" + currValue;
                total.children[i].className = dataClass(currValue, true)
                if (i === net.children.length-1) {
                    //Calculate Total Savings
                    document.querySelector("#total").textContent = "$" + currValue;
                    document.querySelector("#total").className = dataClass(currValue, true);
                    //Calculate Total Net Gain
                    document.querySelector("#net-gain").textContent = "$" + netGainSum.toFixed(2);
                    document.querySelector("#net-gain").className = dataClass(netGainSum, true);
                }
            }
        }
    }
}




function makeChange() {
    //TODO: Have this edit the data in localStorage, then call load
    let input = parseFloat((parseFloat((document.querySelector("#edit-cell").value))).toFixed(2));
    if (!input) input = (0).toFixed(2);
    console.log("Input: " + String(input));

    let add = document.querySelector("#add-selector").value;
    console.log(add);

    let header = document.querySelector("#header-selector").value;
    console.log(header);

    let monthNum = monthToNum(document.querySelector("#month-selector").value);
    console.log("Month " + monthNum);
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


function clearStorage() {
    localStorage.clear();
    console.log("Cleared");
}