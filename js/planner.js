/* Academic Planner: add, complete, delete, filter tasks (saved in localStorage) */
const STORAGE_KEY = "precious-planner-tasks";
let tasks = [];            // array of task objects
let currentFilter = "all";

const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const courseInput = document.getElementById("task-course");
const dueInput = document.getElementById("task-due");
const priorityInput = document.getElementById("task-priority");
const errorEl = document.getElementById("task-error");
const listEl = document.getElementById("task-list");
const emptyEl = document.getElementById("empty");
const countEl = document.getElementById("progress-count");
const barEl = document.getElementById("progress-bar");

function loadTasks() {
  try { tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { tasks = []; }
  if (!tasks.length && !localStorage.getItem(STORAGE_KEY + "-seen")) {
    tasks = [
      { id: Date.now(), title: "Finish COS 106 term project", course: "COS 106", due: "", priority: "high", done: false },
      { id: Date.now() + 1, title: "Practise Python loops in Jupyter", course: "COS 102", due: "", priority: "medium", done: false },
      { id: Date.now() + 2, title: "Read about the CIA triad", course: "Cybersecurity", due: "", priority: "low", done: true }
    ];
    localStorage.setItem(STORAGE_KEY + "-seen", "1");
  }
}
function saveTasks() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)); } catch {} }

function addTask(title, course, due, priority) {
  tasks.push({ id: Date.now(), title, course, due, priority, done: false });
  saveTasks(); render();
}
function toggleTask(id) {
  const t = tasks.find(t => t.id === id);
  if (t) { t.done = !t.done; saveTasks(); render(); }
}
function deleteTask(id, li) {
  li.classList.add("removing");
  setTimeout(() => { tasks = tasks.filter(t => t.id !== id); saveTasks(); render(); }, 280);
}

function render() {
  listEl.innerHTML = "";
  const visible = tasks.filter(t => currentFilter === "all" || (currentFilter === "done" ? t.done : !t.done));
  visible.forEach(t => {
    const li = document.createElement("li");
    li.className = `task ${t.priority}${t.done ? " done" : ""}`;
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.checked = t.done; cb.setAttribute("aria-label", "Mark complete: " + t.title);
    cb.addEventListener("change", () => toggleTask(t.id));
    const info = document.createElement("div"); info.className = "task-info";
    const title = document.createElement("div"); title.className = "task-title"; title.textContent = t.title;
    const meta = document.createElement("div"); meta.className = "task-meta";
    meta.textContent = [t.course, t.due ? "Due " + new Date(t.due + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" }) : "", t.priority + " priority"].filter(Boolean).join(" • ");
    info.append(title, meta);
    const del = document.createElement("button");
    del.className = "del"; del.type = "button"; del.textContent = "🗑"; del.setAttribute("aria-label", "Delete: " + t.title);
    del.addEventListener("click", () => deleteTask(t.id, li));
    li.append(cb, info, del);
    listEl.appendChild(li);
  });
  emptyEl.hidden = visible.length > 0;
  const done = tasks.filter(t => t.done).length;
  countEl.textContent = `${done} of ${tasks.length} completed`;
  barEl.style.width = (tasks.length ? (done / tasks.length) * 100 : 0) + "%";
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) { errorEl.textContent = "Please enter a task."; titleInput.focus(); return; }
  errorEl.textContent = "";
  addTask(title, courseInput.value.trim(), dueInput.value, priorityInput.value);
  form.reset(); titleInput.focus();
});
document.querySelectorAll(".filters button").forEach(btn =>
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    document.querySelectorAll(".filters button").forEach(b => b.classList.toggle("active", b === btn));
    render();
  })
);
document.getElementById("clear-done").addEventListener("click", () => {
  tasks = tasks.filter(t => !t.done); saveTasks(); render();
});

loadTasks(); render();
