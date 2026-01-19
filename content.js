window.onload = function () {
  mainFunction();
};
var textarea;
var promptContainer;
var selectButton;
var options = [];
var type = "";


function mainFunction() {
  checkType();
  addStyles();
  setup();
  createSelectButton();
}

function checkType() {
  if (document.URL.includes("chatgpt.com")) {
    type = "chatGPT";
  } else if (document.URL.includes("gemini.google.com")) {
    type = "gemini";
  }
}

function addStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .prompt-container {
      position: fixed;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      z-index: 50;
      display: flex;
      align-items: center;
      gap: 8px;
      color: inherit;
    }
    
    .prompt-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: inherit;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      border: 1px solid #e5e7eb;
      cursor: pointer;
    }
    
    .prompt-button:hover {
      background-color: #f3f4f6;
    }
    
    .dark .prompt-button:hover {
      background-color: #374151;
    }
    
    .dark .prompt-button {
      border-color: #4b5563;
    }
    
    .prompt-button-selected {
      border-width: 2px;
      border-color: white;
      font-weight: 500;
      color: #333333;
    }
    
    .dark .prompt-button-selected {
      border-color: #374151;
      color: #e5e5e5;
    }
    
    .insert-button {
      display: flex;
      align-items: center;
      gap: 8px;
      color: inherit;
      padding: 8px 12px;
      border-radius: 8px;
      transition: background-color 0.2s;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      cursor: pointer;
    }
    
    .insert-button:hover {
      background-color: #f3f4f6;
    }
    
    .dark .insert-button:hover {
      background-color: #374151;
    }
    
    .modal-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 50;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
      background-color: white;
      border-radius: 8px;
      padding: 16px;
      max-width: 28rem;
      width: 100%;
      max-height: 24rem;
      overflow-y: auto;
    }
    
    .dark .modal-content {
      background-color: #1f2937;
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .modal-title {
      font-size: 1.125rem;
      font-weight: 500;
      color: #111827;
    }
    
    .dark .modal-title {
      color: white;
    }
    
    .close-button {
      color: #9ca3af;
    }
    
    .close-button:hover {
      color: #6b7280;
    }
    
    .close-button:focus {
      outline: none;
    }
    
    .options-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .option {
      padding: 8px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    .option:hover {
      background-color: #f3f4f6;
    }
    
    .dark .option:hover {
      background-color: #374151;
    }
    
    .option-selected {
      font-weight: 500;
    }
    
    .option-checkmark {
      color: #333333;
    }
    
    .dark .option-checkmark {
      color: #e5e5e5;
    }
  `;
  document.head.appendChild(styleElement);
}

function setup() {
  if (localStorage.getItem("promptOptions")) {
    var tmp = localStorage.getItem("promptOptions").split(",");
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "") options.push(tmp[i]);
    }
  }
  
  textarea = getTextarea();
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}

function getTextarea() {
  if (type === "chatGPT") {
    return document.getElementById("prompt-textarea");
  } else if (type === "gemini") {
    // Gemini uses a contenteditable div with class "ql-editor"
    return document.querySelector('.ql-editor.textarea');
  }
  return null;
}

function createSelectButton() {
  // Check if the button already exists
  if (document.getElementById("prompt-select-button")) return;

  promptContainer = document.createElement("div");
  promptContainer.id = "prompt-container";
  promptContainer.className = "prompt-container";
  
  // Create a button with pencil icon
  selectButton = document.createElement("div");
  selectButton.id = "prompt-select-button";
  selectButton.className = "prompt-button";
  selectButton.innerHTML = "✏️";
  
  // Add click event listener to open modal
  selectButton.addEventListener("click", function() {
    showOptionsModal();
  });
  
  promptContainer.appendChild(selectButton);
  // Add the button to the page
  document.body.appendChild(promptContainer);
}

function showOptionsModal() {
  // Remove existing modal if there is one
  const existingModal = document.getElementById("options-modal");
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal container
  const modal = document.createElement("div");
  modal.id = "options-modal";
  modal.className = "modal-overlay";
  
  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";
  
  // Create modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  
  const modalTitle = document.createElement("h3");
  modalTitle.className = "modal-title";
  modalTitle.textContent = "Select a Prompt";
  
  const closeButton = document.createElement("button");
  closeButton.className = "close-button";
  closeButton.innerHTML = "✕";
  closeButton.onclick = function() {
    modal.remove();
  };
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Create options list
  const optionsList = document.createElement("div");
  optionsList.className = "options-list";
  
  // Add options to the list
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement("div");
    option.className = "option";
    option.textContent = options[i];
    
    option.onclick = function() {
      const selectedPrompt = options[i];
      // Insert the prompt immediately
      changeTextarea(selectedPrompt);
      
      // Find and submit based on type
      setTimeout(() => {
        submitPrompt();
      }, 100);
      modal.remove();
    };
    optionsList.appendChild(option);
  }
  
  // Assemble modal
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(optionsList);
  modal.appendChild(modalContent);
  
  // Add modal to the page
  document.body.appendChild(modal);
  
  // Close modal when clicking outside
  modal.addEventListener("click", function(event) {
    if (event.target === modal) {
      modal.remove();
    }
  });
}

function setLocalStorage() {
  var tmp = "";
  for (var i = 0; i < options.length; i++) {
    if (options[i] != undefined) {
      tmp += options[i];
      if (i != options.length - 1) tmp += ",";
    }
  }
  localStorage.setItem("promptOptions", tmp);
}

var observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    // Check for textarea changes based on type
    const newTextarea = getTextarea();
    if (newTextarea && newTextarea !== textarea) {
      textarea = newTextarea;
    }

    createSelectButton();
  });
});

function submitPrompt() {
  if (type === "chatGPT") {
    // ChatGPT: submit the form
    const form = textarea.closest('form');
    if (form) {
      console.log("ChatGPT form", form);
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  } else if (type === "gemini") {
    // Gemini: click the send button
    const sendButton = document.querySelector('button.send-button');
    if (sendButton) {
      console.log("Gemini send button", sendButton);
      sendButton.click();
    }
  }
}

function changeTextarea(selectedPrompt) {
  // Re-fetch textarea in case it changed
  textarea = getTextarea();
  if (!selectedPrompt || !textarea) {
    console.log("No textarea found or no prompt", { type, textarea, selectedPrompt });
    return;
  }
  
  if (type === "gemini") {
    // Gemini uses contenteditable div
    // Clear existing content and add new prompt
    const existingText = textarea.innerText.trim();
    if (!existingText.endsWith(selectedPrompt)) {
      let newArea = document.createElement("p");
      newArea.innerText = selectedPrompt;
      textarea.appendChild(newArea);
      console.log("Gemini: added prompt", newArea);
      
      // Trigger input event to let Gemini know content changed
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
  } else if (textarea.children && textarea.children.length > 0 && !textarea.children[textarea.children.length - 1].innerText.endsWith(selectedPrompt)) {
    // ChatGPT rich text editor
    let newArea = document.createElement("p");
    newArea.innerText = selectedPrompt;
    textarea.appendChild(newArea);
    console.log("ChatGPT: added prompt", newArea);
  } else if (textarea.value !== undefined) {
    // Handle plain textareas (not rich text)
    if (!textarea.value.endsWith(selectedPrompt)) {
      textarea.value += (textarea.value ? "\n" : "") + selectedPrompt;
    }
  }
  
  // Focus the textarea
  textarea.focus();
}

// Update message listener for Manifest V3 compatibility
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.options) {
    console.log(request.options);
    options = [];
    var tmp = request.options;
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "" && tmp[i] != null) options.push(tmp[i]);
    }
    setLocalStorage();
    // Send response to indicate successful reception
    sendResponse({status: "Options updated successfully"});
    return true; // Required for async sendResponse in Manifest V3
  }
});
