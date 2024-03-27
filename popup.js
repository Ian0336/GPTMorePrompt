var main = document.getElementById("main");
var addBtn = document.getElementById("addBtn");
var promptOptions = [];
/* localStorage.setItem("promptOptions", ""); */
if (localStorage.getItem("promptOptions")) {
  var tmp = localStorage.getItem("promptOptions").split(",");
  for (var i = 0; i < tmp.length; i++) {
    if (tmp[i] != "") promptOptions.push(tmp[i]);
  }
}

addBtn.addEventListener("click", function () {
  promptOptions.push("new Prompt");

  changeDropdownContent();
});
//add inputs to main

for (var i = 0; i < promptOptions.length; i++) {
  var input = document.createElement("input");
  input.type = "text";
  input.id = i;
  input.className = "input";
  input.value = promptOptions[i];
  input.onchange = inputChange;
  main.appendChild(input);
}

function inputChange(e) {
  var value = e.target.value;
  var inputID = parseInt(e.target.id);

  if (value === "") {
    // delete input
    promptOptions[inputID] = undefined;

    main.removeChild(e.target);
  } else {
    //check if value is unique

    promptOptions[inputID] = value;
  }
  console.log(promptOptions);
  setLocalStorage();
}
function changeDropdownContent() {
  //delete old options
  var input = document.createElement("input");
  input.type = "text";
  input.id = document.getElementsByClassName("input").length;
  input.className = "input";
  input.value = "new Prompt";
  input.onchange = inputChange;
  main.appendChild(input);
  setLocalStorage();
}
function setLocalStorage() {
  var tmp = "";
  for (var i = 0; i < promptOptions.toString().length; i++) {
    if (promptOptions[i] != undefined) {
      tmp += promptOptions[i];
      if (i != promptOptions.toString().length - 1) tmp += ",";
    }
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { options: promptOptions });
  });
  console.log(tmp);
  localStorage.setItem("promptOptions", tmp);
}
