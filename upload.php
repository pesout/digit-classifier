<?php

ini_set("display_errors", "1");
ini_set("display_startup_errors", "1");
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Extract the base64 encoded image data from the POST request
    $imageData = json_decode(file_get_contents("php://input"), true)["image"];

    // The image data starts with a data URL scheme like "data:image/png;base64," which we need to remove
    list($type, $imageData) = explode(";", $imageData);
    list(, $imageData)      = explode(",", $imageData);
    $imageData = base64_decode($imageData);

    // Save file
    $filename = date("ymd_his") . "_" . rand(10000, 99999) . ".png";
    $savePath = "uploads/" . $filename;
    file_put_contents($savePath, $imageData);

    echo exec("python3 classify.py $filename 2>&1");
}

?>
