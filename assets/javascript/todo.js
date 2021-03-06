const listItemExpand = $(".listItem_expand");
const todoInput = $(".todoInput");
const selectInput = $(".selectInput");
const pomodoro = $(".pomodoro");
const deadlineInput = $(".deadlineInput");
const counterInput = $(".counterInput");
const tastList = $(".tastList");
const inputForm = $("#inputForm");
const pomodoroTask = $("#pomodoroTask");
const myKey = "TODOs";
const reportKey = "report";

const todos = getDataFromLocalStorage(myKey);
const reportStore = getDataFromLocalStorage(reportKey);

function runTodoApp() {
   render(todos);
   handleEvent();
   onStartWork();
}
runTodoApp();

function render(todos) {
   const todoListMap = todos.map((todo, index) => {
      return `
         <div class="listItem" id-todo = ${index}>
            <div class= "listItem_finish" onclick="finishTodo(${index})">
               <ion-icon name= ${todo.isFinish ? "ribbon-outline" : "ellipse-outline"}></ion-icon>
            </div>
            <div class="listItem_detail" onclick ="openExpand(${index})" >
               <${todo.isFinish ? "s" : "h1"}>
                  ${todo.title} 
               </${todo.isFinish ? "s" : "h1"}>
               <div class="listItem_detail-mini">
                  <span class="prioritize ${todo.prioritize}">${todo.prioritize}</span>
                  <span class= " todoDeadline ${
                     parseInt(moment(todo.date).diff(moment().format("l"))) == 0
                        ? "today"
                        : parseInt(moment(todo.date).diff(moment().format("l"))) > 0
                        ? "inFuture"
                        : "overdate"
                  }" >
                     ${"deadline: " + moment(todo.date).fromNow()}
                  </span>
               </div>
            </div>
            <div class="listItem_trash" onclick="removeTodo(${index})">
               <ion-icon name="trash-outline"></ion-icon>
            </div>
         </div>
         `;
   });
   tastList.html(todoListMap);
   //
}
function renderExpandTodo(index) {
   const currentTodo = todos[index];
   const currentTodoExpand = `
            <div class="listItem_expand-top">
               <h1 contenteditable="true">${currentTodo.title}</h1>
               <button class="toWork" onclick="toWork(${index})">work</button>

            </div>
            <div class="TaskInput">
               <input class="miniTaskInput"  type="text" placeholder="Add one more step" />
               <button class="addMiniTodo" onclick ="saveMiniTodo(${index})">Add</button>
            </div>
            <div class="miniList">
               ${currentTodo.subTodo
                  .map((miniTodo, currentIndex) => {
                     return `
                  <div class="miniList-item">
                     <ion-icon name="ellipse-outline" onclick="finishMinitodo( ${index}, ${currentIndex})"></ion-icon>
                     <h1 contenteditable="true"> ${miniTodo.miniTitle}</h1>
                  </div>
                  `;
                  })
                  .join("")}
            </div>
            <textarea name="desciption" class="desciption" placeholder="Desciption here...">
               ${currentTodo.desc}
            </textarea>
            <input type="date" name="" class="dateLineFix" value = ${currentTodo.date}>
            <div class="btnBLock">
                  <button class="btnCancel" onclick="closeExpand()">Cancel</button>
                  <button class="btnSave" onclick="saveExpandTodo(${index})">Save</button>
            </div>`;
   listItemExpand.html(currentTodoExpand);
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

   todoInput.focus(() => {
      inputForm.addClass("active");
      tastList.addClass("active");
   });
}
function finishTodo(index) {
   todos[index].isFinish ? (todos[index].isFinish = false) : (todos[index].isFinish = true);
   addToLocalStorage(myKey, todos);
   render(todos);
   if (todos[index].isFinish) {
      let myPip = new Audio();
      myPip.src = "./assets/music/finish2.mp3";
      myPip.play();
   }
}
function saveMiniTodo(index) {
   todos[index].subTodo.unshift({
      miniTitle: $(".miniTaskInput").val(),
   });
   addToLocalStorage(myKey, todos);
   renderExpandTodo(index);
}

function saveExpandTodo(index) {

   todos[index].title = $(".listItem_expand-top h1").text();
   todos[index].desc = $(".desciption").val();
   todos[index].date = $(".dateLineFix").val();

   addToLocalStorage(myKey, todos);
   render(todos);
}

function finishMinitodo(index, currentIndex) {
   todos[index].subTodo.splice(currentIndex, 1);
   addToLocalStorage(myKey, todos);
   renderExpandTodo(index);
   let myPip = new Audio();
   myPip.src = "./assets/music/finish.mp3";
   myPip.play();
}
function openExpand(index) {
   listItemExpand.addClass("active");
   pomodoro.addClass("pomodoroClose");
   renderExpandTodo(index);
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
      date: `${deadlineInput.val()}`,
      desc: "",
      timeBlock: `${counterInput.val() ?? 0}`,
      timeBlockFinsh: 0,
      prioritize: `${selectInput.val() ?? ""}`,
      subTodo: [],
   });
   addToLocalStorage(myKey, todos);
   clearInput();
   render(todos);
}
function closeExpand() {
   listItemExpand.removeClass("active");
   pomodoro.removeClass("pomodoroClose");
}
function clearInput() {
   todoInput.val("");
   selectInput.val("");
   deadlineInput.val("");
   counterInput.val("");
}
function getDataFromLocalStorage(key) {
   return JSON.parse(localStorage.getItem(key)) || [];
}
function addToLocalStorage(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}

/* function for pomodoro and todolist combine*/
function workDoneSection(index) {
   let newTimeBlockFinish = parseInt(todos[index].timeBlockFinsh) + 1;
   todos[index].timeBlockFinsh = newTimeBlockFinish;
   addToLocalStorage(myKey, todos);
   toWork(index);

   reportStore.push({
      title: todos[index].timeBlockFinsh,
      ondate: moment().format("l"),
      taskFinish: newTimeBlockFinish,
   });
   addToLocalStorage(reportKey, reportStore);
}
function toWork(index) {
   listItemExpand.removeClass("active");
   pomodoro.removeClass("pomodoroClose");

   const onTask = `
      <p id-work=${index}>${todos[index].title}</p>
      <span>${todos[index].timeBlockFinsh} </span>
      <span>/</span>
      <span>${todos[index].timeBlock} </span>
   `;
   pomodoroTask.html(onTask);
}
function onStartWork() {
   const onTask = `
      <p id-work=${0}>${todos[0].title}</p>
      <span>${todos[0].timeBlockFinsh} </span>
      <span>/</span>
      <span>${todos[0].timeBlock} </span>
   `;
   pomodoroTask.html(onTask);
}
