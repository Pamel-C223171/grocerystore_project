const form = document.getElementById("auth-form");
const nameInput = document.getElementById("name");
const email = document.getElementById("email");
const password = document.getElementById("password");
const message = document.getElementById("message");
const toggleText = document.getElementById("toggle-text");
const toggleLink = document.getElementById("toggle-link");
const formTitle = document.getElementById("form-title");

let isLogin = false;

// Toggle Login/Signup
toggleLink.addEventListener("click", () => {
  isLogin = !isLogin;
  formTitle.textContent = isLogin ? "Login" : "Sign Up";
  toggleText.innerHTML = isLogin
    ? `Don't have an account? <span id="toggle-link" style="color:blue; cursor:pointer;">Sign Up</span>`
    : `Already have an account? <span id="toggle-link" style="color:blue; cursor:pointer;">Login</span>`;
  nameInput.style.display = isLogin ? "none" : "block";
  message.textContent = "";
  attachToggleListener(); // reattach toggle
});

function attachToggleListener() {
  document.getElementById("toggle-link").addEventListener("click", () => {
    toggleLink.click();
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // IMPORTANT: prevent default reload

  const payload = {
    email: email.value,
    password: password.value,
  };

  if (!isLogin) {
    payload.name = nameInput.value;
  }

  const url = isLogin
    ? "http://localhost:5001/api/auth/login"
    : "http://localhost:5001/api/auth/signup";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log(data.token); // ✅ এখানে token থাকবে

    if (res.ok) {
      message.style.color = "green";
      message.textContent = data.message;
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      console.log("Login Success");
    } else {
      throw new Error(data.message || "Something went wrong!");
    }
  } catch (err) {
    message.style.color = "red";
    message.textContent = err.message;
  }
});
