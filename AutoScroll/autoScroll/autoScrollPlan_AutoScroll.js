//AUTOSCROLL
class AutoScroll {
    //VARS
    plan;
    //(TARGETS)
    _foreTarget = null;
    _rootTarget = null;
    loadTargetsWithScrollableElements(element) {
        this.clearTargets();
        this._foreTarget = this._getElementWithScroll(element);
        this._rootTarget = this._getRootElementWithScroll(element);
        if (this._foreTarget === null) this._foreTarget = this._rootTarget;
        if (this._rootTarget === null) this._rootTarget = this._foreTarget;
    }
    _getElementWithScroll(element) {
        if (this.plan.root.rule.isElementWindow(element)) return null;
        if (!this.root.rule.isElementValid(element)) return this._getElementWithScroll(element.parentNode);
        if (this.plan.root.rule.isElementABase(element)) return element;
        if (!this.plan.root.rule.scrollHasToBeAllowed(element)) return this._getElementWithScroll(element.parentNode);
        if (!this.plan.root.rule.isInNeedOfScroll(element)) return this._getElementWithScroll(element.parentNode);
        return element;
    }
    _getRootElementWithScroll() {
        if (this.plan.root.rule.isElementWindow(element)) return null;
        if (!this.root.rule.isElementValid(element)) return this._getElementWithScroll(element.parentNode);
        if (this.plan.root.rule.isElementABase(element)) return element;
        if (!this.plan.root.rule.scrollHasToBeAllowed(element)) return this._getRootElementWithScroll(element.parentNode);
        if (!this.plan.root.rule.isInNeedOfScroll(element)) return this._getRootElementWithScroll(element.parentNode);
        if (this._getRootElementWithScroll(element.parentNode) !== null) {
            return this._getRootElementWithScroll(element.parentNode);
        } else return element;
    }
    hasTargets() {
        return (this._foreTarget !== null || this._rootTarget !== null);
    }
    getForegroundTarget() {
        return this._foreTarget;
    }
    getRootTarget() {
        return this._rootTarget;
    }
    clearTargets() {
        this._foreTarget = null;
        this._rootTarget = null;
    }
    //(ANCHOR)
    _anchor = {
        x: 0,
        y: 0
    }
    setAnchor(x, y) {
        this._anchor.x = x;
        this._anchor.y = y;
    }
    getAnchor() {
        return _anchor;
    }
    //(CURSOR)
    _cursor = {
        x: 0,
        y: 0
    }
    setCursor(x, y) {
        this._cursor.x = x;
        this._cursor.y = y;
    }
    getCursor() {
        return _cursor;
    }
    //(DIRECTION TO AUTOSCROLL)
    _autoScroll = {
        deltaX: 0,
        deltaY: 0
    }
    setAutoScroll(x, y) {
        this._autoScroll.deltaX = x;
        this._autoScroll.deltaY = y;
    }
    getAutoScroll() {
        return _autoScroll;
    }
    //(SCROLL DURING ANIMATION)
    _scroll = {
        deltaX: 0,
        deltaY: 0
    }
    setScroll(x, y) {
        this._scroll.deltaX = x;
        this._scroll.deltaY = y;
    }
    getScroll() {
        return _scroll;
    }
    //(ANIMATION)
    _loop = () => { };
    startAutoDrag() {
        this.stop();
        if(this.hasTargets()) this._autoDragLoop();
    }
    startAutoScroll() {
        this.stop();
        if(this.hasTargets()) this._autoScrollLoop();
    }
    stop() {
        window.cancelAnimationFrame(this._loop);
    }
    _autoDragLoop() {
        let deltaX = 0;
        let deltaY = 0;
        if (this.isOutsideRestRadious()) {
            const diffX = this._cursor.x - this._anchor.x;
            const diffY = this._cursor.y - this._anchor.y;
            deltaX = diffX / this.plan.root.rule.speedControl;
            deltaY = diffY / this.plan.root.rule.speedControl;
        }
        this._loopEngine(this._foreTarget, deltaX, deltaY);
        this._loop = window.requestAnimationFrame(this._autoDragLoop);
    }
    _autoScrollLoop() {
        this._loopEngine(this._rootTarget, this._autoScroll.deltaX, this._autoScroll.deltaY);
        this._loop = window.requestAnimationFrame(this._autoScrollLoop);
    }
    _loopEngine(element, deltaX, deltaY) {
        const isWindow = !this.plan.root.rule.isElementWindow(element);
        let scrollX = (isWindow ? element.scrollX : element.scrollLeft);
        let scrollY = (isWindow ? element.scrollY : element.scrollTop);
        //AUTOSCROLL/AUTODRAG
        scrollX += deltaX;
        scrollY += deltaY;
        //APLICA SCROLL DURANTE LOOP
        scrollX += this._scroll.xValue;
        scrollY += this._scroll.yValue;
        this._scroll.setScroll(0, 0);
        //LIMITA SCROLL NA TELA
        const scrollWidth = element.scrollWidth - element.clientWidth;
        const scrollHeight = element.scrollHeight - element.clientHeight;
        scrollX = Math.max(0, Math.min(scrollX, scrollWidth));      //TODO: CHECAR SE REALMENTE O LIMITA
        scrollY = Math.max(0, Math.min(scrollY, scrollHeight));     //TODO: CHECAR SE REALMENTE O LIMITA
        //MOVE SCROLL
        if (!isWindow) {
            element.scrollLeft = scrollX;
            element.scrollTop = scrollY;
        } else window.scroll(scrollX, scrollY);
    }
    //MAIN
    constructor(autoScrollPlan) {
        this.plan = autoScrollPlan;
    }
    //FUNCS
    isOutsideRestRadious() {
        const diffX = this._cursor.x - this._anchor.x;
        const diffY = this._cursor.y - this._anchor.y;
        const distancia = Math.sqrt(diffX * diffX + diffY * diffY);
        return this.plan.root.rule.isOutsideRestRadious(distancia);
    }
    clear() {
        this._loop = () => { };
        this._foreTarget = null;
        this._rootTarget = null;
        this.setAnchor(0, 0);
        this.setCursor(0, 0);
        this.setAutoScroll(0, 0);
        this.setScroll(0, 0);
    }
}