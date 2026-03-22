/**
 * generate_html.js
 * Adds a "Generate HTML" button after form submission.
 * Displays the raw HTML source with Highlight.js syntax highlighting.
 */

(function () {
    "use strict";

    function createHTMLButton() {
        var btn = document.createElement("button");
        btn.textContent = "Generate HTML";
        btn.className = "btn-secondary";
        btn.id = "generate-html-btn";

        btn.addEventListener("click", function () {
            var output = document.getElementById("output");
            var introHTML = window.__introHTML;

            // Build the full page HTML matching the original introduction page structure
            var fullHTML = '<!DOCTYPE html>\n' +
                '<html lang="en">\n' +
                '<head>\n' +
                '    <meta charset="UTF-8">\n' +
                '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n' +
                '    <title>Sean D. Briganti | Introduction</title>\n' +
                '    <link rel="stylesheet" href="styles/default.css">\n' +
                '</head>\n' +
                '<body>\n' +
                '    <div data-include="components/header.html"></div>\n' +
                '    <main>\n' +
                introHTML + '\n' +
                '    </main>\n' +
                '    <div data-include="components/footer.html"></div>\n' +
                '<script src="itis3135/scripts/HTMLInclude.min.js"><\/script>\n' +
                '</body>\n' +
                '</html>';

            // Escape for display inside <code>
            var escaped = fullHTML
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;");

            output.innerHTML =
                '<h2>Introduction HTML</h2>' +
                '<div id="output-buttons"></div>' +
                '<pre><code class="language-html">' + escaped + '</code></pre>';

            // Re-attach all output buttons
            window.attachOutputButtons();

            // Highlight
            if (window.hljs) {
                hljs.highlightAll();
            }
        });

        return btn;
    }

    // Register this button factory globally
    window.__outputButtonFactories = window.__outputButtonFactories || [];
    window.__outputButtonFactories.push(createHTMLButton);

    // Listen for initial submit
    document.addEventListener("introSubmitted", function () {
        window.attachOutputButtons();
    });
})();
