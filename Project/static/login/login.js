//toggle between login and signup page
document.addEventListener("DOMContentLoaded", function () {
  document
    .querySelector(".toggle-button")
    .addEventListener("click", function () {
      document.querySelector(".main-container").classList.toggle("show-signup");
    });
});

//creating account and save function
function create() {
  let inputEmail = document.getElementById("signUpEmail").value;
  let inputPassword = document.getElementById("signUpPassword").value;

  localStorage.setItem("email", inputEmail);
  localStorage.setItem("password", inputPassword);

  window.location.href = "../login/login.html";
}

//login to the page and redirect to dashboard
function login() {
  let inputEmail = document.getElementById("loginEmail").value;
  let inputPassword = document.getElementById("loginPassword").value;

  let email = localStorage.getItem("email");
  let password = localStorage.getItem("password");

  if (inputEmail === email && inputPassword === password) {
    // Redirect to home page on successful login
    window.location.href = "../dashboard/dashboard.html";
  } else {
    alert("Email or password is incorrect");
  }
}
