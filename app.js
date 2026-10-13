const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskStartDate = document.getElementById('task-start-date');
const taskEndDate = document.getElementById('task-end-date');
const addBtn = document.getElementById('add-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingTaskId = null;

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

    // Период От - До
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
      <div class="task-actions">
        <button class="edit-btn" onclick="startEdit(${task.id})" title="Редактирай">✏️</button>
        <button class="delete-btn" onclick="deleteTask(${task.id})" title="Изтрий">✕</button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

// Добавяне или запазване на редакция
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (editingTaskId !== null) {
    tasks = tasks.map((task) => {
      if (task.id === editingTaskId) {
        return {
          ...task,
          text: taskInput.value.trim(),
          startDate: taskStartDate.value,
          endDate: taskEndDate.value
        };
      }
      return task;
    });
    resetForm();
  } else {
    const newTask = {
      id: Date.now(),
      text: taskInput.value.trim(),
      startDate: taskStartDate.value,
      endDate: taskEndDate.value,
      completed: false
    };
    tasks.unshift(newTask);
  }

  saveTasks();
  renderTasks();
});

// Зареждане на задача в полетата
function startEdit(id) {
  const taskToEdit = tasks.find(t => t.id === id);
  if (!taskToEdit) return;

  editingTaskId = id;
  taskInput.value = taskToEdit.text;
  taskStartDate.value = taskToEdit.startDate || '';
  taskEndDate.value = taskToEdit.endDate || '';

  addBtn.textContent = 'Запази';
  cancelEditBtn.style.display = 'block';

  taskInput.focus();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

function resetForm() {
  editingTaskId = null;
  taskInput.value = '';
  taskStartDate.value = '';
  taskEndDate.value = '';
  addBtn.textContent = 'Добави';
  cancelEditBtn.style.display = 'none';
}

function toggleTask(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  if (editingTaskId === id) {
    resetForm();
  }
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

renderTasks();
