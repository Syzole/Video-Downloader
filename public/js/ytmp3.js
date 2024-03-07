function convert() {
    var url = document.getElementById("url").value;

    if(url == "") {
        alert("Please enter a valid URL");
        return;
    }

    //disable all mouse and keyboard events until the conversion is complete
    document.getElementById("url").disabled = true;
    document.getElementById("convert").disabled = true;


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

    //enable all mouse and keyboard events
    document.getElementById("url").disabled = false;
    document.getElementById("convert").disabled = false;
}