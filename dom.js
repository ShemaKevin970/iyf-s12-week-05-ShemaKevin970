const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const formError = document.getElementById("form-error");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = [];
let currentFilter = "all";
let nextId = 1;
let editingId = null;

function createTodoElement(todo) {
  const li = document.createElement("li");
  li.className = "todo-item";
  li.dataset.id = todo.id;
  if (todo.completed) li.classList.add("completed");

  if (editingId === todo.id) {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit";
    editInput.value = todo.text;
    setTimeout(() => { editInput.focus(); editInput.select(); }, 0);
    li.appendChild(editInput);
    return li;
  }

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "toggle";
  checkbox.checked = todo.completed;

  const span = document.createElement("span");
  span.className = "todo-text";
  span.textContent = todo.text;

  const delBtn = document.createElement("button");
  delBtn.type = "button";
  delBtn.className = "delete";
  delBtn.textContent = "✕";
  delBtn.setAttribute("aria-label", `Delete "${todo.text}"`);

  li.append(checkbox, span, delBtn);
  return li;
}

function visibleTodos() {
  if (currentFilter === "active") return todos.filter(t => !t.completed);
  if (currentFilter === "completed") return todos.filter(t => t.completed);
  return todos;
}

function render() {
  todoList.replaceChildren(...visibleTodos().map(createTodoElement));
  updateStats();
}

function updateStats() {
  const activeCount = todos.filter(t => !t.completed).length;
  itemsLeft.textContent = `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
}

function addTodo(text) {
  todos.push({ id: nextId++, text, completed: false });
  render();
}
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    formError.textContent = "Type a task first.";
    return;
  }

  formError.textContent = "";
  addTodo(text);
  input.value = "";
  input.focus();
});

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id
      ? { ...todo, completed: !todo.completed }
      : todo
  );

  render();
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  render();
}

todoList.addEventListener("click", (event) => {
  const item = event.target.closest(".todo-item");

  if (!item) return;

  const id = Number(item.dataset.id);

  if (event.target.closest(".delete")) {
    deleteTodo(id);
    return;
  }

  if (event.target.closest(".toggle")) {
    toggleTodo(id);
  }
});

function filterTodos(filter) {
  currentFilter = filter;

  filters.forEach((btn) => {
    const active = btn.dataset.filter === filter;
    btn.classList.toggle("active", active);
    btn.setAttribute("aria-pressed", String(active));
  });

  render();
}

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterTodos(btn.dataset.filter);
  });
});

function clearCompleted() {
  todos = todos.filter((todo) => !todo.completed);
  render();
}

clearCompletedBtn.addEventListener("click", clearCompleted);

render();