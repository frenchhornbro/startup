//Feature: Be able to see components of the sum for each cell
//Feature: Don't allow income/expense header to be the same name as username (otherwise it wipes out that data,
//although this won't be necessary once we have a SQL database probably) -- also don't allow other keywords

// TODO: Add a delete button
// TODO: Add a way to edit field names
// TODO: Prevent generating duplicate headers -- maybe do this in the load function

// TODO: Update projected and actual sheet's rows based on each other's calls (maybe store stuff in localStorage?)
// ^^^ Implement this with a load() function

load();

//TODO: Make load async
//TODO: Either have a parameter for load() or a different page for acutal, otherwise they'll both load the same data
function load() {
    loadData(true);
    loadData(false);
}


function loadData(isIncome) {
    //TODO: call calculate()
    let listType = "expenseHeaderList";
    if (isIncome) listType = "incomeHeaderList";    
    let moreHeaders = true;
    let headerCounter = 0;

    //TODO: This works, but implement it using parseHeaders();
    while (moreHeaders) {
        let isComma = false;
        let header = "";
        //Get the next header
        while (!isComma) {
            let currChar = localStorage.getItem(listType)[headerCounter];
            if (!currChar) {
                moreHeaders = false;
                break;
            }
            else if (currChar != ",") {
                header += currChar;
                headerCounter++;
            }
            else {
                isComma = true;
                headerCounter++;
            }
        }
        if (!moreHeaders && headerCounter === 0) break;


        console.log("header = " + header);
        data = parseData(header);
        console.log("data = " + data);
        
        //Use the header and data to load the row
        loadRow(header, data, isIncome);
    }
}


function parseHeaders(listType) {
    let headers = [];
    let currHeader = "";
    let counter = 0;

    while (localStorage.getItem(listType)[counter]) {//while input hasn't run out
        let currChar = localStorage.getItem(listType)[counter];
        if (currChar != ",") currHeader += currChar;
        else {
            headers.push(currHeader);
            currHeader = "";
        }
        counter++
    }
    if (counter != 0) headers.push(currHeader);
    return headers;
}


function parseData(header) {
    //Use that header as the key for localStorage to access the data
    let data = [];
    let dataString = [];
    for (let i = 0; i < localStorage.getItem(header).length; i++) {
        let currChar = localStorage.getItem(header)[i];
        if (currChar != ",") {
            dataString += currChar;
            if (i === localStorage.getItem(header).length - 1) data.push(dataString);
        }
        else {
            data.push(dataString);
            dataString = "";
        }
    }
    return data;
}


function loadRow(header, data, isIncome) {
    let row = document.createElement("div");
    row.className = "budget-data-row";

    let rowHeader = document.createElement("div");
    rowHeader.className = "budget-data-header";
    rowHeader.textContent = header;
    row.appendChild(rowHeader);
    
    let total = 0
    for (const num in data) {
        let rowData = document.createElement("div");
        rowData.className = dataClass(parseFloat(data[num]));
        rowData.textContent = "$" + data[num];
        row.appendChild(rowData);

        total += parseFloat(data[num]);
    }

    let rowTotal = document.createElement("div");
    rowTotal.className = dataClass(total.toFixed(2));
    rowTotal.textContent = "$" + total.toFixed(2);
    row.appendChild(rowTotal);
    if (isIncome) document.querySelector(".income-container").appendChild(row);
    else document.querySelector(".expenses-container").appendChild(row);
    
    calculateMonth(isIncome);


    function dataClass(num) {
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
}


function addIncome() {
    addData(true);
}


function addExpense() {
    addData(false);
}


function addData(isIncome) {
    let headerName = prompt("Enter label for income category");
    if (isIncome) {
        let headerList = localStorage.getItem("incomeHeaderList");
        if (!headerList) localStorage.setItem("incomeHeaderList", headerName);
        else localStorage.setItem("incomeHeaderList", localStorage.getItem("incomeHeaderList") + "," + headerName);
    }
    else {
        let headerList = localStorage.getItem("expenseHeaderList");
        if (!headerList) localStorage.setItem("expenseHeaderList", headerName);
        else localStorage.setItem("expenseHeaderList", localStorage.getItem("expenseHeaderList") + "," + headerName);
    }

    let data = [];
    for (let i = 0; i < 12; i++) {
        let dataPoint = (0.01 * i).toString();
        // let dataPoint = "0.02";
        let headerData = localStorage.getItem(headerName);
        if (headerData === null) localStorage.setItem(headerName, dataPoint);
        else localStorage.setItem(headerName, localStorage.getItem(headerName) + "," + dataPoint);
        console.log(localStorage.getItem(headerName));
        data.push(dataPoint);
    }
    loadRow(headerName, data, isIncome);

    //TODO: Don't allow headerNames with commas
    //TODO: Make this display according to view
}


function calculateMonth(isIncome) {
    //This calculates the first of every header of that type, and so forth
    let listType = "expenseHeaderList";
    if (isIncome) listType = "incomeHeaderList";
    let sum = 0;
    let headers = parseHeaders(listType);
    for (let i = 0; i < headers.length; i++) {
        let data = parseData(headers[i]);
        sum += parseFloat(data[6]);
    }
    console.log("Sum = " + sum);
}




function makeChange() {
    //TODO: Have this edit the data in localStorage, then call loadRow
    let input = parseInt(document.querySelector("#edit-cell").value);
    if (!input) input = 0;
    console.log(input);

    let month = document.querySelector(".month").value;
    console.log(month);

    let monthNum = monthToNum(month);
    console.log(monthNum);
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
    localStorage.setItem("username", "password");
    localStorage.setItem("incomeHeaderList", "");
    localStorage.setItem("expenseHeaderList", "");
}