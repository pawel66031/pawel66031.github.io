const siteHeader = document.getElementsByClassName("site-project-header")[0];
const siteWidth = siteHeader.offsetWidth;


const typeSlices = document.getElementsByClassName("slide-type");
const typeSliceLength = typeSlices.length;
const typeSlicePercentage = 100.0 / typeSliceLength;

const siteDividedWidth = siteWidth / typeSliceLength;

function getWidthByTypeSlices(){
    return typeSlicePercentage;
}

// alert(getWidthByTypeSlices());

var widthSum = 0;

let widthTransform = 0;

for(var i = 0; i < typeSliceLength; ++i){
    // var grayValue = i * typeSlicePercentagel
    // typeSlices[i].style.backgroundColor = "rgb(" + widthSum + "% " + widthSum + "% " + widthSum + "%)";
    typeSlices[i].style.width = typeSlicePercentage + "%";
    typeSlices[i].style.transform = "translate(" + i * 100 + "%, 0px)";
    widthSum += typeSlicePercentage;
    widthTransform += siteDividedWidth;
}