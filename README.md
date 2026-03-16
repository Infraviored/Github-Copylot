# 🤖 GithubCopylot

> **Extract Copilot Reviews with Zero Friction.**

Stop waiting for slow email notifications or digging through deep GitHub UI threads. **GithubCopylot** injects a seamless "Copy Review" utility directly into your Pull Request workflow, allowing you to capture entire Copilot review summaries—including code references and automated suggestions—in a single click.

---

## ✨ Features

- **🚀 One-Click Extraction**: Injects "Copy Review" buttons at the top (header) and bottom (footer) of Copilot review blocks.
- **📝 Rich Markdown Support**: Automatically converts GitHub's complex HTML (including tables, headers, and lists) into clean, portable Markdown.
- **🔍 Context Aware**: Captures the PR overview, the code snippets being reviewed, and the specific line numbers.
- **💡 Automated Suggestions**: Full support for extracting "Suggested Changesets" (diffs) proposed by Copilot.
- **⚡ Zero Overhead**: Lightweight content script that stays out of your way until you need it.

---

## 🛠️ Installation (Developer Mode)

Since this is a specialized power-user tool, you can load it directly into your browser:

1.  **Clone** this repository:
    ```bash
    git clone git@github.com:Infraviored/Github-Copylot.git
    ```
2.  Open your browser's **Extension Management** page:
    - **Chrome**: `chrome://extensions/`
    - **Edge**: `edge://extensions/`
    - **Firefox**: `about:debugging#/runtime/this-firefox` (Load Temporary Add-on)
3.  Enable **"Developer mode"** (usually a toggle in the top right).
4.  Click **"Load unpacked"** and select the directory where you cloned this repo.

---

## 📖 Usage

1.  Navigate to any **GitHub Pull Request** reviewed by Copilot.
2.  Look for the green **📋 Copy Review** button:
    - **At the top**: Next to the "View reviewed changes" button in the review header.
    - **At the bottom**: Next to the "Resolve conversation" button on the final review thread.
3.  Click it to copy the entire structured summary to your clipboard.
4.  Paste it into your task tracker, documentation, or local editor.

---

## 📦 Packaging

To create a distributable `.zip` file for sharing:
```bash
./package.sh
```
The output will be located in the `dist/` directory.

---

## 📜 License

MIT © [Infraviored](https://github.com/Infraviored)
