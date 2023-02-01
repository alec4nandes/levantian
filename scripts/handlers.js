function scrollToHome() {
    scrollToHelper("header");
}

function scrollToAbout() {
    scrollToHelper("main");
}

function scrollToContact() {
    scrollToHelper("footer");
}

function scrollToHelper(tag) {
    document.querySelector(tag).scrollIntoView({ behavior: "smooth" });
}
