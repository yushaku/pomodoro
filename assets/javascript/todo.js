const listItemExpand = $(".listItem_expand");
const todoInput = $(".todoInput");
const selectInput = $(".selectInput");
const deadlineInput = $(".deadlineInput");
const counterInput = $(".counterInput");
const tastList = $(".tastList")
const inputForm = $("#inputForm")
const myKey = "TODOs";

const todos = getTodoFromLocalStorage()

function runTodoApp(){
   render(todos);
   handleEvent();
}runTodoApp();

function render(todos){
   console.log(todos)
      const todoListMap = todos.map((todo, index) => {
         return `
         <div class="listItem" id-todo = ${index}>
            <div class= "listItem_finish"}>
               <ion-icon name= ${todo.isFinish ? "ribbon-outline" : "ellipse-outline"}></ion-icon>
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
            <div class="listItem_trash"}>
               <ion-icon name="trash-outline"></ion-icon>
            </div>
         </div>
         `;
      });
      tastList.html(todoListMap)

}
function handleEvent(){

   $(".cancelTodo").click(()=>{
      inputForm.removeClass("active");
      tastList.removeClass('active')
      clearInput();
   })

   $(".listItem_trash").each((index,element) => {
      element.onclick = function () {
         removeTodo(todos, index) 
      };
   });

   $(".listItem_finish").each((index, element) => {
      element.onclick = function () {
         finishTodo(todos, index);
      };
   });

   $(".saveTodo").click(()=> {
      if (todoInput.val() == "" || deadlineInput.val() == "") return;
      saveTodo(todos)
   });

   $('.listItem_detail').each((index,element)=>{
      element.onclick = ()=>{
         listItemExpand.addClass('active')
         console.log(element.parentNode.getAttribute('id-todo'))
         renderExpandTodo(todos, element.parentNode.getAttribute('id-todo'))
      }
   })
   todoInput.focus(() => {
      inputForm.addClass('active')
      tastList.addClass('active')
   })
}
function addTodo(){
   let index =  todos.length + 1
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
      <div class="listItem_trash"}>
         <ion-icon name="trash-outline"></ion-icon>
      </div>
   </div>`
   tastList.append(nodeTodo)
   console.log(todos)

}

function finishTodo(arrayTodo, index){
   if (arrayTodo[index].isFinish) {
      arrayTodo[index].isFinish = false;
   } else {
      arrayTodo[index].isFinish = true;
   }
   addToLocalStorage(myKey, arrayTodo);
   render(arrayTodo);
}
function removeTodo(arrayTodo, index){
   console.log("object")
   if (confirm("Are you sure?")) {
      arrayTodo.splice(index, 1);
      addToLocalStorage(myKey, arrayTodo);
      render(arrayTodo);
   }
}
function saveTodo(arrayTodo){
   arrayTodo.unshift({
      isFinish: false,
      title: `${todoInput.val()}`,
      isRepeat: false,
      date: `${deadlineInput.val()}`,
      desc: "",
      timeBlock: `${counterInput.val()}`,
      prioritize: `${selectInput.val() ?? ""}`,
      subTodo: {},
   });
   addToLocalStorage(myKey, arrayTodo);
   clearInput();
   render(arrayTodo);
}
function clearInput() {
   todoInput.val("")
   selectInput.val("")
   deadlineInput.val("")
   counterInput.val("") 
}
function getTodoFromLocalStorage()
{
   return JSON.parse(localStorage.getItem(myKey)) || []
} 
function addToLocalStorage(key, data) {
   localStorage.setItem(key, JSON.stringify(data));
}
function renderExpandTodo(arrayTodo, index){

   const currentTodo = arrayTodo[index]
   const currentTodoExpand = `
            <div class="listItem_expand-top">
               <h1 contenteditable="true">${currentTodo.title}</h1>
            </div>
            <div class="TaskInput">
               <input class="miniTaskInput" type="text" placeholder="Add one more step" />
            </div>
            <div class="miniList">
               <div class="miniList-item">
                  <ion-icon name="ellipse-outline"></ion-icon>
                  <h1 contenteditable="true">day là title</h1>
               </div>
            </div>
            <textarea name="desciption" class="desciption" placeholder="Desciption here...">
               ${currentTodo.desc}
            </textarea>
            <div class="btnBLock">
                  <button class="btnCancel">Cancel</button>
                  <button class="btnSave">Save</button>
            </div>`

            currentTodo.subTodo.map((miniTodo, index)=>{
               return`
               <div class="miniList-item">
                  <ion-icon name="ellipse-outline"></ion-icon>
                  <h1 contenteditable="true"> ${miniTodo.title}</h1>
               </div>
               `
            })
   
   listItemExpand.html(currentTodoExpand)
}