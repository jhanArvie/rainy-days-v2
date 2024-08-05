// called my nav>ul
const menu = document.querySelector("#menu");
// called my 3dots menu button
const menuButton = document.querySelector(".menu-button");

// function to add an "open" class to #menu when .menu-button is clicked
menuButton.addEventListener("click", function() {
    menu.classList.toggle("open");
});