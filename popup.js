document.addEventListener('DOMContentLoaded', function() {
  var main = document.getElementById("main");
  var addBtn = document.getElementById("addBtn");
  var promptOptions = [];

  // Load saved prompts from chrome.storage
  chrome.storage.local.get(['promptOptions'], function(result) {
    if (result.promptOptions && Array.isArray(result.promptOptions)) {
      promptOptions = result.promptOptions.filter(opt => opt != "");
    }
    renderPrompts();
  });

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
    saveToStorage();
  });

  // Handle input field changes
  function handleInputChange(e) {
    const value = e.target.value;
    const inputID = parseInt(e.target.dataset.index);
    console.log("change here " + value);

    promptOptions[inputID] = value;
    saveToStorage();
  }

  // Handle delete button clicks
  function handleDeleteClick(index) {
    promptOptions.splice(index, 1);
    renderPrompts();
    saveToStorage();
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

  // Save prompts to chrome.storage and notify content scripts to reload
  function saveToStorage() {
    chrome.storage.local.set({ promptOptions: promptOptions }, function() {
      console.log("Options saved to chrome.storage:", promptOptions);
      // Notify all matching tabs to reload options
      notifyContentScripts();
    });
  }

  // Notify all ChatGPT/Gemini tabs to reload options from storage
  function notifyContentScripts() {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        if (tab.id && tab.url && (
          tab.url.includes("chatgpt.com") || 
          tab.url.includes("chat.openai.com") ||
          tab.url.includes("gemini.google.com")
        )) {
          chrome.tabs.sendMessage(tab.id, { action: "reloadOptions" })
            .catch(error => console.log("Tab " + tab.id + " not ready:", error));
        }
      });
    });
  }
});
