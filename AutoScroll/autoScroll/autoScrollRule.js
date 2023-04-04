//AUTOSCROLL_RULE
class AutoScrollRule {
    //VARS
    root;
    //(CONSTANTES)
    speedIncrement = 0.125;     //INCREMENTOR DE VELOCIDADE
    restRadius = 20;            //RAIO DA ÁREA EM QUE NÃO HÁ AUTOSCROLL
    speedControl = 8;           //DIVIDE A VELOCIDADE
    lightAutoScroll = 1;        //QUANTIDADE DE UP/DOWN DADOS EM SCROLL LEVE
    heavyAutoScroll = 5;        //QUANTIDADE DE UP/DOWN DADOS EM SCROLL PESADO
    //MAIN
    constructor(autoScrollRoot) {
        this.root = autoScrollRoot;
    }
    init() {
        this.restRadius = (this.root.view.cursor.cursorImageSize / 2) + 5;
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
        return (this.isInNeedOfScrollX(element) || this.isInNeedOfScrollY(element));
    }
    isInNeedOfScrollX(element) {
        return (element.scrollWidth > element.clientWidth);
    }
    isInNeedOfScrollY(element) {
        return (element.scrollHeight > element.clientHeight);
    }
    isScrollable(element) {
        let scrollX = element.scrollLeft;
        let scrollY = element.scrollTop;
        element.scrollLeft += 1;
        element.scrollTop += 1;
        let scrolledX = (element.scrollLeft !== scrollX);
        let scrolledY = (element.scrollTop !== scrollY);
        element.scrollLeft = scrollX;
        element.scrollTop = scrollY;
        return (scrolledX || scrolledY);
    }
    //(ELEMENT_VALIDATION)
    isElementValid(element) {
        if (this.isElementWindow(element)) return false;                //WINDOW
        if (element.isContentEditable) return false;                    //EDITORES
        if (element.localName === "a" && element.href) return false;    //<A> COM LINK
        if (element.localName === "textarea") return false;             //<TEXTAREA>
        if (element.localName === "input") return false;                //<INPUT>
        return true;
    }
    isElementWindow(element) {
        return (element === window);
    }
    isElementDocument(element) {
        return (element === document);
    }
    isElementHTML(element) {
        return (element === document.documentElement);
    }
    isElementBody(element) {
        return (element === document.body);
    }
    isElementABase(element) {
        if (this.isElementHTML(element)) return true;
        if (this.isElementDocument(element)) return true;
        if (this.isElementWindow(element)) return true;
        return false;
    }
    //(CURSOR_VALIDATION)
    isOutsideRestRadious(distance) {
        return (distance > this.restRadius);
    }
}