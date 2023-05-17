import { supa } from "./supabase.js";

// CRUD OPERATIONS
// CRUD OPERATIONS
// CRUD OPERATIONS
// CRUD OPERATIONS
// CRUD OPERATIONS
// CRUD OPERATIONS
// CRUD OPERATIONS

// SELECT Data from Supabase
async function getData() {
  const { data, error } = await supa.from("todos").select();

  return data;
}

// INSERT Data into Supabase
async function createData(todo) {
  const { data, error } = await supa.from("todos").insert([{ todo }]);

  return data;
}

// UPDATE Data in Supabase
async function updateData(id, newTodo) {
  const { data, error } = await supa
    .from("todos")
    .update({ todo: newTodo })
    .match({ id });

  return data;
}

// DELETE Data from Supabase
async function deleteData(id) {
  const { data, error } = await supa.from("todos").delete().match({ id });

  return data;
}

// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS
// RENDERING VIEWS BASED ON LOGIN STATUS

// Logic to render todos in HTML
async function renderTodos(loggedIn) {
  const todos = await getData();
  const todosList = document.getElementById("todos-list");

  todosList.innerHTML = "";

  todos.forEach((todo) => {
    const listItem = document.createElement("li");
    listItem.classList.add("todo-item");
    listItem.textContent = todo.todo;

    if (loggedIn) {
      const editButton = document.createElement("button");
      editButton.textContent = "Edit";
      editButton.addEventListener("click", () => {
        const newTodo = prompt("Enter new todo:", todo.todo);
        if (newTodo) {
          updateData(todo.id, newTodo).then(() => {
            listItem.textContent = newTodo;
            renderTodos(true);
          });
        }
      });

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this todo?")) {
          deleteData(todo.id).then(() => {
            todosList.removeChild(listItem);
          });
        }
      });

      listItem.appendChild(editButton);
      listItem.appendChild(deleteButton);
    }

    todosList.appendChild(listItem);
  });
}

// Show create todo button only when user is logged in
function showCreateTodoButton() {
  const createButton = document.createElement("button");
  createButton.textContent = "Create Todo";
  createButton.setAttribute("id", "create-button");
  createButton.addEventListener("click", async () => {
    const newTodo = prompt("Enter new todo:");
    if (newTodo) {
      const createdTodo = await createData(newTodo);
      renderTodos(true);
    }
  });
  document.body.appendChild(createButton);
}

// Remove create todo button when user is logged out
function removeCreateTodoButton() {
  const createButton = document.getElementById("create-button");
  if (createButton) {
    document.body.removeChild(createButton);
  }
}

// Show login button when user is logged out
function showLoginButton() {
    
  // if login button already exists, don't create a new one
  if (document.getElementById("login-button")) {

  } else {

    console.log("showing login button");
    const loginButton = document.createElement("button");
    loginButton.id = "login-button"; // Assign an ID to the login button
    loginButton.textContent = "Login to create, update and delete todos";
    loginButton.addEventListener("click", () => {
      const email = prompt("Please enter your email to receive a magic link:");
      if (email) {
        signInWithEmail(email);
      }
    });

    document.body.appendChild(loginButton);
  }
}

// Remove login button when user is logged in
function removeLoginButton() {
  console.log("removing login button");
  const loginButton = document.getElementById("login-button");
  if (loginButton) {
    loginButton.remove();
  }
}

function showLogoutButton() {
  const logoutButton = document.createElement("button");
  logoutButton.textContent = "Logout";
  logoutButton.setAttribute("id", "logout-button");
  logoutButton.addEventListener("click", async () => {
    await supa.auth.signOut();
    removeLogoutButton();
    removeCreateTodoButton();
    showLoginButton();
    renderTodos(false);
  });

  document.body.appendChild(logoutButton);
}

function removeLogoutButton() {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    document.body.removeChild(logoutButton);
  }
}

// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC
// AUTHENTICATION LOGIC

// Send email Magic Link
async function signInWithEmail(email) {
  const { error } = await supa.auth.signIn({ email });
  if (error) {
    console.error("Error sending magic link:", error.message);
  } else {
    alert("Magic link sent to your email!");
  }
}

// Check if user is logged in
async function checkAuth() {
  const user = supa.auth.user();

  console.log("Checking auth...", user);

  if (user) {
    console.log("User is logged in");
    showCreateTodoButton();
    showLogoutButton();
    renderTodos(true);
    removeLoginButton();
  } else {
    removeCreateTodoButton();
    removeLogoutButton();
    showLoginButton();
    renderTodos(false);
  }
}

// Listen to auth changes
supa.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN") {
    renderTodos();
  } else if (event === "SIGNED_OUT") {
    alert("You have been signed out.");
  }
});

// Add this function to handle the auth state change
function handleAuthStateChange(event, session) {
  console.log("Auth state changed:", event, session);
  checkAuth();
}

// this is needed when coming from the magiclink email
supa.auth.onAuthStateChange(handleAuthStateChange);

// this is needed whenever reloading the page
checkAuth();
