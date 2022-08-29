//AUTOSCROLL_RULE
class AutoScrollRule {
    //VARS
    root;
    //(CONSTANTES)
    speedIncremento = 0.125;				    //INCREMENTADOR DE VELOCIDADE
    restRadius = 20;	                        //RAIO DA ÁREA EM QUE NÃO HÁ AUTOSCROLL
    speedControl = 8;						    //DIVIDE A VELOCIDADE
    autoScrollPesado = 5;					    //QUANTIDADE DE SCROLLS DADOS EM SCROLL PESADO
    //MAIN
    constructor(autoScrollRoot) {
        this.root = autoScrollRoot;
    }
    init() {
        this.restRadius = (this.root.view.cursorImageSize / 2) + 5;
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
    isElementValid(element) {
        if (this.isElementWindow(element)) return false;                //NOT - WINDOW
        if (this.isElementABase(element)) return true;                  //YES - DOC/HTML/BODY
        if (element.isContentEditable) return false;					//NOT - EDITORES
        if (element.localName === "a" && element.href) return false;	//NOT - <A> COM LINK
        if (element.localName === "textarea") return false;				//NOT - <TEXTAREA>
        if (element.localName === "input") return false;				//NOT - <INPUT>
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
        if (this.isElementBody(element)) return true;
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