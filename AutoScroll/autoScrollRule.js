//AUTOSCROLL_RULE
class AutoScrollRule {
    //VARS
    _root;
    //(CONSTANTES)
    speedIncremento = 0.125;				    //INCREMENTADOR DE VELOCIDADE
    restRadius = 20;	                        //RAIO DA ÁREA EM QUE NÃO HÁ AUTOSCROLL
    speedControle = 8;						    //DIVIDE A VELOCIDADE
    autoScrollPesado = 5;					    //QUANTIDADE DE SCROLLS DADOS EM SCROLL PESADO
    //MAIN
    constructor(autoScrollRoot) {
        this._root = autoScrollRoot;
    }
    init() {
        restRadius = (this._root.view.cursorImageSize / 2) + 5;
    }
    //FUNCS
    //(SCROLL_VALIDATION)
    isScrollAllowed(element) {
        const elementStyle = window.getComputedStyle(element);
        if (elementStyle.overflow === "hidden") return false;
        if (elementStyle.overflowX === "hidden" && elementStyle.overflowY === "hidden") return false;
        return true;
    }
    isInNeedOfScroll(element) {
        return (this.isInNeedOfScrollX(element) || isInNeedOfScrollY(element));
    }
    isInNeedOfScrollX(element) {
        return (element.scrollWidth > element.clientWidth);
    }
    isInNeedOfScrollY(element) {
        return (element.scrollHeight > element.clientHeight);
    }
    //(ELEMENT_VALIDATION)
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
    isElementNotWindow(element) {
        if (element !== window) return true;
        return false;
    }
    isElementNotABase(element) {
        if (element !== document && element !== this._root.view.htmlTag && element !== this._root.view.bodyTag) return true;	//DOC/HTML/BODY
        return false;
    }
    //(CURSOR_VALIDATION)
    isOutsideRestRadious(distance) {
        return (distance > this.restRadius);
    }
}