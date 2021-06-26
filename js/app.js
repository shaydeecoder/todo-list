"use strict";

const btnAddTodo = document.querySelector(".todo__btn--add");
const btnClearAll = document.querySelector(".btn--clear-all");
const labelActiveTodo = document.querySelector(".todo__count--active");
const labelDate = document.querySelector(".time__date--numeric");
const labelYear = document.querySelector(".time__date--month_year");
const labelDay = document.querySelector(".time__date--day");
const todoItemsContainer = document.querySelector(".todo__items");
const containerItems = document.querySelector(".todo__items");

class Todo {
  constructor(id, item) {
    this.id = id;
    this.item = item;
    this.checked = false;
  }
}

/////////////////////////////////////////////
// App Achitecture

class App {
  #id;
  #items = [];
  #todo;

  constructor() {
    // Display date on UI
    this._setDate();

    // Get todo itmes from local storage if available
    this._getLocalStorage();

    // Attach event listeners
    btnAddTodo.addEventListener("click", this._newTodo.bind(this));
    btnClearAll.addEventListener("click", this._clearAll.bind(this));
    containerItems.addEventListener("change", this._checkStatus.bind(this));
    containerItems.addEventListener("click", this._removeItem.bind(this));
  }

  _setDate() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    // prettier-ignore
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    const currentDate = new Date();

    labelDate.textContent = currentDate.getDate();
    labelDay.textContent = `${months[currentDate.getMonth()]} ${
      currentDate.getFullYear
    }`;
    labelDay.textContent = days[currentDate.getDay()];
  }

  _newTodo(e) {
    e.preventDefault();

    // get todo item from prompt
    const item = prompt(`Enter your todo here`);

    this.#id = this.#items.length;

    // create todo object with prompt's value
    this.#todo = new Todo(this.#id, item);

    // store object in an array
    this.#items.push(this.#todo);

    // render item on UI
    this._renderItem(this.#todo);

    // Add todo items to local storage
    this._setLocalStorage(this.#items);
  }

  _renderItem(obj) {
    const html = `
      <li class="todo__item">
        <input type="checkbox" name="todo__check-btn" id="item-${
          obj.id
        }" class="todo__select" ${obj.checked ? "checked" : ""}>
        <label for="item-${obj.id}">${obj.item}</label>
        <i class="far fa-trash-alt todo__delete"></i>
      </li>
    `;

    todoItemsContainer.insertAdjacentHTML("beforeend", html);
  }

  _setLocalStorage(arr) {
    localStorage.setItem("todoItems", JSON.stringify(arr));
  }

  _getLocalStorage() {
    const todos = JSON.parse(localStorage.getItem("todoItems"));
    if (!todos) return;
    this.#items = todos;

    // Update the UI
    this.#items.forEach((item) => {
      this._renderItem(item);
    });
  }

  _updateLocalStorage(arr) {
    localStorage.clear();
    this._setLocalStorage(arr);
  }

  _checkStatus(e) {
    const target = e.target.closest(".todo__select");
    const targetID = Number(target.getAttribute("id").split("-")[1]);

    // Find target object in #items array
    const targetObj = this._findItemsID(targetID);

    // if target is checked, set property "checked" to true else to false
    targetObj.checked = target.checked ? true : false;

    // Update local storage with updated #items array
    this._updateLocalStorage(this.#items);
  }

  _removeItem(e) {
    const target = e.target.closest(".todo__delete");

    if (!target) return;

    const targetItem = target.closest(".todo__item");

    // Remove item from UI
    targetItem.classList.add("todo__items--remove");

    // Get target ID
    const targetInputID = targetItem
      .querySelector(".todo__select")
      .getAttribute("id")
      .split("-")[1];

    // Find and remove item from #items array
    const targetObj = this._findItemsID(Number(targetInputID));
    this.#items = this.#items.filter((item) => item !== targetObj);

    // Update local storage
    this._updateLocalStorage(this.#items);
  }

  _findItemsID(id) {
    return this.#items.find((item) => item.id === id);
  }

  _clearAll() {
    // Empty #items array
    this.#items = [];

    // Delete todo items from UI
    containerItems.textContent = "";

    // Clear local storage
    localStorage.clear();
  }
}

const app = new App();
