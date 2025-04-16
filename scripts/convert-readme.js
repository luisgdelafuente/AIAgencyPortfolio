import fs from 'fs';
import { marked } from 'marked';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure marked for code highlighting
marked.setOptions({
  highlight: function(code, lang) {
    return code;
  }
});

// Read the README.md file
const readmePath = path.join(__dirname, '../README.md');
const readmeContent = fs.readFileSync(readmePath, 'utf8');

// Convert to HTML
const htmlContent = marked.parse(readmeContent);

// Wrap with some basic styling for code blocks
const styledHTML = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1, h2, h3 {
      margin-top: 24px;
      margin-bottom: 16px;
      font-weight: 600;
      line-height: 1.25;
    }
    h1 {
      font-size: 2em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid #eaecef;
    }
    h2 {
      font-size: 1.5em;
      padding-bottom: 0.3em;
      border-bottom: 1px solid #eaecef;
    }
    h3 {
      font-size: 1.25em;
    }
    pre {
      background-color: #f6f8fa;
      border-radius: 3px;
      padding: 16px;
      overflow: auto;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    }
    code {
      padding: 0.2em 0.4em;
      margin: 0;
      font-size: 85%;
      background-color: rgba(27, 31, 35, 0.05);
      border-radius: 3px;
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
    }
    pre code {
      background-color: transparent;
      padding: 0;
    }
    img {
      max-width: 100%;
    }
    .content {
      width: 100%;
    }
  </style>
</head>
<body>
  <div class="content">
    ${htmlContent}
  </div>
</body>
</html>
`;

// Also save just the plain HTML without the styling wrapper
const plainHTML = htmlContent;

// Save the styled HTML version
const styledOutputPath = path.join(__dirname, '../readme-styled.html');
fs.writeFileSync(styledOutputPath, styledHTML);

// Save the plain HTML version (for pasting into the blog editor)
const plainOutputPath = path.join(__dirname, '../readme-plain.html');
fs.writeFileSync(plainOutputPath, plainHTML);

console.log('Conversion completed!');
console.log(`Styled HTML saved to: ${styledOutputPath}`);
console.log(`Plain HTML (for blog editor) saved to: ${plainOutputPath}`);