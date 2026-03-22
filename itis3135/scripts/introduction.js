/**
 * introduction.js
 * Core form logic: dynamic courses, validation, clear button, reset behavior,
 * submit handler tracking exact DOM tree constraints, and image file uploads.
 */

(function () {
    "use strict";

    const form = document.getElementById("intro-form");
    const mainContent = document.querySelector("main");
    const coursesContainer = document.getElementById("courses-container");
    const addCourseBtn = document.getElementById("add-course-btn");
    const deleteCourseBtn = document.getElementById("delete-course-btn");
    const clearBtn = document.getElementById("clear-btn");
    const output = document.getElementById("output");
    const imageFileInput = document.getElementById("image-file");

    let courseCount = document.querySelectorAll(".course-entry").length;
    let imageDataUrl = "";

    // Save original nodes of main so we can restore them
    let originalMainNodes = [];

    // Save initial state for reset (restores default 4 courses)
    const initialCoursesHTML = coursesContainer.innerHTML;

    // ── Image Upload ─────────────────────────────────────────────────

    if (imageFileInput) {
        imageFileInput.addEventListener("change", function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    imageDataUrl = event.target.result;
                };
                reader.readAsDataURL(file);
            } else {
                imageDataUrl = "";
            }
        });
    }

    // ── Dynamic Courses ──────────────────────────────────────────────

    addCourseBtn.addEventListener("click", function () {
        courseCount++;
        const entry = document.createElement("div");
        entry.className = "course-entry";
        entry.setAttribute("data-index", courseCount);
        entry.innerHTML =
            '<div>' +
                '<label>Dept</label>' +
                '<input type="text" name="courseDept' + courseCount + '" placeholder="e.g. ITIS" required>' +
            '</div>' +
            '<div>' +
                '<label>Number</label>' +
                '<input type="text" name="courseNum' + courseCount + '" placeholder="e.g. 3135" required>' +
            '</div>' +
            '<div>' +
                '<label>Name</label>' +
                '<input type="text" name="courseName' + courseCount + '" placeholder="Course name (optional)">' +
            '</div>' +
            '<div>' +
                '<label>Reason</label>' +
                '<input type="text" name="courseReason' + courseCount + '" placeholder="Why you\'re taking it" required>' +
            '</div>';
        coursesContainer.appendChild(entry);
    });

    deleteCourseBtn.addEventListener("click", function () {
        const entries = coursesContainer.querySelectorAll(".course-entry");
        if (entries.length > 1) {
            entries[entries.length - 1].remove();
            courseCount = coursesContainer.querySelectorAll(".course-entry").length;
        }
    });

    // ── Clear & Reset ────────────────────────────────────────────────

    clearBtn.addEventListener("click", function () {
        const inputs = form.querySelectorAll("input[type='text'], input[type='url'], input[type='date'], textarea");
        inputs.forEach(function (input) {
            input.value = "";
        });
        if (imageFileInput) imageFileInput.value = "";
        imageDataUrl = "";
    });

    form.addEventListener("reset", function () {
        // Native reset clears fields that existed on load, but we also must 
        // clear dynamic courses and the uploaded File data structure.
        setTimeout(function () {
            coursesContainer.innerHTML = initialCoursesHTML;
            courseCount = coursesContainer.querySelectorAll(".course-entry").length;
            imageDataUrl = "";
        }, 0);
    });

    // ── Collect Form Data ────────────────────────────────────────────

    function collectFormData() {
        const data = {
            firstName: form.firstName ? form.firstName.value.trim() : "",
            middleName: form.middleName ? form.middleName.value.trim() : "",
            lastName: form.lastName ? form.lastName.value.trim() : "",
            nickname: form.nickname ? form.nickname.value.trim() : "",
            acknowledgeStatement: form.acknowledgeStatement ? form.acknowledgeStatement.value.trim() : "",
            acknowledgeDate: form.acknowledgeDate ? form.acknowledgeDate.value : "",
            mascotAdjective: form.mascotAdjective ? form.mascotAdjective.value.trim() : "",
            mascotAnimal: form.mascotAnimal ? form.mascotAnimal.value.trim() : "",
            imageUrl: imageDataUrl, // using file reader data
            imageAlt: form.imageAlt ? form.imageAlt.value.trim() : "",
            imageCaption: form.imageCaption ? form.imageCaption.value.trim() : "",
            personalStatement: form.personalStatement ? form.personalStatement.value.trim() : "",
            bullets: [
                { title: form.bullet1Title.value.trim(), text: form.bullet1Text.value.trim() },
                { title: form.bullet2Title.value.trim(), text: form.bullet2Text.value.trim() },
                { title: form.bullet3Title.value.trim(), text: form.bullet3Text.value.trim() },
                { title: form.bullet4Title.value.trim(), text: form.bullet4Text.value.trim() }
            ],
            optionalBullets: [
                { title: form.bullet6Title ? form.bullet6Title.value.trim() : "", text: form.bullet6Text ? form.bullet6Text.value.trim() : "" },
                { title: form.bullet7Title ? form.bullet7Title.value.trim() : "", text: form.bullet7Text ? form.bullet7Text.value.trim() : "" }
            ].filter(b => b.text !== ""), // ensure optional ones only included if they have text
            coursesTitle: form.coursesTitle ? form.coursesTitle.value.trim() : "",
            courses: [],
            quoteText: form.quoteText ? form.quoteText.value.trim() : "",
            quoteAuthor: form.quoteAuthor ? form.quoteAuthor.value.trim() : "",
            links: {
                github: form.linkGithub ? form.linkGithub.value.trim() : "",
                charlotte: form.linkCharlotte ? form.linkCharlotte.value.trim() : "",
                ghPages: form.linkGhPages ? form.linkGhPages.value.trim() : "",
                freeCodeCamp: form.linkFreeCodeCamp ? form.linkFreeCodeCamp.value.trim() : "",
                linkedin: form.linkLinkedin ? form.linkLinkedin.value.trim() : ""
            }
        };

        const entries = coursesContainer.querySelectorAll(".course-entry");
        entries.forEach(function (entry) {
            const idx = entry.getAttribute("data-index");
            data.courses.push({
                dept: form.elements["courseDept" + idx].value.trim(),
                number: form.elements["courseNum" + idx].value.trim(),
                name: form.elements["courseName" + idx].value.trim(),
                reason: form.elements["courseReason" + idx].value.trim()
            });
        });

        return data;
    }

    // ── Build Intro HTML ─────────────────────────────────────────────

    function buildIntroHTML(data) {
        let html = "";

        // H2 Rule: Should strictly output <h2>Introduction Form</h2>
        html += '        <h2>Introduction Form</h2>\n';
        html += '        <figure>\n';
        html += '            <img src="' + escapeHTML(data.imageUrl) + '" alt="' + escapeHTML(data.imageAlt) + '">\n';
        html += '            <figcaption>' + escapeHTML(data.imageCaption) + '</figcaption>\n';
        html += '        </figure>\n';
        html += '        <p>' + escapeHTML(data.personalStatement) + '</p>\n';
        html += '        <ul>\n';

        // Bullets 1-4
        data.bullets.forEach(function (b) {
            html += '            <li><strong>' + escapeHTML(b.title) + '</strong> ' + escapeHTML(b.text) + '</li>\n';
        });

        // Bullet 5: Courses
        html += '            <li><strong>' + escapeHTML(data.coursesTitle) + '</strong>\n';
        html += '                <ol>\n';

        data.courses.forEach(function (c) {
            const label = c.dept + ' ' + c.number + ':';
            html += '                    <li><strong>' + escapeHTML(label) + '</strong> ' + escapeHTML(c.reason) + '</li>\n';
        });

        html += '                </ol>\n';
        html += '            </li>\n';

        // Bullets 6-7: Optional fields rendered at the bottom of the list
        data.optionalBullets.forEach(function (b) {
            html += '            <li><strong>' + escapeHTML(b.title) + '</strong> ' + escapeHTML(b.text) + '</li>\n';
        });

        html += '        </ul>\n';
        html += '        <blockquote>\n';
        html += '            "' + escapeHTML(data.quoteText) + '"\n';
        html += '            <cite>— ' + escapeHTML(data.quoteAuthor) + '</cite>\n';
        html += '        </blockquote>\n';
        
        // Add 5 links in a <ul> at the bottom as specified
        html += '        <ul class="intro-links">\n';
        html += '            <li><a href="' + escapeHTML(data.links.github) + '" target="_blank">GitHub</a></li>\n';
        html += '            <li><a href="' + escapeHTML(data.links.charlotte) + '" target="_blank">Charlotte Web</a></li>\n';
        html += '            <li><a href="' + escapeHTML(data.links.ghPages) + '" target="_blank">GitHub Pages</a></li>\n';
        html += '            <li><a href="' + escapeHTML(data.links.freeCodeCamp) + '" target="_blank">freeCodeCamp</a></li>\n';
        html += '            <li><a href="' + escapeHTML(data.links.linkedin) + '" target="_blank">LinkedIn</a></li>\n';
        html += '        </ul>\n';

        return html;
    }

    function escapeHTML(str) {
        if (!str) return "";
        var div = document.createElement("div");
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // ── Submit Handler ───────────────────────────────────────────────

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Validate required fields
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        if (!imageDataUrl) {
            alert("Please select an image file to upload before submitting.");
            return;
        }

        var data = collectFormData();
        var introHTML = buildIntroHTML(data);

        // a) Save the original content of <main>.
        if (originalMainNodes.length === 0) {
            originalMainNodes = Array.from(mainContent.childNodes);
        }
        
        // b) Clear <main> entirely.
        mainContent.replaceChildren();

        // c) Inject the new <h2>, <figure>, <p>, <ul>, and <blockquote> directly into <main>.
        // To perfectly match exact DOM output logic, inject the intro direct child nodes into `<main>`.
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = introHTML;
        window.__injectedNodes = Array.from(tempDiv.childNodes);
        window.__injectedNodes.forEach(node => mainContent.appendChild(node));

        // Let output start empty with output-buttons for the generator scripts
        // d) Append the output-buttons container after the <main> element (via #output which is after main)
        output.innerHTML = '<div id="output-buttons"></div>';

        // Store data globally so generate_html / generate_json can use it
        window.__introData = data;
        window.__introHTML = introHTML;
        
        // Add a hidden reference to the original main content to allow restoring it later
        window.__originalMainNodes = originalMainNodes;

        // Dispatch custom event so other scripts can add their buttons
        document.dispatchEvent(new CustomEvent("introSubmitted"));
    });

    // ── Shared Button Management ───────────────────────────────────

    window.__outputButtonFactories = window.__outputButtonFactories || [];

    window.attachOutputButtons = function () {
        var buttonsDiv = document.getElementById("output-buttons");
        if (!buttonsDiv) return;
        buttonsDiv.innerHTML = "";

        // Determine if we're currently in a code view (HTML or JSON) vs rendered intro view.
        // The generator scripts overwrite `#output` entirely setting a `<pre>` tag.
        const isCodeView = output.querySelector("pre") !== null;

        if (isCodeView) {
            // Hide the injected inner elements from <main> while showing the `<pre>` code.
            if (window.__injectedNodes) {
                window.__injectedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) node.style.display = "none";
                });
            }
        } else {
            // Restore visibility of injected inner elements in <main>.
            if (window.__injectedNodes) {
                window.__injectedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) node.style.display = "";
                });
            }
        }

        // "Show Introduction" button to return to rendered view
        var showBtn = document.createElement("button");
        showBtn.textContent = "Show Form";
        showBtn.className = "btn-primary";
        showBtn.addEventListener("click", function () {
            // Restore original main elements
            mainContent.replaceChildren(...originalMainNodes);
            output.innerHTML = '';
        });
        buttonsDiv.appendChild(showBtn);

        // Append buttons from generate_html.js, generate_json.js, etc.
        window.__outputButtonFactories.forEach(function (factory) {
            buttonsDiv.appendChild(factory());
        });
    };

    // Expose helpers globally
    window.buildIntroHTML = buildIntroHTML;
    window.escapeHTML = escapeHTML;
    window.collectFormData = collectFormData;
})();
