const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskStartDate = document.getElementById('task-start-date');
const taskEndDate = document.getElementById('task-end-date');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString('bg-BG', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
}

function renderTasks() {
  taskList.innerHTML = '';

  tasks.forEach((task) => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;

    // Сглобяване на периода от - до
    let dateText = '';
    if (task.startDate && task.endDate) {
      dateText = `От: ${formatDate(task.startDate)} — До: ${formatDate(task.endDate)}`;
    } else if (task.startDate) {
      dateText = `От: ${formatDate(task.startDate)}`;
    } else if (task.endDate) {
      dateText = `До: ${formatDate(task.endDate)}`;
    }

    const dateHtml = dateText ? `<span class="task-date-badge">${dateText}</span>` : '';

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
    startDate: taskStartDate.value,
    endDate: taskEndDate.value,
    completed: false
  };

  tasks.unshift(newTask);
  saveTasks();
  renderTasks();

  // Изчистване на полетата след добавяне
  taskInput.value = '';
  taskStartDate.value = '';
  taskEndDate.value = '';
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
