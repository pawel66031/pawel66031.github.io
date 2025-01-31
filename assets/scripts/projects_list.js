const project_section = document.getElementsByClassName("portfolio-projects-group")[0];

function parseJsonProject(json) {
    // console.log(json);
    console.log(json.projects);

    var graphic_design = []
    var programming = []
    var projectList = []

    var projects = [[], [], []]
    var groupProjectName = ["Graphic design", "Programming", "Procedural"]

    // json.projects
    // for (var i = 0; i < json.projects.length; ++i) {

    // Initialize 
    for (var i = 0; i < json.projects.length; ++i) {
        const currentProject = json.projects[i];

        projects[currentProject.type].push(currentProject)
    }

    console.log("Projects to read: ")
    console.log(projects)

    for (var i = 0; i < projects.length; ++i) {

        console.log("Projects[" + i + "] -> " + projects[i].length)
        // Skip if project from given category does not exist
        if (projects[i].length == 0) continue

        const darker_background = project_section.appendChild(document.createElement("div"))
        darker_background.style = "background-color: #00000040;"


        const portfolio_container = darker_background.appendChild(document.createElement("div"))
        portfolio_container.className = "portfolio-container"

        const groupTitle = portfolio_container.appendChild(document.createElement("div"))
        groupTitle.className = "portfolio-projects-group-name"
        groupTitle.innerText = groupProjectName[i]

        for (var j = 0; j < projects[i].length; ++j) {
            console.log("Loop number: " + j)

            const currentProject = projects[i][j]

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

            if (currentProject.project_background.size != "") {
                elementStyle += "background-size: " + currentProject.project_background.size + ";";
            }

            if (currentProject.project_background.repeat != "") {
                elementStyle += "background-repeat: " + currentProject.project_background.repeat + ";";
            }

            if (currentProject.project_background.position_x != "") {
                elementStyle += "background-position-x: " + currentProject.project_background.position_x + ";";
            }

            if (currentProject.project_background.bgColor != "") {
                elementStyle += "background-color: " + currentProject.project_background.bgColor + ";";
            }

            elementStyle += "background-position-y: " + currentProject.project_background.position_y + ";";

            divPage.style = elementStyle;
        }
    }
    console.log(projects);
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