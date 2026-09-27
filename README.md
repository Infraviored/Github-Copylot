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

1.  **Clone** this repository and build it:
    ```bash
    git clone git@github.com:Infraviored/Github-Copylot.git
    cd Github-Copylot && npm install && npm run build
    ```
2.  Load the build for your browser:
    - **Chrome / Edge**: `chrome://extensions/` (or `edge://extensions/`), enable **Developer mode**, click **Load unpacked** and pick `build/chrome/`.
    - **Firefox**: `about:debugging#/runtime/this-firefox`, **Load Temporary Add-on**, pick `build/firefox/manifest.json`.

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

One source tree builds both browsers:

```
src/                    content script and icons (shared)
manifests/base.json     manifest keys common to both
manifests/firefox.json  Firefox: Manifest V2, Gecko ID
manifests/chrome.json   Chrome: Manifest V3
```

```bash
npm run build          # build/<browser>/ and dist/github-copylot-<browser>-<version>.zip
npm run lint:firefox   # web-ext lint on build/firefox
npm run check:chrome   # loads build/chrome in headless Chromium
```

---

## 📜 License

MIT © [Infraviored](https://github.com/Infraviored)
