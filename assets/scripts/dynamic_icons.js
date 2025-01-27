const languagesWindow = document.getElementsByClassName("portfolio-technology-table")[0]

console.log(languagesWindow)

// Remove child elements right now for easier implementing
// languagesWindow.innerHTML = ""

// Parse JSON file about programming icons
function parseJsonProject(json) {

    const jsonSize = json.languages.length;
    const oneElementPercent = 100 / (jsonSize - 1)

    for (var i = 0; i < jsonSize; ++i) {
        const currentProject = json.languages[i];

        const divPage = languagesWindow.appendChild(document.createElement("div"));
        divPage.className = "skills-content-logo-background"

        // Additional div for defining margin
        const logoDiv = divPage.appendChild(document.createElement("div"))
        logoDiv.className = "skills-content-logo";

        var text = "background-color:" + currentProject.bg_color + ";"
        text += "z-index: " + (jsonSize - i) + ";"

        // text += "left: calc(" + (oneElementPercent * i) + "% - " + (((i / (jsonSize - 1)) * (102)) + 8) + "px);"
        text += "left: calc(" + (oneElementPercent * i) + "% - " + (((i / (jsonSize - 1)) * (102 + 16)) - 8) + "px);"

        logoDiv.style = text

        // 102px + 8px



        const iconImg = logoDiv.appendChild(document.createElement("img"))
        iconImg.src = currentProject.icon_url;
        iconImg.alt = currentProject.alt;
    }
}

fetch('/assets/projects/programming_languages.json')
    .then((response) => response.json())
    .then((json) => parseJsonProject(json));