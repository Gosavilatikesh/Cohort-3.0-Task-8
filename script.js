lucide.createIcons();

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

  const transactionForm = document.querySelector("#transactionForm")

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  transactionForm.addEventListener('submit', (e) => {
    e.preventDefault()
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
      category  
    }

    if(description.trim() === "" || amount <=0 ){
      alert("Please fill all fields")
      return;
    }

    transactions.push(transaction);

    localStorage.setItem("transactions", JSON.stringify(transactions));

    displayTransactions();
    updateSummary();

    transactionForm.reset()
    console.log("Before remove:", modal.className);
    modal.classList.remove("active");
    console.log("After remove:", modal.className);  
    document.body.style.overflow = "auto";
  })

  const tbody = document.querySelector("#transactionTableBody")
  console.log(tbody);
  console.log(document.body.innerHTML.includes("transactionTableBody"));

  function displayTransactions(){
    tbody.innerHTML = "";
    
    if(transactions.length === 0){
      tbody.innerHTML =  `
        <tr class="empty-rom">
          <td colspan="5">
            No transaction recorded yet.                  
          </td>
        </tr>    
      `;

      return;
    }

    transactions.forEach(transaction => {

      tbody.innerHTML += `
        <tr>
          <td>${transaction.date}</td>
          <td>${transaction.description}</td>
          <td>${transaction.category}</td>
          <td>
            ${transaction.type === "Income" ? "+" : "-"}₹${transaction.amount}
          </td>

          <td>
            <button>Edit</button>
            <button>Delete</button>
          </td>

        </tr>
      `;
    }); 

  }


  
function updateSummary() {
  let income = 0;
  let expense = 0;

  transactions.forEach(transaction => {
    if (transaction.type === "Income") {
      income += transaction.amount;
    } else {
      expense += transaction.amount;
    }
  });

  const balance = income - expense;

  document.querySelector("#currentBalance").textContent = `₹${balance}`;

  document.querySelector("#totalIncome").textContent = `₹${income}`;

  document.querySelector("#totalExpense").textContent = `₹${expense}`;

  document.querySelector("#totalTransactions").textContent = transactions.length;
}

displayTransactions();
updateSummary();




