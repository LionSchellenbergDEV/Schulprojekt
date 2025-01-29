
window.addEventListener('scroll', () => {
    const currentScrollPosition = window.scrollY;
    if(currentScrollPosition >= 1) {
        document.getElementById("header").style.marginTop = "0%";
        document.getElementById("header").style.minWidth = "92%";
        document.getElementById("header").style.marginLeft = "0%";
        document.getElementById("header").style.marginRight = "0%";
        document.getElementById("header").style.transitionDuration = "0.5s";

    } else {
        document.getElementById("header").style.marginTop = "2%";
        document.getElementById("header").style.minWidth = "82%";
        document.getElementById("header").style.marginLeft = "4%";
        document.getElementById("header").style.marginRight = "4%";


    }
});