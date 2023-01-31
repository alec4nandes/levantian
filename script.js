initialize();

function initialize() {
    const container = document.querySelector("#snap-container");
    moveScrollGraphic(container);
    container.onscroll = (e) => moveScrollGraphic(e.target);
    let timeout;
    window.onresize = () => {
        clearTimeout(timeout);
        setTimeout(() => {
            moveScrollGraphic(container);
        }, 100);
    };
}

function moveScrollGraphic(container) {
    const {
            offsetHeight: screenHeight,
            offsetWidth: screenWidth,
            scrollTop,
        } = container,
        scrollGraphic = document.querySelector("#scroll-graphic"),
        { height, width, marginLeft } = window.getComputedStyle(scrollGraphic),
        [graphicHeight, graphicMargin] = [height, marginLeft].map((str) =>
            parsePixels(str)
        ),
        graphicWidth = parsePixels(width) + 2 * graphicMargin,
        maxWidthPercent = 100 - (graphicWidth / screenWidth) * 100,
        percentScreenScrolled = (scrollTop / screenHeight) * 100,
        verticalCenter = `${(screenHeight - graphicHeight) / 2}px`;

    if (screenWidth > 700) {
        const slowLeftWide = percentScreenScrolled / 1.75;
        scrollGraphic.style.left = `${
            slowLeftWide < maxWidthPercent ? slowLeftWide : maxWidthPercent
        }%`;
        scrollGraphic.style.top = verticalCenter;
    } else {
        const navHeight = 80,
            maxLeftPercent = (100 - (graphicWidth / screenWidth) * 100) / 2,
            headerBreakpoint = screenHeight / 2 + graphicWidth / 2 + navHeight,
            isPastHeader = Math.ceil(scrollTop) >= headerBreakpoint,
            slowLeftNarrow = percentScreenScrolled / 2.75;
        scrollGraphic.style.left = `${
            slowLeftNarrow < maxLeftPercent ? slowLeftNarrow : maxLeftPercent
        }%`;
        scrollGraphic.style.top = isPastHeader
            ? `${graphicMargin - (scrollTop - screenHeight) + navHeight}px`
            : verticalCenter;
        console.log(isPastHeader);
    }

    displayNav(scrollTop, screenHeight);
}

function parsePixels(str) {
    return +str.replace("px", "");
}

function displayNav(scrollTop, screenHeight) {
    const nav = document.querySelector("nav"),
        navButtons = nav.querySelectorAll("button");
    nav.style.visibility =
        Math.ceil(scrollTop) >= screenHeight ? "visible" : "hidden";
    navButtons.forEach((button) => button.classList.remove("open"));
    isPastSection("footer", scrollTop)
        ? addOpenClassToButton("#nav-contact")
        : isPastSection("main", scrollTop) &&
          addOpenClassToButton("#nav-about");
}

function isPastSection(tag, scrollTop) {
    return Math.ceil(scrollTop) > document.querySelector(tag).offsetTop - 100;
}

function addOpenClassToButton(id) {
    document.querySelector(id).classList.add("open");
}
