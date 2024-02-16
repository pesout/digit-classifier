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


_("capture").addEventListener("click", () => {

    _("capture").disabled = true;

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
});


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

        _("capture").disabled = false;
    })
    .catch((error) => {
        console.error("Error:", error);
        _("capture").disabled = false;
    });
};


const renderTable = (data) => {

    const sortedArray = Object.entries(data).sort((a, b) => b[1] - a[1]);

    const tbody = document.createElement("tbody");

    sortedArray.forEach(([key, value]) => {
        const tr = document.createElement("tr");
        const tdKey = document.createElement("td");
        const tdValue = document.createElement("td");

        tdKey.innerText = key;
        tdValue.innerText = value;

        tr.appendChild(tdKey);
        tr.appendChild(tdValue);
        tbody.appendChild(tr);
    });

    _("results").appendChild(tbody);
}


