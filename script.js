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

  localStorage.setItem("loggedInUser",JSON.stringify(foundUser));
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

    registerForm.reset()
});


//display username
const displayUser = document.querySelector(".display-username")
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
displayUser.textContent = `Hello, ${loggedInUser.userName}`;

// Logout logic

const logOut = document.querySelector("#btnLogout")

logOut.addEventListener('click', () => {
authContainer.style.display = "flex";
  dashboardApp.classList.add("dashboard-hidden");
})

// dark mode logic
