/**
 * GithubCopylot - content.js
 * Injects exactly two "Copy" buttons per Copilot review block:
 * 1. Top: Next to "View reviewed changes"
 * 2. Bottom: Next to the last "Resolve conversation"
 */

function injectCopylotButtons() {
  // Find all review containers authored by Copilot
  const reviews = document.querySelectorAll('.js-comment[id^="pullrequestreview-"]');

  reviews.forEach(review => {
    const author = review.querySelector('.author');
    if (!author || author.textContent.trim() !== 'Copilot') return;

    // --- 1. Top Button ---
    const headerActions = review.querySelector('.TimelineItem-body div.flex-shrink-0');
    if (headerActions && !headerActions.dataset.copylotInjected) {
      headerActions.dataset.copylotInjected = "true";
      const topBtn = createButton('📋 Copy Review', 'small');
      // Insert BEFORE the "View reviewed changes" link
      const viewChangesLink = headerActions.querySelector('a');
      if (viewChangesLink) {
        topBtn.style.marginRight = '8px';
        headerActions.insertBefore(topBtn, viewChangesLink);
      } else {
        headerActions.appendChild(topBtn);
      }
      topBtn.addEventListener('click', () => copyFullReview(review, topBtn));
    }

    // --- 2. Bottom Button ---
    const threads = review.querySelectorAll('.review-thread-component');
    if (threads.length > 0) {
      const lastThread = threads[threads.length - 1];
      const bottomActions = lastThread.querySelector('.js-resolvable-timeline-thread-form .d-flex');

      if (bottomActions && !bottomActions.dataset.copylotInjected) {
        bottomActions.dataset.copylotInjected = "true";
        const bottomBtn = createButton('📋 Copy Review', 'medium');
        bottomBtn.style.marginLeft = '8px';
        bottomActions.appendChild(bottomBtn);
        bottomBtn.addEventListener('click', (e) => {
          e.preventDefault();
          copyFullReview(review, bottomBtn);
        });
      }
    }
  });
}

function createButton(text, size) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.innerText = text;

  const padding = size === 'small' ? '3px 10px' : '5px 12px';
  const fontSize = size === 'small' ? '12px' : '13px';

  btn.style.cssText = `
        padding: ${padding};
        background-color: #238636;
        color: white;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 6px;
        font-weight: 600;
        font-size: ${fontSize};
        cursor: pointer;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
    `;

  btn.onmouseover = () => btn.style.backgroundColor = '#2ea043';
  btn.onmouseout = () => btn.style.backgroundColor = '#238636';

  return btn;
}

async function copyFullReview(reviewElement, btn) {
  let finalMarkdown = "# Copilot Review Summary\n\n";

  // 1. Extract Overview (if present in the review)
  const overview = reviewElement.querySelector('.markdown-body');
  if (overview) {
    finalMarkdown += convertDOMToMarkdown(overview);
    finalMarkdown += "\n---\n\n";
  }

  // 2. Extract All Threads in this specific review
  const threads = reviewElement.querySelectorAll('.review-thread-component');
  threads.forEach(thread => {
    const threadMd = getThreadMarkdown(thread);
    if (threadMd) {
      finalMarkdown += threadMd + "---\n\n";
    }
  });

  finalMarkdown = finalMarkdown.replace(/\n{3,}/g, '\n\n').trim();

  try {
    await navigator.clipboard.writeText(finalMarkdown);
    const originalText = btn.innerText;
    btn.innerText = '✅ Copied!';
    setTimeout(() => btn.innerText = originalText, 2000);
  } catch (err) {
    console.error(err);
    alert('Failed to copy. Check clipboard permissions.');
  }
}

function getThreadMarkdown(thread) {
  // File Name
  const fileLink = thread.querySelector('.text-mono');
  const fileName = fileLink ? fileLink.textContent.trim() : "Unknown File";

  // Line Numbers
  const lineStart = thread.querySelector('.js-multi-line-preview-start');
  const lineEnd = thread.querySelector('.js-multi-line-preview-end');
  let lineRef = "";
  if (lineStart && lineEnd) {
    lineRef = `Lines ${lineStart.textContent.trim()} to ${lineEnd.textContent.trim()}`;
  } else {
    const fallbackLines = Array.from(thread.querySelectorAll('[data-line-number]'));
    if (fallbackLines.length > 0) {
      const start = fallbackLines[0].getAttribute('data-line-number');
      const end = fallbackLines[fallbackLines.length - 1].getAttribute('data-line-number');
      lineRef = start === end ? `Line ${start}` : `Lines ${start} to ${end}`;
    }
  }

  // Code Snippet
  const codeRows = thread.querySelectorAll('.blob-code-inner');
  let codeSnippet = "";
  codeRows.forEach(row => {
    codeSnippet += row.textContent + "\n";
  });

  // NEW: Extract Suggested Changeset (Diff)
  let suggestionSnippet = "";
  const suggestionBox = thread.querySelector('[data-testid="automated-review-suggestion"]');
  if (suggestionBox) {
    const diffRows = suggestionBox.querySelectorAll('tr');
    diffRows.forEach(row => {
      const marker = row.querySelector('.UnifiedDiffLines-module__diffTextMarker__qbJh2');
      const content = row.querySelector('.UnifiedDiffLines-module__diffTextInner__TZB4f');
      if (content) {
        const symbol = marker ? marker.textContent.trim() : " ";
        suggestionSnippet += symbol + content.textContent + "\n";
      }
    });
  }

  // Copilot Comment from JSON
  let copilotMarkdown = "";
  const jsonScripts = thread.querySelectorAll('script[type="application/json"]');
  for (const script of jsonScripts) {
    try {
      const data = JSON.parse(script.textContent);
      if (data?.props?.comment?.author?.login === "Copilot") {
        copilotMarkdown = data.props.comment.body;
        break;
      }
    } catch (e) { }
  }

  if (!copilotMarkdown) return null;

  let res = `### File: \`${fileName}\` (${lineRef})\n\n`;
  if (codeSnippet.trim()) {
    res += `**Code Reference:**\n\`\`\`yaml\n${codeSnippet.replace(/\n+$/, '')}\n\`\`\`\n\n`;
  }

  if (suggestionSnippet.trim()) {
    res += `**Suggested Change:**\n\`\`\`diff\n${suggestionSnippet.replace(/\n+$/, '')}\n\`\`\`\n\n`;
  }

  res += `**Copilot Comment:**\n${copilotMarkdown}\n\n`;
  return res;
}


function convertDOMToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent;
  if (node.nodeType === Node.ELEMENT_NODE) {
    const tag = node.tagName.toLowerCase();
    if (['script', 'button', 'svg', 'hr', 'react-partial'].includes(tag)) return "";

    let innerText = Array.from(node.childNodes).map(convertDOMToMarkdown).join('');

    switch (tag) {
      case 'h2': return `## ${innerText.trim()}\n\n`;
      case 'h3': return `### ${innerText.trim()}\n\n`;
      case 'p': return `${innerText.trim()}\n\n`;
      case 'strong': case 'b': return `**${innerText}**`;
      case 'code': return `\`${innerText}\``;
      case 'ul': return `${innerText}\n`;
      case 'li': return `- ${innerText.trim()}\n`;
      case 'a': return `[${innerText}](${node.href || ''})`;
      default: return innerText;
    }
  }
  return "";
}

// Watch for dynamic PR updates
const observer = new MutationObserver(() => injectCopylotButtons());
observer.observe(document.body, { childList: true, subtree: true });
injectCopylotButtons();
