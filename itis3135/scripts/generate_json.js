/**
 * generate_json.js
 * Adds a "Generate JSON" button after form submission.
 * Displays the form data as formatted JSON.
 */

(function () {
    "use strict";

    function createJSONButton() {
        var btn = document.createElement("button");
        btn.textContent = "Generate JSON";
        btn.className = "btn-secondary";
        btn.id = "generate-json-btn";

        btn.addEventListener("click", function () {
            var output = document.getElementById("output");
            var data = window.__introData;

            var jsonStr = JSON.stringify(data, null, 2);

            // Escape for display inside <code>
            var escaped = jsonStr
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;");

            output.innerHTML =
                '<h2>Introduction JSON</h2>' +
                '<div id="output-buttons"></div>' +
                '<pre><code class="language-json">' + escaped + '</code></pre>';

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
    window.__outputButtonFactories.push(createJSONButton);

    // Listen for initial submit
    document.addEventListener("introSubmitted", function () {
        window.attachOutputButtons();
    });
})();
