let fillterByName = document.getElementById("fillterByName");
let fillterByAmount = document.getElementById("fillterByAmount")
let customers = [];
let transactions = [];
let myChart;
let tBody = document.getElementById("contents")

async function getAllData(nameFillter = "", amountFilter = "") {
    let response = await fetch("main.json");
    let result = await response.json();
    transactions = result.transactions;
    customers = result.customers;
    let content="";
    let filteredTransactions = [];
    for (let i = 0; i < transactions.length; i++) {
        let transactionsElement = transactions[i];
        const customer =result.customers.find(c => c.id == transactionsElement.customer_id);

        if (
            (nameFillter === "" ||
                customer.name.toLowerCase().includes(nameFillter.toLowerCase())) &&
            (amountFilter === "" ||
                transactionsElement.amount.toString().includes(amountFilter))
            ){
            content += `<tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${transactionsElement.date}</td>
            <td>${transactionsElement.amount}</td>
            </tr>`;
            filteredTransactions.push(transactionsElement.amount);
        }
    }
    tBody.innerHTML = content;
    updateChartToShowData(filteredTransactions);
}
getAllData();


fillterByName.addEventListener("input", function () {
    getAllData(fillterByName.value, fillterByAmount.value);
});

fillterByAmount.addEventListener("input", function () {
    getAllData(fillterByName.value, fillterByAmount.value);
});

function updateChartToShowData(data) {
    const ctx = document.getElementById('chartData').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map((_, index) => `Transaction ${index + 1}`),
            datasets: [{
                label: 'Transaction Amounts',
                data: data,
                backgroundColor: "rgba(242, 100, 25,0.6);",
                borderColor: "rgba(247, 37, 133,0.8)",
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}