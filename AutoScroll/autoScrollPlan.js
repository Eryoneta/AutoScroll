//MOUSE_EVENT
const MouseEvent = {
    LEFT: 0, MIDDLE: 1, RIGHT: 2,
    match: (mouseEvent, ...buttons) => {
        for (let button of buttons) if (mouseEvent.button === button) return true;
        return false;
    }
}
//KEYBOARD_EVENT
const KeyboardEvent = {
    A: 65, ENTER: 13, SPACE: 32,
    UP_ARROW: 38, DOWN_ARROW: 40, RIGHT_ARROW: 39, LEFT_ARROW: 37,
    NUM_0: 48, NUM_1: 49, NUM_2: 50, NUM_3: 51, NUM_4: 52, NUM_5: 53, NUM_6: 54, NUM_7: 55, NUM_8: 56, NUM_9: 57,
    match: (keyEvent, modifiers = { ctrl: false, shift: false, alt: false }, ...keys) => {
        if (modifiers.ctrl && !keyEvent.ctrlKey) return false;
        if (modifiers.shift && !keyEvent.shiftKey) return false;
        if (modifiers.alt && !keyEvent.altKey) return false;
        for (let key of keys) if (keyEvent.keyCode === key) return true;
        return false;
    }
};
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
//AUTOSCROLL_PLAN
class AutoScrollPlan {
    //VARS
    _root;
    //(AUTOSCROLL)
    autoScroll = AutoScroll();
    //(LISTENERS)
    listeners = {
        mousedown: (m) => { },
        mouseup: (m) => { },
        wheel: (m) => { },
        mousemove: (m) => { },
        keydown: (m) => { },
        keyup: (m) => { }
    };
    //MAIN
    constructor(autoScrollRoot) {
        this._root = autoScrollRoot;
    }
    init() {
        this._bindListeners();
    }
    //FUNCS
    //(LISTENERS)
    _bindListeners() {
        addEventListener("mousedown", (m) => this.listeners.mousedown(m), true);
        addEventListener("mouseup", (m) => this.listeners.mouseup(m), true);
        addEventListener("wheel", (m) => this.listeners.wheel(m), true);
        addEventListener("mousemove", (m) => this.listeners.mousemove(m), true);
        addEventListener("keydown", (m) => this.listeners.keydown(m), true);
        addEventListener("keyup", (m) => this.listeners.keyup(m), true);
    }
    stopEvent(event) {		//IMPEDE DEFAULT_EVENTS
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
    disableDefaultActions() {
        addEventListener("mousedown", this.stopEvent, true);
        addEventListener("mouseup", this.stopEvent, true);
        addEventListener("wheel", this.stopEvent, { passive: false });
        addEventListener("mousemove", this.stopEvent, true);
        addEventListener("keydown", this.stopEvent, true);
        addEventListener("keyup", this.stopEvent, true);
        addEventListener("contextmenu", this.stopEvent, true);	//IMPEDE DEFAUL_TOOLBOX
    }
    ableDefaultActions() {
        removeEventListener("mousedown", this.stopEvent, true);
        removeEventListener("mouseup", this.stopEvent, true);
        removeEventListener("wheel", this.stopEvent, { passive: false });
        removeEventListener("mousemove", this.stopEvent, true);
        removeEventListener("keydown", this.stopEvent, true);
        removeEventListener("keyup", this.stopEvent, true);
        removeEventListener("contextmenu", this.stopEvent, true);	//PERMITE DEFAUL_TOOLBOX
    }
    //(LOCALIZAR SCROLLBAR)
    setAutoScrollElement(element) {
        if(!this.root.rule.isElementValid(element))return;
        this.autoScroll.target = this._getElementWithScroll(element);
        this.autoScroll.rootTarget = this._getRootElementWithScroll(element);
        if (this.autoScroll.target === null) this.autoScroll.target = this.autoScroll.rootTarget;
        if (this.autoScroll.rootTarget === null) this.autoScroll.rootTarget = this.autoScroll.target;
    }
    _getElementWithScroll(element) {

        console.log(element);   //TEMP
        console.log(window);    //TEMP

        if (!this._root.rule.isElementNotWindow(element)) return null;
        if (!this._root.rule.scrollHasToBeAllowed(element)) return null;
        if (!this._root.rule.isInNeedOfScroll(element)) return null;
        if (!this._root.rule.isElementNotABase(element)) return null;
        return this._getElementWithScroll(element.parentNode);		//PASSA PARA VERIFICAR O ELEMENTO-PAI
    }
    _getRootElementWithScroll(element) {
        if (!this._root.rule.isElementNotABase(element)) return this._getElementWithScroll(element);
        if (this._getElementWithScroll(element.parentNode) !== null) {
            return this._getRootElementWithScroll(element.parentNode);
        } else return this._getElementWithScroll(element);
    }
    //(ANIMAÇÃO)
    startAutoScroll() {
        this._autoScrollLoop();
    }
    stopAutoScroll() {
        window.cancelAnimationFrame(this.autoScroll.autoScrollLoop);
    }
    _autoScrollLoop() {
        //É chamada por um dos States
        //Permite mudar o State enquanto ocorre, mudando seu comportamento
        //
        this.autoScroll.autoScrollLoop = window.requestAnimationFrame(this._autoScrollLoop);	//LOOP
    }
}