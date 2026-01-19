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
    #prompt-container.prompt-container {
      all: initial !important;
      position: fixed !important;
      top: 50% !important;
      right: 16px !important;
      transform: translateY(-50%) !important;
      z-index: 2147483647 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      box-sizing: border-box !important;
    }
    
    #prompt-select-button.prompt-button {
      all: initial !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 8px !important;
      color: #333333 !important;
      background-color: transparent !important;
      padding: 8px 12px !important;
      border-radius: 8px !important;
      transition: background-color 0.2s !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
      border: 1px solid #e5e7eb !important;
      cursor: pointer !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 16px !important;
      line-height: 1 !important;
      box-sizing: border-box !important;
    }
    
    #prompt-select-button.prompt-button:hover {
      scale: 1.05 !important;
    }
    
    #options-modal.modal-overlay {
      all: initial !important;
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      bottom: 0 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      z-index: 2147483647 !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      box-sizing: border-box !important;
    }
    
    #options-modal .modal-content {
      all: initial !important;
      display: block !important;
      background-color: #2d2d2d !important;
      border-radius: 12px !important;
      padding: 20px !important;
      max-width: 400px !important;
      width: 90% !important;
      max-height: 500px !important;
      overflow-y: auto !important;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.5 !important;
      box-sizing: border-box !important;
      color: #e5e5e5 !important;
    }
    
    #options-modal .modal-header {
      all: initial !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      margin-bottom: 16px !important;
      padding-bottom: 12px !important;
      border-bottom: 1px solid #404040 !important;
      box-sizing: border-box !important;
    }
    
    #options-modal .modal-title {
      all: initial !important;
      display: block !important;
      font-size: 18px !important;
      font-weight: 600 !important;
      color: #e5e5e5 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    #options-modal .close-button {
      all: initial !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      width: 28px !important;
      height: 28px !important;
      border-radius: 6px !important;
      color: #a0a0a0 !important;
      background-color: transparent !important;
      border: none !important;
      cursor: pointer !important;
      font-size: 18px !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      transition: background-color 0.2s !important;
    }
    
    #options-modal .close-button:hover {
      background-color: #404040 !important;
      color: #ffffff !important;
    }
    
    #options-modal .options-list {
      all: initial !important;
      display: flex !important;
      flex-direction: column !important;
      gap: 6px !important;
      box-sizing: border-box !important;
    }
    
    #options-modal .option {
      all: initial !important;
      display: block !important;
      padding: 12px 14px !important;
      border-radius: 8px !important;
      cursor: pointer !important;
      color: #d0d0d0 !important;
      background-color: #3d3d3d !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 14px !important;
      line-height: 1.4 !important;
      transition: background-color 0.15s, transform 0.1s !important;
      border: 1px solid #505050 !important;
      box-sizing: border-box !important;
    }
    
    #options-modal .option:hover {
      background-color: #505050 !important;
      transform: translateX(2px) !important;
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
