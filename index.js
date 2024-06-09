import PocketBase from './pocketbase.es.mjs'

const url = 'https://imthea.pockethost.io/'
const client = new PocketBase(url)

async function getAllExpenses() {
  const records = await client.collection('expenses').getFullList()
  return records
}


async function displayAllExpenses() {
  const expenses = await getAllExpenses()
  console.log(expenses)

  const wrapper = document.querySelector('.wrapper')
  wrapper.innerHTML = ``
  for (let i = 0; i < expenses.length; i++) {
    let currentExpense = expenses[i]
    wrapper.innerHTML = wrapper.innerHTML + `
    <div class="expenseItem" data-aos="fade-up" data-aos-delay="${250*i}">
      <p>${currentExpense.date}</p>
      <h4>${currentExpense.name}</h4>
      <p>${currentExpense.amount}</p>
      <p id="tag">${currentExpense.Category}</p>
      <div class="btnGroup">
        <button class="btn" id="editBtn">Edit</button>
        <button class="btn" id="deleteBtn" data-recordid="${currentExpense.id}">Delete</button>
      </div>
    </div>
    `
  }

  const deleteBtns = document.querySelectorAll('#deleteBtn')
  console.log(deleteBtns)

  for (let i = 0; i < deleteBtns.length; i++) {
    let currentBtn = deleteBtns[i]
    currentBtn.addEventListener('click' , async () => {
      // console.log(currentBtn.dataset.recordid)
      await client.collection('expenses').delete(currentBtn.dataset.recordid)
      displayAllExpenses()
    })
  }

  displayChart(expenses)

}

function addNewExpense() {
  const form = document.querySelector('#createExpense')
  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const expenseDate = document.querySelector('#date')
    const expenseName = document.querySelector('#name')
    const expenseAmount = document.querySelector('#amount')
    const expenseCategory = document.querySelector('#category')

    const data = {
      "name": expenseName.value,
      "amount": parseFloat(expenseAmount.value),
      "date": expenseDate.value,
      "Category": expenseCategory.value
    };

    const record = await client.collection('expenses').create(data)
    alert('New data is created successfully')

    expenseName.value = ``
    expenseAmount.value = ``
    expenseDate.value = ``
    expenseCategory.value = ``

    displayAllExpenses()

  })
}

function displayChart(expenses) {

  //food, entertainment, study, health, other
  const data = [
    {
      Category: "food",
      amount: 0
    }, 
    {
      Category: "entertainment",
      amount: 0
    }, 
    {
      Category: "study",
      amount: 0
    }, 
    {
      Category: "health",
      amount: 0
    }, 
    {
      Category: "other",
      amount: 0
    }
  ]

  for (let i = 0; i < expenses.length; i++) {
    let expense = expenses[i]
    //console.log(expense)
    if (expense.Category == "food") {
      data[0].amount += expense.amount 
    } else if (expense.Category == "entertainment") {
      data[1].amount += expense.amount
    } else if (expense.Category == "study") {
      data[2].amount += expense.amount
    } else if (expense.Category == "health") {
      data[3].amount += expense.amount
    } else {
      data[4].amount += expense.amount
    }
  }

  console.log(data)

  let chartStatus = Chart.getChart("myChart"); // <canvas> id
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }

  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map((item) => item.Category),
      datasets: [{
        label: 'Amount in USD',
        data: data.map((item) => item.amount),
        borderWidth: 1
      }]
    }
  });

}

window.addEventListener("DOMContentLoaded", async () => {

  // console.log("everything is ready")

  // console.log(client)

  displayAllExpenses()
  addNewExpense()

})