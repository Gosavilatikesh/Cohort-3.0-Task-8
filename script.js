lucide.createIcons();

function getCurrency(){
  return localStorage.getItem("currency") || "₹";
}

const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

menuToggle.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

// register logic

const registerForm = document.querySelector("#registerForm");
const username = document.querySelector("#username");
const password = document.querySelector("#password");

function registerUser() {
  const userArr = JSON.parse(localStorage.getItem("users")) || [];

  const userName = username.value.trim();
  const passWord = password.value.trim();

  let user = {
    userName,
    passWord,
  };

  if (userName.trim() === "" || passWord.trim() === "") {
    alert("Please fill all fields");
    return;
  }

  const exists = userArr.some((user) => user.userName === userName);

  if (exists) {
    alert("Username already exists");
    return;
  }

  userArr.push(user);

  localStorage.setItem("users", JSON.stringify(userArr));
  registerForm.reset();

  alert("Registration Successfull");

  isLogin = true;

  authTitle.textContent = "Welcome Back";
  authSubtitle.textContent = "Login to FinTrack Pro";
  authBtn.textContent = "Login";
  footerText.textContent = "Don't have an account?";
  toggleAuth.textContent = "Register";
}

//toggle logic
const authTitle = document.querySelector(".authTitle");
const authSubtitle = document.querySelector("#authSubtitle");
const authBtn = document.querySelector("#authBtn");
const footerText = document.querySelector("#footerText");
const toggleAuth = document.querySelector("#toggleAuth");
const authContainer = document.querySelector("#authContainer");
const dashboardApp = document.querySelector("#dashboardApp");

let isLogin = false;

toggleAuth.addEventListener("click", (e) => {
  e.preventDefault();

  isLogin = !isLogin;

  if (isLogin) {
    authTitle.textContent = "Welcome Back";

    authSubtitle.textContent = "Login to FinTrack Pro";

    authBtn.textContent = "Login";

    footerText.textContent = "Don't have an account?";

    toggleAuth.textContent = "Register";
  } else {
    authTitle.textContent = "Create Account";

    authSubtitle.textContent = "Join FinTrack Pro";

    authBtn.textContent = "Register";

    footerText.textContent = "Already have an account?";

    toggleAuth.textContent = "Login here";
  }
});

//login logic

function loginUser() {
  const userName = username.value.trim();
  const passWord = password.value.trim();

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.find(
    (user) => user.userName === userName && user.passWord === passWord,
  );

  if (!foundUser) {
    alert("Invalid Username or Password");
    return;
  }

  localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
  authContainer.style.display = "none";
  dashboardApp.classList.remove("dashboard-hidden");
}

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (isLogin) {
    loginUser();
  } else {
    registerUser();
  }

  registerForm.reset();
});

//display username
const displayUser = document.querySelector(".display-username");
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
displayUser.textContent = `Hello, ${loggedInUser.userName}`;

// Logout logic

const logOut = document.querySelector("#btnLogout");

logOut.addEventListener("click", () => {
  authContainer.style.display = "flex";
  dashboardApp.classList.add("dashboard-hidden");
});

// dark mode logic
const darkToggle = document.querySelector("#darkModeToggle");

darkToggle.addEventListener("change", () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light",
  );
  lucide.createIcons();
});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");

  darkToggle.checked = true;
}

// chart logic

const ctx = document.querySelector("#financeChart").getContext("2d");
let financeChart;

function updateChart() {
  const income = transactions
    .filter((t) => t.type === "Income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "Expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  if (financeChart) {
    financeChart.destroy();
  }

  financeChart = new Chart(ctx, {
    type: "bar",

    data: {
      labels: ["Income", "Expense"],

      datasets: [
        {
          label: "Amount",

          data: [income, expense],

          backgroundColor: ["#16a34a", "#dc2626"],
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

// add transaction logic

const addBtn = document.querySelectorAll(".btn-add-transaction");
const modal = document.querySelector("#transactionModal");
const closeModal = document.querySelector("#closeModal");

addBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

closeModal.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// save transaction logic

let editId = null;

const transactionForm = document.querySelector("#transactionForm");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let type = e.target[0].value;
  let description = e.target[1].value.trim();
  let amount = Number(e.target[2].value);
  let date = e.target[3].value;
  let category = e.target[4].value;

  const transaction = {
    id: Date.now(),
    type,
    description,
    amount,
    date,
    category,
  };

  if (description.trim() === "" || amount <= 0) {
    alert("Please fill all fields");
    return;
  }

  if (editId === null) {
    transactions.push(transaction);
  } else {
    const index = transactions.findIndex((t) => t.id === editId);

    transactions[index] = {
      id: editId,
      type,
      description,
      amount,
      date,
      category,
    };
    editId = null;
  }

  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();
  updateSummary();
  updateChart();
  transactionForm.reset();
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
});

const tbody = document.querySelector("#transactionTableBody");
console.log(tbody);
console.log(document.body.innerHTML.includes("transactionTableBody"));

function displayTransactions(data = transactions) {
  tbody.innerHTML = "";

  if (data.length === 0) {
    tbody.innerHTML = `
        <tr class="empty-rom">
          <td colspan="5">
            No transaction recorded yet.                  
          </td>
        </tr>    
      `;

    return;
  }

  data.forEach((transaction) => {
    tbody.innerHTML += `
        <tr>
          <td>${transaction.date}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category}</td>
          <td>
            <span style="color: ${transaction.type === "Income" ? "#00A73D" : "#E80000"}; font-weight: 600;">
              ${transaction.type === "Income" ? "+" : "-"}${getCurrency()}${transaction.amount}
            </span>
          </td>

          <td>
            <button class="edit-btn" data-id="${transaction.id}">✏️</button>
            <button class="delete-btn" data-id="${transaction.id}">🗑️</button>
          </td>

        </tr>
      `;

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        deleteTransaction(id);
      });
    });

    // delete transaction logic

    //edit transaction logic

    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const transaction = transactions.find((t) => t.id === id);
        editId = id;

        document.querySelector("#type").value = transaction.type;
        document.querySelector("#description").value = transaction.description;
        document.querySelector("#amount").value = transaction.amount;
        document.querySelector("#date").value = transaction.date;
        document.querySelector("#category").value = transaction.category;

        modal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });
  });
}

function updateSummary() {

  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {

    if (t.type === "Income") {
      income += Number(t.amount);
    } else {
      expense += Number(t.amount);
    }

  });

  document.querySelector("#currentBalance").textContent =
    `${getCurrency()}${income - expense}`;

  document.querySelector("#totalIncome").textContent =
    `${getCurrency()}${income}`;

  document.querySelector("#totalExpense").textContent =
    `${getCurrency()}${expense}`;

  document.querySelector("#totalTransactions").textContent =
    transactions.length;

}

displayTransactions();
updateSummary();
updateChart();

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  displayTransactions();
  updateSummary();
  updateChart();
}

// search logic

const searchInput = document.querySelector("#searchInput");
searchInput.addEventListener("input", () => {
  const keyboard = searchInput.value.toLowerCase();
  const filtered = transactions.filter((transaction) => {
    return (
      transaction.description.toLowerCase().includes(keyboard) ||
      transaction.category.toLowerCase().includes(keyboard)
    );
  });
  displayTransactions(filtered);
});

// filter logic

const FilterType = document.querySelector("#filterType");

FilterType.addEventListener("change", () => {
  if (FilterType.value === "All") {
    displayTransactions();
    return;
  }

  const filtered = transactions.filter(
    (transaction) => transaction.type === FilterType.value,
  );
  displayTransactions(filtered);
});

// reset all logic

const resetBtn = document.querySelector(".btn-reset")

resetBtn.addEventListener('click', () => {
  const confirmReset = confirm(
    "Are you sure you want to delete all transactions?"
  );

  if(!confirmReset) return;

  transactions = [];
  
  localStorage.removeItem("trasactions");

  displayTransactions();
  updateSummary();
  updateChart();

  alert("All transactions deleted successfully!");
})

//setting logic

const settingsBtn = document.querySelector("#settingsBtn");
const dashboardBtn = document.querySelector("#dashboardBtn");
const settingsPage = document.querySelector("#settingsPage");
const backDashboard = document.querySelector("#backDashboard");
const dashboardContent = document.querySelector("#dashboardContent");
const dashboardNavItem = document.querySelector("#dashboardNavItem");
const settingsNavItem = document.querySelector("#settingsNavItem");

function setActiveNav(activeItem) {
  [dashboardNavItem, settingsNavItem].forEach((item) => {
    item.classList.remove("active");
  });
  activeItem.classList.add("active");
}

function showDashboardView() {
  dashboardContent.classList.remove("dashboard-hidden");
  settingsPage.classList.remove("active");
  settingsPage.classList.add("dashboard-hidden");
  setActiveNav(dashboardNavItem);
  sidebar.classList.remove("active");
}

function showSettingsView() {
  dashboardContent.classList.add("dashboard-hidden");
  settingsPage.classList.add("active");
  settingsPage.classList.remove("dashboard-hidden");
  setActiveNav(settingsNavItem);

  const user = JSON.parse(localStorage.getItem("loggedInUser"));
  settingUsername.value = user.userName;
  settingCurrency.value = localStorage.getItem("currency") || "₹";
  sidebar.classList.remove("active");
}

dashboardBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showDashboardView();
});

settingsBtn.addEventListener("click", (e) => {
  e.preventDefault();
  showSettingsView();
});

backDashboard.addEventListener("click", () => {
  showDashboardView();
});

const saveSettings = document.querySelector("#saveSettings");

saveSettings.addEventListener("click", () => {
  const username = document.querySelector("#settingUsername").value.trim();
  const currency = document.querySelector("#settingCurrency").value;

  if (!username) {
    alert("Please enter a username");
    return;
  }

  let user = JSON.parse(localStorage.getItem("loggedInUser"));
  user.userName = username;

  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("currency", currency);

  displayUser.textContent = `Hello, ${username}`;
  displayTransactions();
  updateSummary();

  showDashboardView();

  alert("Settings Saved");
});

