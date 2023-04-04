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
//LISTENER_BUNDLE
class ListenerBundle {
    //VARS
    //(LISTENERS)
    mousedown = () => { };
    mouseup = () => { };
    wheel = () => { };
    mousemove = () => { };
    keydown = () => { };
    keyup = () => { };
    setListeners(listenerBundle = new ListenerBundle()) {
        this.mousedown = listenerBundle.mousedown;
        this.mouseup = listenerBundle.mouseup;
        this.wheel = listenerBundle.wheel;
        this.mousemove = listenerBundle.mousemove;
        this.keydown = listenerBundle.keydown;
        this.keyup = listenerBundle.keyup;
    }
    //MAIN
    constructor({
        mousedown = () => { },
        mouseup = () => { },
        wheel = () => { },
        mousemove = () => { },
        keydown = () => { },
        keyup = () => { }
    } = {}) {
        this.mousedown = mousedown;
        this.mouseup = mouseup;
        this.wheel = wheel;
        this.mousemove = mousemove;
        this.keydown = keydown;
        this.keyup = keyup;
    }
    //FUNCS
    bindListeners(element) {
        element.addEventListener("mousedown", (m) => this.mousedown(m), true);
        element.addEventListener("mouseup", (m) => this.mouseup(m), true);
        element.addEventListener("wheel", (w) => this.wheel(w), { passive: false });
        element.addEventListener("mousemove", (m) => this.mousemove(m), true);
        element.addEventListener("keydown", (k) => this.keydown(k), true);
        element.addEventListener("keyup", (k) => this.keyup(k), true);
    }
}