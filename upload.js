async function upload() {
    const result = document.getElementById("result");

    const name = document.getElementById("name").value.trim();
    const author = document.getElementById("author").value.trim();
    const category = document.getElementById("category").value.trim();
    const version = document.getElementById("version").value.trim() || "1.0.0";
    const description = document.getElementById("description").value.trim();
    const file = document.getElementById("file").files[0];
    const button = document.querySelector("button");

    result.innerHTML = "";

    if (!name) {
        result.innerHTML = "<p class='error'>❌ Command Name is required.</p>";
        return;
    }

    if (!author) {
        result.innerHTML = "<p class='error'>❌ Author is required.</p>";
        return;
    }

    if (!category) {
        result.innerHTML = "<p class='error'>❌ Category is required.</p>";
        return;
    }

    if (!file) {
        result.innerHTML = "<p class='error'>❌ Please select a .js file.</p>";
        return;
    }

    if (!file.name.endsWith(".js")) {
        result.innerHTML = "<p class='error'>❌ Only .js files are allowed.</p>";
        return;
    }

    button.disabled = true;
    button.innerText = "Uploading...";

    try {
        const rawCode = await file.text();

        const body = {
            name,
            author,
            category,
            version,
            description,
            rawCode,
            isFeatured: false
        };

        const response = await fetch("/api/store/upload", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (response.ok && data.success) {
            result.innerHTML =
                `<p class="success">✅ ${data.message}</p>`;

            document.getElementById("name").value = "";
            document.getElementById("author").value = "";
            document.getElementById("category").value = "";
            document.getElementById("version").value = "1.0.0";
            document.getElementById("description").value = "";
            document.getElementById("file").value = "";
        } else {
            result.innerHTML =
                `<p class="error">❌ ${data.message || "Upload failed."}</p>`;
        }

    } catch (err) {
        console.error(err);

        result.innerHTML =
            `<p class="error">❌ ${err.message}</p>`;
    }

    button.disabled = false;
    button.innerText = "Upload Command";
}
