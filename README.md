# GPTMorePrompt

GPTMorePrompt is a Chrome extension that enhances your ChatGPT experience by allowing you to save, manage, and quickly insert your favorite prompts with just a click.

## Features

- **Prompt Library**: Save and manage your collection of frequently used prompts
- **Quick Insert**: Insert saved prompts into ChatGPT with a single click
- **Modern UI**: Clean black and white interface that adapts to light/dark mode
- **Real-time Updates**: Changes to prompts are saved and synced instantly

## Installation

### From Source Code

1. Clone or download this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" by toggling the switch in the top-right corner
4. Click "Load unpacked" and select the folder containing the extension files
5. The extension should now be installed and visible in your Chrome toolbar

## Usage

### Managing Prompts

1. Click the extension icon in your Chrome toolbar to open the prompt manager
2. Click "+ Add New Prompt" to create a new prompt
3. Type your prompt text in the input field
4. Prompts are saved automatically as you type
5. Click the "×" button next to a prompt to delete it

### Using Prompts in ChatGPT

1. Navigate to [ChatGPT](https://chatgpt.com/)
2. Look for a toggle button on the right side of your screen (about one-third down from the top)
3. Click the toggle button to open the prompt sidebar
4. Click the "Prompts" button in the sidebar to open a modal with your saved prompts
5. Select a prompt from the list to set it as your active prompt
6. The button will change to show the selected prompt
7. Click the "↑" button that appears next to your selected prompt to insert it into the ChatGPT textarea
8. You can hide the sidebar by clicking the toggle button again
9. To clear your selection, choose "No prompt" from the modal

## Screenshots

The extension includes:
- A popup interface for managing prompts
- A "Prompts" button integrated into the ChatGPT interface
- A modal dialog for selecting prompts
- An insert button for adding the selected prompt to your conversation

## Project Structure

- `manifest.json`: Extension configuration
- `popup.html` & `popup.js`: The prompt manager interface
- `content.js`: Injects the prompt functionality into ChatGPT
- `content.css`: Styles for the injected UI elements

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## License

This project is available as open source under the terms of the MIT License.

## Privacy

GPTMorePrompt stores all your prompts locally in your browser's localStorage. No data is sent to any external servers.

## Compatibility

Currently works with:
- ChatGPT (chatgpt.com)

---

This extension is not affiliated with or endorsed by OpenAI. 