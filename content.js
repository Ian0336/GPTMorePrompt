window.onload = function () {
  mainFunction();
};
var textarea;
var promptContainer;
var selectButton;
var selectPrompt = "";
var options = ["No prompt"];
const maxShowPromptLength = 5;

function mainFunction() {
  setup();

  createSelectButton();
}

function setup() {
  if (localStorage.getItem("promptOptions")) {
    var tmp = localStorage.getItem("promptOptions").split(",");
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "") options.push(tmp[i]);
    }
  }
  
  textarea = document.getElementById("prompt-textarea");
  

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false,
    characterData: false,
  });
}



function createSelectButton() {
  // Check if the button already exists
  if (document.getElementById("prompt-select-button")) return;

  promptContainer = document.createElement("div");
  promptContainer.id = "prompt-container";
  promptContainer.className = "flex items-center gap-x-2 text-token-text-primary px-3 py-2 rounded-lg  transition-colors duration-200 shadow-sm dark:border-gray-600 cursor-pointer";
  
  // Create a beautiful button with modern styling
  selectButton = document.createElement("div");
  selectButton.id = "prompt-select-button";
  selectButton.className = "flex items-center gap-x-2 text-token-text-primary px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm border border-gray-200 dark:border-gray-600 cursor-pointer";
  // Update button appearance based on selected prompt
  updatePromptButtonAppearance();
  
  // Add click event listener to open modal
  selectButton.addEventListener("click", function() {
    showOptionsModal();
  });
  
  promptContainer.appendChild(selectButton);
  // Add the button to the page
  let targetPosition = document.querySelector("div[id='composer-background']");
  if (targetPosition) {
    targetPosition.children[1].insertBefore(promptContainer, targetPosition.children[1].children[0]);
  }
}

function updatePromptButtonAppearance() {
  if (!selectButton) return;
  
  // Remove existing insert button if it exists
  const existingInsertButton = document.getElementById("insert-prompt-button");
  if (existingInsertButton) {
    existingInsertButton.remove();
  }
  
  if (selectPrompt === "") {
    // No prompt selected - default appearance
    selectButton.textContent = "Prompts";
    selectButton.classList.remove("border-2", "border-white", "dark:border-gray-700", "font-medium", "text-blue-600", "dark:text-blue-400");
  } else {
    // Prompt selected - highlight appearance
    // Truncate long prompt names
    const displayText = selectPrompt.length > maxShowPromptLength ? selectPrompt.substring(0, maxShowPromptLength) + "..." : selectPrompt;
    selectButton.textContent = displayText;
    selectButton.classList.add("border-2", "border-white", "dark:border-gray-700", "font-medium", "text-blue-600", "dark:text-blue-400");
    
    // Create and add insert button
    const insertButton = document.createElement("button");
    insertButton.id = "insert-prompt-button";
    insertButton.className = "flex items-center gap-x-2 text-token-text-primary px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 shadow-sm dark:border-gray-600"
    insertButton.textContent = "↑";
    insertButton.addEventListener("click", function(e) {
      e.stopPropagation(); // Prevent the click from triggering the parent container's click event
      changeTextarea();
    });
    
    promptContainer.appendChild(insertButton);
  }
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
  modal.className = "fixed inset-0 flex items-center justify-center z-50";
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  
  // Create modal content
  const modalContent = document.createElement("div");
  modalContent.className = "bg-white dark:bg-gray-800 rounded-lg p-4 max-w-md w-full max-h-96 overflow-y-auto";
  
  // Create modal header
  const modalHeader = document.createElement("div");
  modalHeader.className = "flex justify-between items-center mb-4";
  
  const modalTitle = document.createElement("h3");
  modalTitle.className = "text-lg font-medium text-gray-900 dark:text-white";
  modalTitle.textContent = "Select a Prompt";
  
  const closeButton = document.createElement("button");
  closeButton.className = "text-gray-400 hover:text-gray-500 focus:outline-none";
  closeButton.innerHTML = "✕";
  closeButton.onclick = function() {
    modal.remove();
  };
  
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeButton);
  
  // Create options list
  const optionsList = document.createElement("div");
  optionsList.className = "space-y-2";
  
  // Add options to the list
  for (let i = 0; i < options.length; i++) {
    const option = document.createElement("div");
    option.className = "p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer";
    
    // Add a checkmark to indicate currently selected option
    if (options[i] === selectPrompt) {
      option.innerHTML = `<span class="text-blue-600 dark:text-blue-400">✓</span> ${options[i]}`;
      option.classList.add("font-medium");
    } else {
      option.textContent = options[i];
    }
    
    option.onclick = function() {
      if (options[i] === "No prompt") {
        selectPrompt = "";
      } else {
        selectPrompt = options[i];
      }
      updatePromptButtonAppearance(); // Update button appearance after selection
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
    // Check for textarea changes
    const newTextarea = document.getElementById("prompt-textarea");
    if (newTextarea && newTextarea !== textarea) {
      textarea = newTextarea;
    }

    createSelectButton();
  });
});

function changeTextarea() {
  if (!selectPrompt) return;
  
  if (textarea.children.length > 0 && !textarea.children[textarea.children.length - 1].innerText.endsWith(selectPrompt)) {
    let newArea = document.createElement("p");
    newArea.innerText = selectPrompt;
    textarea.appendChild(newArea);
  }
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.options) {
    console.log(request.options);
    options = ["No prompt"];
    var tmp = request.options;
    for (var i = 0; i < tmp.length; i++) {
      if (tmp[i] != "" && tmp[i] != null) options.push(tmp[i]);
    }
    setLocalStorage();
    // No need to update dropdown content since we're using a modal now
  }
});
