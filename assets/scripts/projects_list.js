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

    for (var i = 0; i < projects.length; ++i) {

        // console.log("Projects[" + i + "] -> " + projects[i].length)
        // Skip if project from given category does not exist
        if (projects[i].length == 0) continue

        const darker_background = project_section.appendChild(document.createElement("div"))
        darker_background.style = "background-color: #00000040;"


        const portfolio_container = darker_background.appendChild(document.createElement("div"))
        portfolio_container.className = "portfolio-container"

        const groupTitle = portfolio_container.appendChild(document.createElement("div"))
        groupTitle.className = "portfolio-projects-group-name"
        groupTitle.innerText = groupProjectName[i]

        const ulGroupPage = project_section.appendChild(document.createElement("ul"));
        ulGroupPage.className = "projects-group portfolio-container"
        // for (var j = 0; j < projects[i].length; ++j) {
        //     console.log("Loop number: " + j)

        //     const currentProject = projects[i][j]

        //     const divPage = project_section.appendChild(document.createElement("div"));
        //     divPage.className = "project-item"

        //     // Additional div for defining margin
        //     const marginDiv = divPage.appendChild(document.createElement("div"))
        //     marginDiv.className = "portfolio-container portfolio-project-list";

        //     // Section for basic info (date and title)
        //     const projectInfo = marginDiv.appendChild(document.createElement("div"));
        //     projectInfo.className = "project-short-info";


        //     // Add date info
        //     const projectDate = projectInfo.appendChild(document.createElement("div"));
        //     projectDate.className = "project-date";
        //     projectDate.innerHTML = currentProject.date;

        //     // Add project title
        //     const projectName = projectInfo.appendChild(document.createElement("h3"));
        //     projectName.innerHTML = currentProject.name;


        //     // Assign background image
        //     var elementStyle = "";
        //     elementStyle += "background-image: url(" + currentProject.project_background.url + ");";

        //     if (currentProject.project_background.size != "") {
        //         elementStyle += "background-size: " + currentProject.project_background.size + ";";
        //     }

        //     if (currentProject.project_background.repeat != "") {
        //         elementStyle += "background-repeat: " + currentProject.project_background.repeat + ";";
        //     }

        //     if (currentProject.project_background.position_x != "") {
        //         elementStyle += "background-position-x: " + currentProject.project_background.position_x + ";";
        //     }

        //     if (currentProject.project_background.bgColor != "") {
        //         elementStyle += "background-color: " + currentProject.project_background.bgColor + ";";
        //     }

        //     elementStyle += "background-position-y: " + currentProject.project_background.position_y + ";";

        //     divPage.style = elementStyle;
        // }


        for (var j = 0; j < projects[i].length; ++j) {
            const currentProject = projects[i][j]


            const classItem = ulGroupPage.appendChild(document.createElement("li"));
            classItem.className = "project-item"

            // Add padding to correct height

            const marginDiv = classItem.appendChild(document.createElement("div"))
            marginDiv.className = "project-window-padding";

            // Section for basic info (date and title)

            var projectInfo;

            if (currentProject.hasOwnProperty("url_code")) {
                const clickableWindow = marginDiv.appendChild(document.createElement("a"));
                clickableWindow.href = "/portfolio/" + currentProject.url_code;


                projectInfo = clickableWindow.appendChild(document.createElement("div"));
            }
            else {
                projectInfo = marginDiv.appendChild(document.createElement("div"));
            }


            // const projectInfo = marginDiv.appendChild(document.createElement("div"));
            projectInfo.className = "portfolio-project-list color-4";

            // Add thumbnail
            const projectThumbnail = projectInfo.appendChild(document.createElement("div"));
            projectThumbnail.className = "project-thumbnail";

            // Image
            const imgProject = projectThumbnail.appendChild(document.createElement("img"));
            imgProject.src = currentProject.project_background.url

            // #####  Window about project #####

            // Add project title
            const projectName = projectInfo.appendChild(document.createElement("h3"));
            projectName.innerHTML = currentProject.name;

            // Add short description
            const projectDescription = projectInfo.appendChild(document.createElement("p"));
            projectDescription.innerHTML = currentProject.description;

            // Add tag
            const projectTags = projectInfo.appendChild(document.createElement("div"))
            projectTags.className = "project-tags";

            // if (currentProject.tags != "") {
            if (currentProject.hasOwnProperty("tags")) {
                const tags = currentProject.tags.split(";")

                for (var t = 0; t < tags.length; ++t) {
                    const tag = projectTags.appendChild(document.createElement("div"));
                    tag.innerHTML = tags[t];
                }
            }

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

        }
    }
    // console.log(projects);
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