const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const listItem = $(".listItem");
const listItemExpand = $(".listItem_expand");
const todoInput = $("#todoInput");
const TODO = "TODO";

const todoApp = {
   config: JSON.parse(localStorage.getItem(TODO)) || {},
   setConfig: function (key, value) {
      this.config[key] = value;
      localStorage.setItem(TODO, JSON.stringify(this.config));
   },
   todos: [
      {
         isFinish: false,
         title: "design a todo list",
         isImportant: true,
         isRepeat: true,
         date: '18 / 02 / 2000',
         file: "",
         desc: "day la mieu ta task",
         timeBlock: 4,
         prioritize: "flag3",
         subTodo: {
            subTitle: "troi oi",
         },
      },
      {
         isFinish: true,
         title: "cai thu 2, cai nay de test rat sdbfhsdh",
         isImportant: false,
         isRepeat: true,
         date: '18 / 02 / 2000',
         file: "",
         desc: "day la mieu ta task",
         timeBlock: 4,
         prioritize: "flag1",
         subTodo: {
            subTitle: "troi oi",
         },
      },
   ],
   handleEvent: function () {
      _this = this;
      listItem.onclick = function () {
         listItemExpand.classList.toggle("active");
      };

      //ấn enter nhập todo vào list
      todoInput.addEventListener("keypress", function (e) {
         if (e.key === "Enter") {
            console.log("object")
            _this.setConfig(TODO, `
            {
               isFinish: false,
               title: "${todoInput.value}",
               isImportant: false,
               isRepeat: false,
               date: '',
               file: "",
               desc: "",
               timeBlock: "",
               prioritize: "",
               subTodo: {},
            },
            `)
         }
      });
   },
   render: function () {
      const todoListMap =  this.todos.map((todo, index) => {
         return`
         <div class="listItem">
            <div class= "listItem_finish"}>
               <ion-icon name= ${todo.isFinish? "ribbon-outline" : "ellipse-outline"}></ion-icon>
            </div>
            <div class="listItem_detail">
               <${todo.isFinish? 's' : 'h1'}>
                  ${todo.title} 
               </${todo.isFinish? 's' : 'h1'}>
               <div class="listItem_detail-mini">
                  <span class="prioritize ${todo.prioritize}">${todo.prioritize}</span>
                  <span>${todo.date}</span>
               </div>
            </div>
            <div class= ${todo.isImportant ? "listItem_important important" : "listItem_important"}>
               <ion-icon name=${todo.isImportant ? "star" : "star-outline"}></ion-icon>
            </div>
         </div>
         `
      });
      $('.tastList').innerHTML = todoListMap.join('');
   },

   start: function () {
      this.handleEvent();
      this.render();
   },
};
todoApp.start();



