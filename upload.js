async function upload() {

    const file = document.getElementById("file").files[0];

    if (!file) {
        alert("Select JS File");
        return;
    }

    const rawCode = await file.text();

    const body = {
        name: document.getElementById("name").value,
        author: document.getElementById("author").value,
        category: document.getElementById("category").value,
        version: document.getElementById("version").value,
        description: document.getElementById("description").value,
        rawCode,
        isFeatured: false
    };

    const res = await fetch("/api/store/upload", {
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();

    alert(data.message);
}
