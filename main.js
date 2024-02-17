const _ = (id) => document.getElementById(id);


window.onload = () => {

    navigator.mediaDevices.getUserMedia({video: { width: { ideal: 640 }, height: { ideal: 480 }}})
        .then((stream) => {
            _("webcam").srcObject = stream;
        })
        .catch((error) => {
            console.error("Error accessing the webcam", error);
        });
}


const capture = () => {

    _("capture").disabled = true;
    _("webcam").style.display = "none";
    _("canvas").style.display = "";

    const canvas = _("canvas");
    const context = canvas.getContext("2d");

    // Assuming the video feed is larger than 480x480, center and crop
    const startX = (_("webcam").videoWidth - 480) / 2;
    const startY = (_("webcam").videoHeight - 480) / 2;

    // Clear the canvas before drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the 480x480 centered part of the video onto the canvas
    context.drawImage(_("webcam"), startX, startY, 480, 480, 0, 0, canvas.width, canvas.height);

    send();
};

_("capture").addEventListener("click", capture);
window.addEventListener("keypress", e => e.code === "Space" && capture());

const send = () => {

    const canvas = _("canvas");
    const photo = canvas.toDataURL("image/png");

    fetch("upload.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: photo }),
    })
    .then(response => response.json())
    .then(result => {
        renderTable(result);
        restoreWebcam();
    })
    .catch((error) => {
        console.error("Error:", error);
        restoreWebcam();
    });
};

const restoreWebcam = () => {
    _("webcam").style.display = "";
    _("canvas").style.display = "none";
    _("capture").disabled = false;
}


const renderTable = (data) => {

    const sortedArray = Object.entries(data).sort((a, b) => b[1] - a[1]);

    _("results").innerText = null;

    sortedArray.forEach(([key, value], i) => {
        const tr = document.createElement("tr");

        if (i === 0) tr.classList.add("table-success");

        const td1 = document.createElement("td");
        const td2 = document.createElement("td");

        td1.innerText = key;
        td2.innerText = value + "%";

        tr.appendChild(td1);
        tr.appendChild(td2);
        _("results").appendChild(tr);
    });
}

