const toggleTheme = document.getElementById("toggle-theme");

const bgImage = document.getElementById("bg-image");
const createTodo = document.querySelector(".main__createTodo");
const listFooter = document.getElementById("list-footer");
const itemsLeft = document.querySelector(".main__itemsLeft");

const writeTodo = document.getElementById("add-todo");
const addTodo = document.querySelector(".main__createTodo .radio");
const todosContainer = document.getElementById("todos");
const NumItemsLeft = document.getElementById("items-left");
const all = document.getElementById("all");
const active = document.getElementById("active");
const completed = document.getElementById("completed");
const clear = document.getElementById("clear-completed");

// Theme Toggling

let changeItems = [
  document.body,
  bgImage,
  toggleTheme,
  createTodo,
  writeTodo,
  todosContainer,
  listFooter,
  itemsLeft,
  clear,
  all,
  active,
  completed,
  addTodo,
];

if (localStorage.getItem("dark") === "true") {
  changeItems.forEach((item) => {
    item.classList.add("dark");
  });

  toggleTheme.src = "images/icon-sun.svg";
}

if (localStorage.getItem("dark") === "false") {
  changeItems.forEach((item) => {
    item.classList.remove("dark");
  });

  toggleTheme.src = "images/icon-moon.svg";
}

toggleTheme.addEventListener("click", () => {
  changeItems.forEach((item) => {
    item.classList.toggle("dark");
  });

  if (toggleTheme.classList.contains("dark")) {
    toggleTheme.src = "images/icon-sun.svg";
    localStorage.setItem("dark", "true");
  } else {
    toggleTheme.src = "images/icon-moon.svg";
    localStorage.setItem("dark", "false");
  }
});

// List manipulation

let savedTodos = JSON.parse(localStorage.getItem("Todos")) || [];
let createdTodos = [];

let finishedTodos = [];

function updateLSTodos() {
  localStorage.setItem("Todos", JSON.stringify(savedTodos));
}

function updateLSItems() {
  localStorage.setItem("Items Left", NumItemsLeft.innerText);
}

function createNewTodo(text) {
  const newTodoItem = document.createElement("li");
  newTodoItem.classList.add("main__todoItem");
  newTodoItem.draggable = true;

  newTodoItem.classList.add("animate__animated");
  newTodoItem.classList.add("animate__fadeInDown");

  newTodoItem.innerHTML = `
    <div class="radio">
    </div>
    <span class="main__todo">${text}</span>
    <img
      src="images/icon-cross.svg"
      class="main__iconCross"
      alt="Icon Cross"
    />
  `;

  const radioBtn = newTodoItem.querySelector(".radio");
  const todoItemText = newTodoItem.querySelector("span");
  const deleteTodo = newTodoItem.querySelector(".main__iconCross");

  todosContainer.appendChild(newTodoItem);

  createdTodos.push(newTodoItem);
  let index = createdTodos.indexOf(newTodoItem);

  let todoItem = {
    checked: false,
    text: writeTodo.value,
  };

  if (writeTodo.value !== "") {
    savedTodos.push(todoItem);
  }

  writeTodo.addEventListener("input", () => {
    if (todosContainer.innerText.includes(writeTodo.value)) {
      addTodo.style.pointerEvents = "none";
    } else {
      addTodo.style.pointerEvents = "all";
    }
  });

  updateLSTodos();

  NumItemsLeft.innerText = localStorage.getItem("Items Left");

  function dark() {
    if (localStorage.getItem("dark") === "true") {
      newTodoItem.classList.add("dark");
      radioBtn.classList.add("dark");
      todoItemText.classList.add("dark");
    }
  }

  function light() {
    if (localStorage.getItem("dark") === "false") {
      newTodoItem.classList.remove("dark");
      radioBtn.classList.remove("dark");
      todoItemText.classList.remove("dark");
    }
  }

  dark();
  light();

  toggleTheme.addEventListener("click", () => {
    dark();
    light();
  });

  radioBtn.addEventListener("click", () => {
    radioBtn.classList.toggle("check");
    newTodoItem.classList.toggle("check");

    if (radioBtn.classList.contains("check")) {
      finishedTodos.push(newTodoItem);
      localStorage.setItem("Finished Todos", JSON.stringify(finishedTodos));

      radioBtn.innerHTML = '<img src="images/icon-check.svg" />';
      todoItemText.classList.add("finished");

      NumItemsLeft.innerText = parseInt(NumItemsLeft.innerText) - 1;
      updateLSItems();

      savedTodos[index].checked = true;
      updateLSTodos();
    } else {
      todoItemText.classList.remove("finished");

      radioBtn.innerHTML = "";

      NumItemsLeft.innerText = parseInt(NumItemsLeft.innerText) + 1;
      updateLSItems();

      savedTodos[index].checked = false;
      updateLSTodos();
    }
  });

  deleteTodo.addEventListener("click", () => {
    todosContainer.removeChild(newTodoItem);

    savedTodos.splice(index, 1);
    updateLSTodos();

    if (todosContainer.innerHTML === "") {
      createdTodos = [];
      savedTodos = [];
      updateLSTodos();
    }

    if (!radioBtn.classList.contains("check")) {
      NumItemsLeft.innerText = parseInt(NumItemsLeft.innerText) - 1;
      updateLSItems();
    }
  });

  all.classList.add("active");

  all.addEventListener("click", () => {
    all.classList.add("active");

    active.classList.remove("active");
    completed.classList.remove("active");

    newTodoItem.style.display = "flex";
  });

  active.addEventListener("click", () => {
    active.classList.add("active");

    all.classList.remove("active");
    completed.classList.remove("active");

    if (!radioBtn.classList.contains("check")) {
      newTodoItem.style.display = "flex";
    } else {
      newTodoItem.style.display = "none";
    }
  });

  completed.addEventListener("click", () => {
    completed.classList.add("active");

    active.classList.remove("active");
    all.classList.remove("active");

    if (radioBtn.classList.contains("check")) {
      newTodoItem.style.display = "flex";
    } else {
      newTodoItem.style.display = "none";
    }
  });

  clear.addEventListener("click", () => {
    if (radioBtn.classList.contains("check")) {
      newTodoItem.style.display = "none";

      savedTodos.splice(
        index,
        parseInt(JSON.parse(localStorage.getItem("Finished Todos")).length)
      );
      updateLSTodos();

      all.addEventListener("click", () => {
        newTodoItem.style.display = "none";
      });

      completed.addEventListener("click", () => {
        newTodoItem.style.display = "none";
      });
    }
  });

  new Sortable(todosContainer, {
    animation: 150,
    ghostClass: "ghost",
    onSort: () => {
      let listItems = todosContainer.childNodes;

      let resultTexts = [];
      let resultChecks = [];

      listItems.forEach((item) => {
        resultTexts.push(item.innerText);
        resultChecks.push(item.classList.contains("check"));
      });

      for (let i = 0; i < resultTexts.length; i++) {
        savedTodos[i].text = resultTexts[i];
        savedTodos[i].checked = resultChecks[i];
      }

      updateLSTodos();
    },
  });
}

NumItemsLeft.innerText = parseInt(localStorage.getItem("Items Left"));
if (NumItemsLeft.innerText === "NaN") {
  NumItemsLeft.innerText = "0";
}

savedTodos.forEach((todo) => {
  createNewTodo(todo.text);

  let savedTodoItems = todosContainer.querySelectorAll(".main__todoItem");
  let radioBtn = todosContainer.querySelectorAll(".radio");
  let todoItemText = todosContainer.querySelectorAll("span");

  let savedIdx = savedTodos.indexOf(todo);

  if (todo.checked === true) {
    savedTodoItems[savedIdx].classList.add("check");
    radioBtn[savedIdx].classList.add("check");
    radioBtn[savedIdx].innerHTML = '<img src="images/icon-check.svg" />';
    todoItemText[savedIdx].classList.add("finished");

    clear.addEventListener("click", () => {
      savedTodos.splice(savedIdx, finishedTodos.length);
      updateLSTodos();
    });
  } else {
    savedTodoItems[savedIdx].classList.remove("check");
    radioBtn[savedIdx].classList.remove("check");
    radioBtn[savedIdx].innerHTML = "";
    todoItemText[savedIdx].classList.remove("finished");
  }
});

addTodo.addEventListener("click", () => {
  if (writeTodo.value !== "") {
    createNewTodo(writeTodo.value);
    addTodo.style.pointerEvents = "none";
  }

  NumItemsLeft.innerText = parseInt(savedTodos.length);
  updateLSItems();
});
