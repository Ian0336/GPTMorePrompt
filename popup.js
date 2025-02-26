document.addEventListener('DOMContentLoaded', function() {
  var main = document.getElementById("main");
  var addBtn = document.getElementById("addBtn");
  var promptOptions = [];

  // Load saved prompts
  if (localStorage.getItem("promptOptions")) {
    var tmp = localStorage.getItem("promptOptions").split(",");
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "") promptOptions.push(tmp[i]);
    }
  }

  // Display empty state message if no prompts exist
  function checkEmptyState() {
    if (promptOptions.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";
      emptyState.textContent = "No prompts yet. Add your first prompt!";
      main.appendChild(emptyState);
    } else {
      const existingEmptyState = main.querySelector(".empty-state");
      if (existingEmptyState) {
        main.removeChild(existingEmptyState);
      }
    }
  }

  // Add new prompt when button is clicked
  addBtn.addEventListener("click", function () {
    promptOptions.push("New prompt");
    renderPrompts();
    setLocalStorage();
  });

  // Handle input field changes
  function handleInputChange(e) {
    const value = e.target.value;
    const inputID = parseInt(e.target.dataset.index);
    console.log("change here " + value);

    promptOptions[inputID] = value;
    setLocalStorage();
  }

  // Handle delete button clicks
  function handleDeleteClick(index) {
    promptOptions.splice(index, 1);
    renderPrompts();
    setLocalStorage();
  }

  // Render all prompts
  function renderPrompts() {
    // Clear existing content
    main.innerHTML = '';
    
    // Add each prompt as an input field
    for (let i = 0; i < promptOptions.length; i++) {
      const promptItem = document.createElement("div");
      promptItem.className = "prompt-item";
      
      const input = document.createElement("input");
      input.type = "text";
      input.className = "input";
      input.value = promptOptions[i];
      input.dataset.index = i;
      input.oninput = handleInputChange;
      
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "×";
      deleteBtn.title = "Delete prompt";
      deleteBtn.addEventListener('click', () => handleDeleteClick(i));
      
      promptItem.appendChild(input);
      promptItem.appendChild(deleteBtn);
      main.appendChild(promptItem);
    }
    
    checkEmptyState();
  }

  // Save prompts to localStorage and send to content script using the original method
  function setLocalStorage() {
    var tmp = "";
    for (var i = 0; i < promptOptions.toString().length; i++) {
      if (promptOptions[i] != undefined) {
        tmp += promptOptions[i];
        if (i != promptOptions.toString().length - 1) tmp += ",";
      }
    }
    
    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   if (tabs[0] && tabs[0].id) {
    //     chrome.tabs.sendMessage(tabs[0].id, { options: promptOptions });
    //   }
    // });
    
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { options: promptOptions });
    });
    console.log(tmp);
    localStorage.setItem("promptOptions", tmp);
  }

  // Initial render
  renderPrompts();
});
