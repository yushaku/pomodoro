const listItemExpand = $(".listItem_expand");
const todoInput = $(".todoInput");
const selectInput = $(".selectInput");
const deadlineInput = $(".deadlineInput");
const counterInput = $(".counterInput");
const tastList = $(".tastList");
const inputForm = $("#inputForm");
const myKey = "TODOs";

const todos = getTodoFromLocalStorage();

function runTodoApp() {
   render(todos);
   handleEvent();
}
runTodoApp();

function render(todos) {
   const todoListMap = todos.map((todo, index) => {
      return `
         <div class="listItem" id-todo = ${index}>
            <div class= "listItem_finish" onclick="finishTodo(${index})">
               <ion-icon name= ${todo.isFinish ? "ribbon-outline" : "ellipse-outline"}></ion-icon>
               <audio id="finishTodo" src="./assets/music/finish.mp3"></audio>
            </div>
            <div class="listItem_detail" >
               <${todo.isFinish ? "s" : "h1"}>
                  ${todo.title} 
               </${todo.isFinish ? "s" : "h1"}>
               <div class="listItem_detail-mini">
                  <span class="prioritize ${todo.prioritize}">${todo.prioritize}</span>
                  <span>${"deadline: " + moment(todo.date).toNow(true) + " left"}</span>
               </div>
            </div>
            <div class="listItem_trash" onclick="removeTodo(${index})">
               <ion-icon name="trash-outline"></ion-icon>
            </div>
         </div>
         `;
   });
   tastList.html(todoListMap);
}
function handleEvent() {
   $(".cancelTodo").click(() => {
      inputForm.removeClass("active");
      tastList.removeClass("active");
      clearInput();
   });

   $(".saveTodo").click(() => {
      if (todoInput.val() == "" || deadlineInput.val() == "") return;
      saveTodo();
   });

   $(".listItem_detail").each((index, element) => {
      element.onclick = () => {
         listItemExpand.addClass("active");
         renderExpandTodo(element.parentNode.getAttribute("id-todo"));
      };
   });
   todoInput.focus(() => {
      inputForm.addClass("active");
      tastList.addClass("active");
   });

   $(".miniTaskInput").keypress(function (event) {
      var keycode = event.keyCode ? event.keyCode : event.which;
      if (keycode == "13") {
         console.log("object");
      }
   });
}

function finishTodo(index) {
   todos[index].isFinish ? todos[index].isFinish = false : todos[index].isFinish = true;
   addToLocalStorage(myKey, todos);
   render(todos);
   console.log( $('#finishTodo'))
   if(todos[index].isFinish){
      $('#finishTodo').play();
   }
}
function removeTodo(index) {
   if (confirm("Are you sure?")) {
      todos.splice(index, 1);
      addToLocalStorage(myKey, todos);
      render(todos);
   }
}
function saveTodo() {
   todos.unshift({
      isFinish: false,
      title: `${todoInput.val()}`,
      isRepeat: false,
      date: `${deadlineInput.val()}`,
      desc: "",
      timeBlock: `${counterInput.val()}`,
      prioritize: `${selectInput.val() ?? ""}`,
      subTodo: [],
   });
   addToLocalStorage(myKey, todos);
   clearInput();
   render(todos);
}
function saveMiniTodo(index) {
   todos[index].subTodo.unshift({
      miniTitle:  $('.miniTaskInput').value,
   })
   addToLocalStorage(myKey, todos);
   renderExpandTodo(index);     
}
function saveExpandTodo(index){

   todos[index].title = $('.listItem_expand-top h1').textContent
   todos[index].desc = $('.desciption').value
   addToLocalStorage(myKey, todos);
   render(todos);
}
function finishMinitodo(index, currentIndex){
   todos[index].subTodo.splice(currentIndex, 1)
   addToLocalStorage(myKey, todos);
   renderExpandTodo(index);  
   $('#finishMiniTodo').play(); 
}

function clearInput() {
   todoInput.val("");
   selectInput.val("");
   deadlineInput.val("");
   counterInput.val("");
}
function getTodoFromLocalStorage() {
   return JSON.parse(localStorage.getItem(myKey)) || [];
}
function addToLocalStorage(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}
function renderExpandTodo(index) {
   const currentTodo = todos[index];
   console.log(todos[index])
   const currentTodoExpand = `
            <div class="listItem_expand-top">
               <h1 contenteditable="true">${currentTodo.title}</h1>
            </div>
            <div class="TaskInput">
               <input class="miniTaskInput"  type="text" placeholder="Add one more step" />
               <button class="addMiniTodo" onclick ="saveMiniTodo(${index})">Add</button>
            </div>
            <div class="miniList">
               ${currentTodo.subTodo.map((miniTodo, currentIndex) => {
                  return `
                  <div class="miniList-item">
                     <ion-icon name="ellipse-outline" onclick="finishMinitodo( ${index}, ${currentIndex})"></ion-icon>
                     <audio id="finishMiniTodo" src="./assets/music/finish2.mp3"></audio>
                     <h1 contenteditable="true"> ${miniTodo.miniTitle}</h1>
                  </div>
                  `;
               }).join('')}
            </div>
            <textarea name="desciption" class="desciption" placeholder="Desciption here...">
               ${currentTodo.desc}
            </textarea>
            <div class="btnBLock">
                  <button class="btnCancel" onclick="function closeExpand(){ listItemExpand.removeClass('active')};closeExpand()">Cancel</button>
                  <button class="btnSave" onclick = "saveExpandTodo(${index})">Save</button>
            </div>`;
   listItemExpand.html(currentTodoExpand);
}
function addTodo() {
   let index = todos.length + 1;
   const nodeTodo = `
      <div class="listItem" id-todo = ${index}>
      <div class= "listItem_finish"}>
         <ion-icon name= "ellipse-outline"}></ion-icon>
      </div>
      <div class="listItem_detail" >
         <h1>${todoInput.val()}</h1>
         <div class="listItem_detail-mini">
            <span class="prioritize ${selectInput.val()}">${selectInput.val()}</span>
            <span>${"deadline: " + moment(deadlineInput.val()).toNow(true) + " left"}</span>
         </div>
      </div>
      <div class="listItem_trash" 
         onclick="function delete(){ 
            removeTodo(todos, element.parentNode.getAttribute("id-todo"))
         }delete()">
         <ion-icon name="trash-outline"></ion-icon>
      </div>
   </div>`;
   tastList.append(nodeTodo);
   console.log(todos);
}