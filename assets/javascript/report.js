import {chart} from './data.js'
const ctx1 = document.querySelector("#lineChart");
var chart1 = new Chart(ctx1, {
   type: "bar",
   data: chart,
   options: {},
});