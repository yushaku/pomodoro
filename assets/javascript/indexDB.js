const dbName = "Yushaku";
const collection = "todos";


var request = window.indexedDB.open(dbName, 1)
var db = null;

request.onupgradeneeded = (event) => {
   db = event.target.result
   db.createObjectStore(collectionName, {
      // Giá trị cột key tự động tăng
      autoIncrement: true
   })
}