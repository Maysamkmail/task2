const todoInput = document.getElementById('todoInput');
const warning = document.getElementById('warning');
const dropdown = document.getElementById('dropdown');
const todoList = document.getElementById('todo-list'); 
let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');



const deleteDoneModal = document.getElementById("deleteDoneModal");
const deleteAllModal = document.getElementById("deleteAllModal");

const confirmDeleteDoneBtn = document.getElementById("confirmDeleteDone");
const cancelDeleteDoneBtn = document.getElementById("cancelDeleteDone");

const confirmDeleteAllBtn = document.getElementById("confirmDeleteAll");
const cancelDeleteAllBtn = document.getElementById("cancelDeleteAll");

const errorMessage = document.getElementById("errorMessage");


let editingIndex = null;

document.getElementById('show-all').addEventListener('click', () => filterTasks('all'));
document.getElementById('show-done').addEventListener('click', () => filterTasks('done'));
document.getElementById('show-todo').addEventListener('click', () => filterTasks('todo'));

function filterTasks(filter) {
  let filteredTasks = [];

  if (filter === 'done') {
 
    filteredTasks = tasks.filter(task => task.done);
  } else if (filter === 'todo') {
   
    filteredTasks = tasks.filter(task => !task.done);
  } else {
   
    filteredTasks = tasks;
  }

  renderTasks(filteredTasks); 
}

function renderTasks(filteredTasks) {
  todoList.innerHTML = ''; 
  filteredTasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.addEventListener('change', () => toggleTaskDone(index)); 

   
    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'actions';
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '<i class="bx bxs-pencil"></i>'; 
    editBtn.addEventListener('click', () => editTask(index)); 
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>'; 
    deleteBtn.addEventListener('click', () => deleteTask(index)); 
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);
    li.appendChild(checkbox);
    li.appendChild(taskText);
    li.appendChild(actionsDiv);
    todoList.appendChild(li);
  });
}


function addTask() {
  const value = todoInput.value.trim();

  if (value === '') {
    warning.textContent = 'Task cannot be empty';
    return;
  }

  if (/^\d/.test(value)) {
    warning.textContent = 'Task cannot start with a number';
    return;
  }

  if (value.length <= 5) {
    warning.textContent = 'Task must be longer than 5 characters';
    return;
  }

  if (!/^[a-zA-Z\s]+$/.test(value)) {
    warning.textContent = 'Task must only contain English';
    return;
  }

  warning.textContent = '';
  tasks.push({ text: value, done: false }); 
  localStorage.setItem('tasks', JSON.stringify(tasks)); 
  todoInput.value = '';
  dropdown.style.display = 'none';
  renderTasks(tasks); 
}
todoInput.addEventListener('input', () => {
  const value = todoInput.value.trim();
  if (/^\d/.test(value)) {
    warning.textContent = 'Task cannot start with a number';
  } else if (value.length <= 5 && value.length > 0) {
    warning.textContent = 'Task must be longer than 5 characters';
  } else if (!/^[a-zA-Z\s]*$/.test(value)) {
    warning.textContent = 'Only English';
  } else {
    warning.textContent = '';
  }
  
dropdown.innerHTML = ''; 
dropdown.style.display = 'block'; 
const filteredTasks = tasks.filter(task =>
  task.text.toLowerCase().includes(todoInput.value.trim().toLowerCase())
);

const tasksToShow = filteredTasks.length > 0 ? filteredTasks : tasks;

tasksToShow.forEach(task => {
  const div = document.createElement('div');
  div.textContent = task.text;
  div.className = 'dropdown-item'; 
  dropdown.appendChild(div);

  div.addEventListener('click', () => {
    todoInput.value = task.text; 
    dropdown.style.display = 'none'; 
  });
});
});
todoInput.addEventListener('input', () => {
  const value = todoInput.value.trim();

  if (/^\d/.test(value)) {
    warning.textContent = 'Task cannot start with a number';
  } else if (value.length < 5 && value.length > 0) {
    warning.textContent = 'Task must be longer than 5 characters';
  } else if (!/^[a-zA-Z\s]*$/.test(value)) {
    warning.textContent = 'Only English';
  } else {
    warning.textContent = '';
  }
  dropdown.innerHTML = ''; 
  if (value.length > 0 && /^[a-zA-Z\s]*$/.test(value)) {
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(value.toLowerCase()));

    if (filteredTasks.length > 0) {
      dropdown.style.display = 'block'; 
      filteredTasks.forEach(task => {
        const div = document.createElement('div');
        div.textContent = task.text;
        div.className = 'dropdown-item';
        dropdown.appendChild(div);
      });
    }
  }   
       
});
document.addEventListener('click', (event) => {
  if (!todoInput.contains(event.target) && !dropdown.contains(event.target)) {
    dropdown.style.display = 'none';
  }
});

function toggleTaskDone(index) {
  tasks[index].done = !tasks[index].done;
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}
function editTask(index) {
  editingIndex = index; 
  editInput.value = tasks[index].text; 
  editModal.style.display = 'flex'; 
}

function saveEdit() {
  const newTask = editInput.value.trim();
  if (newTask !== '') {
    tasks[editingIndex].text = newTask; 
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks(tasks); 
    closeEditModal(); 
  }
}
function closeEditModal() {
  editModal.style.display = 'none';
  editInput.value = '';
}
function deleteTask(index) {
  tasks.splice(index, 1);
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks(tasks);
}
document.getElementById("delete-done").addEventListener("click", () => {
  deleteDoneModal.classList.remove("hidden");
});

confirmDeleteDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done); 
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
  renderTasks(tasks); 
  deleteDoneModal.classList.add("hidden"); 
});

cancelDeleteDoneBtn.addEventListener("click", () => {
  deleteDoneModal.classList.add("hidden"); 
});


document.getElementById("delete-all").addEventListener("click", () => {
  deleteAllModal.classList.remove("hidden"); 
});

confirmDeleteAllBtn.addEventListener("click", () => {
  tasks = []; 
  localStorage.setItem("tasks", JSON.stringify(tasks)); 
  renderTasks(tasks); 
  deleteAllModal.classList.add("hidden");
});

cancelDeleteAllBtn.addEventListener("click", () => {
  deleteAllModal.classList.add("hidden"); 
})
renderTasks(tasks);

let taskToDeleteIndex = null; 

function deleteTask(index) {
  taskToDeleteIndex = index; 
  document.getElementById('confirmModal').style.display = 'flex'; 
}
document.getElementById('confirmDelete').addEventListener('click', () => {
  if (taskToDeleteIndex !== null) {
    tasks.splice(taskToDeleteIndex, 1); 
    localStorage.setItem('tasks', JSON.stringify(tasks)); 
    renderTasks(tasks); 
    taskToDeleteIndex = null; 
  }
  closeConfirmModal(); 
});

document.getElementById('cancelDelete').addEventListener('click', closeConfirmModal);
function closeConfirmModal() {
  document.getElementById('confirmModal').style.display = 'none';
}
document.addEventListener("DOMContentLoaded", function() {
  const todoList = document.querySelector(".todo-list");
});