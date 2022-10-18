//AUTOSCROLL_PLAN
class AutoScrollPlan {
    //VARS
    root;
    //(AUTOSCROLL)
    autoScroll = new AutoScroll();
    //(LISTENERS)
    listenerBundle = new ListenerBundle();
    //MAIN
    constructor(autoScrollRoot) {
        this.root = autoScrollRoot;
    }
    init() {
        this.listenerBundle.bindListeners(document);
    }
    //FUNCS
    //(EVENTS)
    stopEvent(event) {		//IMPEDE DEFAULT_EVENTS
        event.preventDefault();
        event.stopImmediatePropagation();
        event.stopPropagation();
    }
    disableDefaultActions() {
        document.addEventListener("mousedown", this.stopEvent, true);
        document.addEventListener("mouseup", this.stopEvent, true);
        document.addEventListener("wheel", this.stopEvent, { passive: false });
        document.addEventListener("mousemove", this.stopEvent, true);
        document.addEventListener("keydown", this.stopEvent, true);
        document.addEventListener("keyup", this.stopEvent, true);
        document.addEventListener("contextmenu", this.stopEvent, true);	//IMPEDE DEFAUL_TOOLBOX
    }
    ableDefaultActions() {
        document.removeEventListener("mousedown", this.stopEvent, true);
        document.removeEventListener("mouseup", this.stopEvent, true);
        document.removeEventListener("wheel", this.stopEvent, { passive: false });
        document.removeEventListener("mousemove", this.stopEvent, true);
        document.removeEventListener("keydown", this.stopEvent, true);
        document.removeEventListener("keyup", this.stopEvent, true);
        document.removeEventListener("contextmenu", this.stopEvent, true);	//PERMITE DEFAUL_TOOLBOX
    }
}