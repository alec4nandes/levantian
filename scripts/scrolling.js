initialize();

function initialize() {
    const container = document.querySelector("#home");
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

    // change border color
    scrollGraphic.style.borderColor = getBorderRGB(scrollTop, screenHeight);

    if (screenWidth > 700) {
        const slowLeftWide = percentScreenScrolled / 1.5;
        scrollGraphic.style.left = `${
            slowLeftWide < maxWidthPercent ? slowLeftWide : maxWidthPercent
        }%`;
        scrollGraphic.style.top = verticalCenter;
    } else {
        const navHeight = 120,
            maxLeftPercent = (100 - (graphicWidth / screenWidth) * 100) / 2,
            headerBreakpoint = screenHeight / 2 + graphicWidth / 2 + navHeight,
            isPastHeader = Math.ceil(scrollTop) >= headerBreakpoint,
            slowLeftNarrow = percentScreenScrolled / 2.75 + 2; // plus 2% padding
        scrollGraphic.style.left = `${
            slowLeftNarrow < maxLeftPercent ? slowLeftNarrow : maxLeftPercent
        }%`;
        scrollGraphic.style.top = isPastHeader
            ? `${graphicMargin - (scrollTop - screenHeight) + navHeight}px`
            : verticalCenter;
    }

    displayNav(scrollTop, screenHeight);
}

function parsePixels(str) {
    return +str.replace("px", "");
}

function getBorderRGB(scrollTop, screenHeight) {
    const percentScreenScrolled = scrollTop / screenHeight,
        [r, g, b] = [157, 179, 191].map((minVal) => {
            const maxDiff = 255 - minVal;
            return percentScreenScrolled > 1
                ? minVal
                : 255 - maxDiff * percentScreenScrolled;
        });
    return `rgb(${r}, ${g}, ${b})`;
}

function displayNav(scrollTop, screenHeight) {
    const nav = document.querySelector("nav"),
        navButtons = nav.querySelectorAll("button");
    nav.style.visibility =
        Math.ceil(scrollTop) >= screenHeight * 0.85 ? "visible" : "hidden";
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
