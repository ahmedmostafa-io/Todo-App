"use strict";
// ^ function to select element
const $ = (selector) => document.querySelector(selector);
// ~ Html Elements
// * sections
const sections = document.querySelectorAll("section");
const body = document.body;
// * form divs
const modal = $("#modal");
const statusInput = $("#status");
const titleInput = $("#title");
const categoryInput = $("#category");
const descriptionInput = $("#description");
const healthOption = $("#health");
// * btn
const addBtn = $("#addBtn");
const updateBtn = $("#updateBtn");
const newTaskBtn = $("#newTask");
const searchInput = $("#searchInput");
const gridBtn = $("#gridBtn");
const barsBtn = $("#barsBtn");
const modeToggle = $("#mode");
const rootElement = document.documentElement;
// ? App variables
const containers = {
  nextUp: $("#nextUp"),
  inProgress: $("#inProgress"),
  done: $("#done"),
};
const countersElement = {
  nextUp: $("#nextUp").querySelector("span"),
  inProgress: $("#inProgress").querySelector("span"),
  done: $("#done").querySelector("span"),
};

const tasks = getLocalStorage();
displayAllTasks();
let updateIndex;
const titleRegex = /^[A-Z][a-zA-Z\s]{3,}$/;
const descRegex = /^.{10,200}$/;

// ! functions

function showModal() {
  clearInputs();
  window.scroll(0, 0);
  document.body.style.overflow = "hidden";
  modal.classList.replace("d-none", "d-flex");
  updateBtn.classList.replace("d-block", "d-none");
  addBtn.classList.replace("d-none", "d-block");
}
function hideModal() {
  document.body.style.overflow = "auto";
  modal.classList.replace("d-flex", "d-none");
}
// * CRUD operations
function addTask() {
  if (
    validateRegex(titleRegex, titleInput) &&
    validateRegex(descRegex, descriptionInput)
  ) {
    const task = {
      status: statusInput.value,
      category: categoryInput.value,
      category2: healthOption.textContent,
      title: titleInput.value,
      description: descriptionInput.value,
      bgColor: "#0d1117",
    };
    tasks.push(task);
    setLocalStorage("Task", JSON.stringify(tasks));
    displayTask(tasks.length - 1);
    hideModal();
    clearInputs();
  } else {
    alert("Something went wrong!");
  }
}
function displayTask(index) {
  const categoryText =
    tasks[index]?.category == "health"
      ? tasks[index]?.category2
      : tasks[index]?.category;
  const taskHTML = `
    <div class="task" style="background-color:${tasks[index]?.bgColor}">
        <h3 class="text-capitalize">${tasks[index]?.title}</h3>
        <p class="description text-capitalize">${tasks[index]?.description}</p>
        <h4 class="category ${tasks[index]?.category} text-capitalize">${categoryText}</h4>
        <ul class="task-options list-unstyled d-flex gap-3 fs-5 m-0">
            <li><i class="bi bi-pencil-square" onclick="getTaskInfo(${index})"></i></li>
            <li><i class="bi bi-trash-fill" onclick="deleteTask(${index})"></i></li>
            <li><i class="bi bi-palette-fill" onclick="changebgColors(event,${index})"></i></li>
        </ul>
   </div>`;
  setCounter(tasks[index]?.status);
  containers[tasks[index]?.status].querySelector(".tasks").innerHTML +=
    taskHTML;
}
function setCounter(status) {
  countersElement[status].innerHTML = +countersElement[status].innerHTML + 1;
}
function setLocalStorage(key, value) {
  localStorage.setItem(key, value);
}
function getLocalStorage() {
  return JSON.parse(localStorage.getItem("Task")) || [];
}
function displayAllTasks() {
  for (let i = 0; i < tasks.length; i++) {
    displayTask(i);
  }
}
function deleteTask(index) {
  tasks.splice(index, 1);
  setLocalStorage("Task", JSON.stringify(tasks));
  resetContainers();
  resetCounters();
  displayAllTasks();
}

function resetContainers() {
  for (const key in containers) {
    containers[key].querySelector(".tasks").innerHTML = "";
  }
}

function resetCounters() {
  for (const key in countersElement) {
    countersElement[key].innerHTML = 0;
  }
}
function searchTasks() {
  resetContainers();
  resetCounters();
  const term = searchInput.value;
  for (let x = 0; x < tasks.length; x++) {
    if (
      tasks[x].title.toLowerCase().includes(term.toLowerCase()) ||
      tasks[x].category.toLowerCase().includes(term.toLowerCase())
    ) {
      displayTask(x);
    }
  }
}
function clearInputs() {
  descriptionInput.value = "";
  titleInput.value = "";
  [titleInput, descriptionInput].forEach((el) => {
    el.classList.remove("is-valid", "is-invalid");
    const feedback = el.parentElement.nextElementSibling;
    if (feedback) {
      el.parentElement.nextElementSibling.classList.replace(
        "d-block",
        "d-none"
      );
    }
  });
}
// ? change tasks color
const colors = [
  "#A86523",
  "#F79B72",
  "#FE5D26",
  "#F564A9",
  "#332D56",
  "#0d1117",
];

let lastColorIndex = -1;

function changebgColors(event, index) {
  let newColorIndex;

  do {
    newColorIndex = Math.trunc(Math.random() * colors.length);
  } while (newColorIndex === lastColorIndex);

  lastColorIndex = newColorIndex;
  const color = colors[newColorIndex];

  tasks[index].bgColor = color;
  setLocalStorage("Task", JSON.stringify(tasks));
  event.target.closest(".task").style.backgroundColor = color;
}

// TODO ==> Edit Task
function getTaskInfo(index) {
  updateIndex = index;
  showModal();
  statusInput.value = tasks[index].status;
  categoryInput.value = tasks[index].category;
  titleInput.value = tasks[index].title;
  descriptionInput.value = tasks[index].description;
  addBtn.classList.replace("d-block", "d-none");
  updateBtn.classList.replace("d-none", "d-block");
}
function editTask() {
  if (
    validateRegex(titleRegex, titleInput) &&
    validateRegex(descRegex, descriptionInput)
  ) {
    tasks[updateIndex].status = statusInput.value;
    tasks[updateIndex].category = categoryInput.value;
    tasks[updateIndex].title = titleInput.value;
    tasks[updateIndex].description = descriptionInput.value;
    setLocalStorage("Task", JSON.stringify(tasks));
    resetContainers();
    resetCounters();
    displayAllTasks();
    hideModal();
  } else {
    alert("😱 Something went wrong!");
  }
}
// TODO ==> Validation
function validateRegex(regex, element) {
  if (regex.test(element.value)) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    element.parentElement.nextElementSibling.classList.replace(
      "d-block",
      "d-none"
    );
    return true;
  }
  element.classList.add("is-invalid");
  element.classList.remove("is-valid");
  element.parentElement.nextElementSibling.classList.replace(
    "d-none",
    "d-block"
  );
  return false;
}

// TODO ==> change app style
function changeToBars() {
  gridBtn.classList.remove("active");
  barsBtn.classList.add("active");
  setLocalStorage("gridView", JSON.stringify(false));
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("col-md-6", "col-lg-4");
    sections[i].style.overflow = "auto";
  }
}

function changeToGrid() {
  barsBtn.classList.remove("active");
  gridBtn.classList.add("active");
  setLocalStorage("gridView", JSON.stringify(true));

  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.add("col-md-6", "col-lg-4");
  }
}

// & events
addBtn.addEventListener("click", addTask);
// * show task form
newTaskBtn.addEventListener("click", showModal);
// * hide task form in 2 ways
modal.addEventListener("click", (e) => {
  if (e.target.id == "modal") {
    hideModal();
  }
});
document.addEventListener("keyup", (e) => {
  if (e.key == "Escape") {
    hideModal();
  }
});
// * search for task
searchInput.addEventListener("input", searchTasks);
// * ## Update Task
updateBtn.addEventListener("click", editTask);
// * title validation
titleInput.addEventListener("input", function () {
  validateRegex(titleRegex, titleInput);
});
// * description validation
descriptionInput.addEventListener("input", function () {
  validateRegex(descRegex, descriptionInput);
});
// * dark and light Mode

window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  const gridView = JSON.parse(localStorage.getItem("gridView", false));
  if (savedTheme === "light") {
    rootElement.classList.add("light-mode");
    modeToggle.classList.remove("bi-brightness-high-fill");
    modeToggle.classList.add("bi-moon-stars-fill");
  }
  if (gridView) {
    changeToGrid();
  } else {
    changeToBars();
  }
});

modeToggle.addEventListener("click", () => {
  rootElement.classList.toggle("light-mode");

  if (rootElement.classList.contains("light-mode")) {
    modeToggle.classList.remove("bi-brightness-high-fill");
    modeToggle.classList.add("bi-moon-stars-fill");
    setLocalStorage("theme", "light");
  } else {
    modeToggle.classList.remove("bi-moon-stars-fill");
    modeToggle.classList.add("bi-brightness-high-fill");
    setLocalStorage("theme", "dark");
  }
});
// ?
barsBtn.addEventListener("click", changeToBars);
gridBtn.addEventListener("click", changeToGrid);
