const currencyHolder = document.getElementById("currency");
const balanceHolder = document.getElementById("balance");
const tnxNameHolder = document.getElementById("name");
const tnxAmountHolder = document.getElementById("amount");
const income = document.getElementById("income");
const expense = document.getElementById("expense");

const saveButton = document.getElementById("save");
const cancelButton = document.getElementById("cancel")
const displayList = document.getElementById("listoftransactions");

let symbol = "$";
let listOfTransactions = [{
        name: 'name',
        amount: 'amount',
        type: 'income/expense'
    }];
let currentBalance = 0;

let editIndex = -1

function edit(i){
    cancelButton.style.display = "block"
    editIndex = i
    tnxNameHolder.value = listOfTransactions[i].name
    tnxAmountHolder.value = listOfTransactions[i].amount
    if(listOfTransactions[i].type == "income"){
        income.checked = true
    }
    else{
        expense.checked = true
    }
}

function del(i){
    listOfTransactions = listOfTransactions.filter((e,index) => i !== index);
    render()
}

function saveData(){
    localStorage.setItem("symbol", symbol)
    localStorage.setItem("balance", currentBalance)
    localStorage.setItem("list", JSON.stringify(listOfTransactions))
}

function loadData(){
    symbol = localStorage.getItem("symbol")
    listOfTransactions = JSON.parse(localStorage.getItem("list"))
    currentBalance = Number(localStorage.getItem("balance"))
}

function render(){
    if(listOfTransactions.length === 0){
        currentBalance = 0
    }
    else{
        currentBalance = listOfTransactions.reduce((total, value) => {return value.type == "expense" ? total - value.amount : total + value.amount}, 0);
    }
    displayList.innerHTML = "";
    
    if(listOfTransactions.length === 0){
        displayList.innerHTML += "No Transactions Found";
    }
    else{
        listOfTransactions.forEach((e,i) => {
            displayList.innerHTML += `
                <li class="transaction ${e.type}">
                <p>${e.name}</p>
                <div class="right">
                    <p>${symbol}${e.amount}</p>
                    <button onclick="edit(${i})">edit</button>
                    <button onclick="del(${i})">delete</button>
                </div>
                </li>`
        })
    }

    currencyHolder.textContent = symbol
    balanceHolder.innerText = currentBalance
    saveData()
}

cancelButton.addEventListener("click", () => {
    editIndex = -1
    tnxNameHolder.value = ""
    tnxAmountHolder.value = 0
    cancelButton.style.display = "none"
})

saveButton.addEventListener("click", () => {
    if(tnxNameHolder.value == "" || Number(tnxAmountHolder) <= 0){
        alert("Can't do that!")
        return;
    }
    let transactions = {
        name: tnxNameHolder.value,
        amount: Number(tnxAmountHolder.value),
        type: income.checked? "income" : "expense"
    };
    if(editIndex == -1) listOfTransactions.push(transactions);
    else listOfTransactions[editIndex] = transactions
    editIndex = -1
    tnxNameHolder.value = ""
    tnxAmountHolder.value = 0
    render()
    cancelButton.style.display = none
})

loadData();
render();
