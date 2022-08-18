//AUTOSCROLL_RULE
class AutoScrollRule {
    //VARS
    _root;
    //MAIN
    constructor(autoScrollRoot) {
        this._root = autoScrollRoot;
    }
    init() { }
    //FUNCS
    isScrollAllowed(element) {
        const elementStyle = window.getComputedStyle(element);
        if (elementStyle.overflow === "hidden") return false;
        if (elementStyle.overflowX === "hidden" && elementStyle.overflowY === "hidden") return false;
        return true;
    }
    isInNeedOfScroll(element) {
        const allowScrollOnX = (element.scrollWidth > element.clientWidth);
        const allowScrollOnY = (element.scrollHeight > element.clientHeight);
        return (allowScrollOnX || allowScrollOnY);
    }
    isElementValid(mouseEvent) {
        return (mouseEvent.clientX < this._root.view.htmlTag.clientWidth &&
            mouseEvent.clientY < this._root.view.htmlTag.clientHeight &&
            this._isElementValid(mouseEvent.target));
    }
    _isElementValid(element) {
        if (!this.isElementNotABase(element)) return true;
        if (element.isContentEditable) return false;					//EDITORES
        if (element.localName === "a" && element.href) return false;	//<A> COM LINK
        if (element.localName === "textarea") return false;				//<TEXTAREA>
        if (element.localName === "input") return false;				//<INPUT>
        return this._isElementValid(element.parentNode);			//PASSA PARA VERIFICAR O ELEMENTO-PAI
    }
    isElementNotWindow(element){
        if (element !== window) return true;
        return false;
    }
    isElementNotABase(element){
        if (element !== document && element !== this._root.view.htmlTag && element !== this._root.view.bodyTag) return true;	//DOC/HTML/BODY
        return false;
    }
}