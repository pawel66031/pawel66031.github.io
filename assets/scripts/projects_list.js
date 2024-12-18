const project_section = document.getElementsByClassName("portfolio-projects-group")[0];

function parseJsonProject(json) {
    // console.log(json);
    console.log(json.projects);
    // json.projects
    for (var i = 0; i < json.projects.length; ++i) {
        const currentProject = json.projects[i];

        const divPage = project_section.appendChild(document.createElement("div"));
        divPage.className = "project-item"

        // Additional div for defining margin
        const marginDiv = divPage.appendChild(document.createElement("div"))
        marginDiv.className = "portfolio-container portfolio-project-list";

        // Section for basic info (date and title)
        const projectInfo = marginDiv.appendChild(document.createElement("div"));
        projectInfo.className = "project-short-info";


        // Add date info
        const projectDate = projectInfo.appendChild(document.createElement("div"));
        projectDate.className = "project-date";
        projectDate.innerHTML = currentProject.date;

        // Add project title
        const projectName = projectInfo.appendChild(document.createElement("h3"));
        projectName.innerHTML = currentProject.name;


        // Assign background image
        var elementStyle = "";
        elementStyle += "background-image: url(" + currentProject.project_background.url + ");";
        elementStyle += "background-size:cover;";
        elementStyle += "background-position-y:" + currentProject.project_background.position_y + ";";

        divPage.style = elementStyle;
    }
}


// console.debug(project_section);
fetch('/assets/projects/projects_info.json')
    .then((response) => response.json())
    .then((json) => parseJsonProject(json));



/* Types numbers - meaning: 
 * 0 - Graphic Design
 * 1 - Programming
 * 2 - Procedural
 */