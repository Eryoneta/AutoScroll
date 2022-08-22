//AUTOSCROLL
class AutoScroll {
    //VARS
    //(ANIMATION LOOP)
    autoScrollLoop = null;
    //(TARGETS)
    target = null;
    rootTarget = null;
    hasTarget() {
        return (this.target !== null || this.rootTarget !== null);
    }
    //(ANCHOR)
    anchor = {
        x: 0,
        y: 0
    }
    setAnchor(x, y) {
        this.anchor.x = x;
        this.anchor.y = y;
    }
    //(DIRECTION TO AUTOSROLL)
    direction = {
        x: 0,
        y: 0
    }
    setDirection(x, y) {
        this.direction.x = x;
        this.direction.y = y;
    }
    //(SCROLL DURING ANIMATION)
    scroll = {
        xValue: 0,
        yValue: 0,
        vertical: {
            up: () => (this.scroll.yValue--),
            down: () => (this.scroll.yValue++)
        },
        horizontal: {
            left: () => (this.scroll.xValue--),
            right: () => (this.scroll.xValue++)
        },
        clear: () => (this.verticalScroll.value = 0)
    }
    //MAIN
    constructor() { }
    //FUNCS
    clear() {
        this.autoScrollLoop = null;
        this.target = null;
        this.rootTarget = null;
        this.setAnchor(0, 0);
        this.setDirection(0, 0);
        this.verticalScroll.clear();
    }
}