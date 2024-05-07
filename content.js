window.onload = function () {
  mainFunction();
};
var button;
var textarea;
var dropdown;
var options = ["None..."];

function mainFunction() {
  // button's class is absolute md:bottom-3 md:right-3 dark:hover:bg-gray-900 dark:disabled:hover:bg-transparent right-2 dark:disabled:bg-white disabled:bg-black disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors
  setup();

  button.addEventListener("click", function () {
    changeTextarea();
  });
  makeDropdown();
}
function setup() {
  if (localStorage.getItem("promptOptions")) {
    var tmp = localStorage.getItem("promptOptions").split(",");
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "") options.push(tmp[i]);
    }
  }
  
  textarea = document.getElementById("prompt-textarea"); // textarea的ID

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}
function makeDropdown() {
  if (document.getElementsByClassName("dropdown dropdown-dark").length != 0)
    return;
  dropdown = document.createElement("div");
  dropdown.className = "dropdown dropdown-dark px-3 text-base md:px-4 m-auto md:px-5 lg:px-1 xl:px-5 mt-1";
  console.log(dropdown);

  var dropdownContent = document.createElement("select");
  dropdownContent.className = "dropdown-select mx-auto flex flex-1 gap-3 text-base juice:gap-4 juice:md:gap-6 md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]";
  dropdownContent.name = "two";
  dropdownContent.id = "dropdownContent";
  //add options
  for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.value = options[i];
    option.text = options[i];
    dropdownContent.appendChild(option);
  }

  dropdown.appendChild(dropdownContent);
  let formPosition = document.getElementsByClassName(
    "w-full md:pt-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:w-[calc(100%-.5rem)] juice:w-full"
  );
  console.log(formPosition);
  formPosition[0].insertBefore(dropdown, formPosition[0].childNodes[1]);
}
function changeDropdownContent() {
  //delete old options
  var dropdownContent = document.getElementById("dropdownContent");
  dropdownContent.innerHTML = "";
  //add new options

  for (var i = 0; i < options.length; i++) {
    var option = document.createElement("option");
    option.value = options[i];
    option.text = options[i];
    dropdownContent.appendChild(option);
  }
}

function setLocalStorage() {
  var tmp = "";
  for (var i = 0; i < options.toString().length; i++) {
    if (options[i] != undefined && i != 0) {
      tmp += options[i];
      if (i != options.toString().length - 1) tmp += ",";
    }
  }
  localStorage.setItem("promptOptions", tmp);
}
var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    button = document.getElementsByClassName(
      "absolute bg-black md:bottom-3 md:right-3 dark:hover:bg-white right-2 disabled:opacity-10 disabled:text-gray-400 enabled:bg-black text-white p-0.5 border border-black rounded-lg dark:border-white dark:bg-white bottom-1.5 transition-colors"
    )[0]; // button的class
    if (button != undefined) {
      button.removeEventListener("click", function () {
        changeTextarea();
      });
      button.addEventListener("click", function () {
        changeTextarea();
      });
    }

    textarea = document.getElementById("prompt-textarea"); // textarea的ID
    makeDropdown();
  });
});

function changeTextarea() {
  var dropdownContent = document.getElementById("dropdownContent");
  if (dropdownContent.value == "None...") return;
  // check if change already
  var tmp = textarea.value.split("\n");
  if (tmp[tmp.length - 1] == dropdownContent.value) return;
  textarea.value = textarea.value + "\n" + dropdownContent.value;
}
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.options) {
    options = ["None..."];
    var tmp = request.options;
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "" && tmp[i] != null) options.push(tmp[i]);
    }
    setLocalStorage();
    changeDropdownContent();
  }
});
