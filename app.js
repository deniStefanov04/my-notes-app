const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskDate = document.getElementById('task-date');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    let dateHtml = '';
    if (task.dueDate) {
      const formattedDate = new Date(task.dueDate).toLocaleString('bg-BG', {
        dateStyle: 'short',
        timeStyle: 'short'
      });
      dateHtml = `<span class="task-date-badge">${formattedDate}</span>`;
    }

    li.innerHTML = `
      <div class="task-item-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
        <div class="task-text-group">
          <span class="task-title">${task.text}</span>
          ${dateHtml}
        </div>
      </div>
      <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    dueDate: taskDate.value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = '';
  taskDate.value = '';
});

function toggleTask(id) {
  tasks = tasks.map(task => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

renderTasks();