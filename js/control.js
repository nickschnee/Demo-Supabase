import { supa } from './supabase.js'

//Daten auslesen
async function getData() {
    const { data, error } = await supa
        .from('todos')
        .select()

    return data;
}

async function createData(todo) {
    const { data, error } = await supa
        .from('todos')
        .insert([{ todo }]);

    return data;
}

async function updateData(id, newTodo) {
    const { data, error } = await supa
        .from('todos')
        .update({ todo: newTodo })
        .match({ id })

    return data;
}

async function deleteData(id) {
    const { data, error } = await supa
        .from('todos')
        .delete()
        .match({ id })

    return data;
}

async function renderTodos(loggedIn) {
    const todos = await getData();
    const todosList = document.getElementById('todos-list');

    todosList.innerHTML = '';

    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        listItem.textContent = todo.todo;

        if (loggedIn) {
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.addEventListener('click', () => {
                const newTodo = prompt('Enter new todo:', todo.todo);
                if (newTodo) {
                    updateData(todo.id, newTodo).then(() => {
                        listItem.textContent = newTodo;
                    });
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => {
                if (confirm('Are you sure you want to delete this todo?')) {
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

function showCreateTodoButton() {
    const createButton = document.createElement("button");
    createButton.textContent = "Create Todo";
    createButton.setAttribute("id", "create-button");
    createButton.addEventListener("click", async () => {
      const newTodo = prompt("Enter new todo:");
      if (newTodo) {
        const createdTodo = await createData(newTodo);
        renderTodos();
      }
    });
    document.body.appendChild(createButton);
  }

  function removeCreateTodoButton() {
    const createButton = document.getElementById("create-button");
    if (createButton) {
      document.body.removeChild(createButton);
    }
  }

function showLoginButton() {
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Login to create, update and delete todos';
    loginButton.addEventListener('click', () => {
        const email = prompt('Please enter your email to receive a magic link:');
        if (email) {
            signInWithEmail(email);
        }
    });

    document.body.appendChild(loginButton);
}

async function signInWithEmail(email) {
    const { error } = await supa.auth.signIn({ email });
    if (error) {
      console.error('Error sending magic link:', error.message);
    } else {
      alert('Magic link sent to your email!');
    }
  }
  
  async function checkAuth() {
    const user = supa.auth.user();
    if (user) {
      showCreateTodoButton();
      showLogoutButton();
      renderTodos(true);
    } else {
      removeCreateTodoButton();
      removeLogoutButton();
      showLoginButton();
      renderTodos(false);
    }
  }
  
  supa.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      renderTodos();
    } else if (event === 'SIGNED_OUT') {
      alert('You have been signed out.');
    }
  });
  

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


checkAuth();