function convert() {
    var url = document.getElementById("url").value;

    if(url == "") {
        alert("Please enter a valid URL");
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/convertToMp3", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ url: url }));
    var response = JSON.parse(xhr.responseText);
    if (response.success) {
        alert("Conversion complete, check download folder for the file");
    } else {
        alert("Conversion failed");
    }
}