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

async function renderTodos() {
    const todos = await getData();
    const todosList = document.getElementById('todos-list');

    todosList.innerHTML = '';
    
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('todo-item');
        listItem.textContent = todo.todo;

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
        todosList.appendChild(listItem);
    });
}

document.getElementById('create-button').addEventListener('click', async () => {
    const newTodo = prompt('Enter new todo:');
    if (newTodo) {
        const createdTodo = await createData(newTodo);
        renderTodos();
    }
});

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
    if (!user) {
      const email = prompt('Please enter your email to receive a magic link:');
      if (email) {
        signInWithEmail(email);
      }
    } else {
      renderTodos();
    }
  }
  
  supa.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN') {
      renderTodos();
    } else if (event === 'SIGNED_OUT') {
      alert('You have been signed out.');
    }
  });
  

checkAuth();
