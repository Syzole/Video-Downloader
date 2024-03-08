function convert() {
    var url = document.getElementById("url").value;

    if(url == "") {
        alert("Please enter a valid URL");
        return;
    }

    //disable all mouse and keyboard events until the conversion is complete
    document.getElementById("url").disabled = true;
    document.getElementById("convert").disabled = true;


    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/convertToMp3", false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify({ url: url }));
    var response = JSON.parse(xhr.responseText);
    if (response.success) {
        alert("Conversion complete, check download folder for the file");
    } else {
        alert("Conversion failed");
    }

    //enable all mouse and keyboard events and clear the input field
    document.getElementById("url").disabled = false;
    document.getElementById("convert").disabled = false;
    document.getElementById("url").value = "";
    init();
}

function init(){
    let xhr = new XMLHttpRequest();
    //get all the files in the download/mp3 folder and display it
    xhr.open("GET", "/getMp3Files", false);
    xhr.send();
    let response = JSON.parse(xhr.responseText);
    let files = response.files;

    let list = document.getElementById("files");

    if(files.length == 0) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode("No files available"));
        list.appendChild(li);
        return;
    }

    list.innerHTML = "";
    for (let i = 0; i < files.length; i++) {
        let li = document.createElement("li");
        li.appendChild(document.createTextNode(files[i]));
        list.appendChild(li);
    }
}