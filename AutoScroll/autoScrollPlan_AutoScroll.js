//AUTOSCROLL
class AutoScroll {
    //VARS
    plan;
    //(TARGETS)
    _target = null;
    _rootTarget = null;
    setElement(element) {
        if (!this.root.rule.isElementValid(element)) return;
        this._target = this._getElementWithScroll(element);
        this._rootTarget = this._getRootElementWithScroll(element);
        if (this._target === null) this._target = this._rootTarget;
        if (this._rootTarget === null) this._rootTarget = this._target;
    }
    _getElementWithScroll(element) {

        console.log(element);   //TEMP
        console.log(window);    //TEMP

        if (!this.plan.root.rule.isElementNotWindow(element)) return null;
        if (!this.plan.root.rule.scrollHasToBeAllowed(element)) return null;
        if (!this.plan.root.rule.isInNeedOfScroll(element)) return null;
        if (!this.plan.root.rule.isElementNotABase(element)) return null;
        return this._getElementWithScroll(element.parentNode);		//PASSA PARA VERIFICAR O ELEMENTO-PAI
    }
    _getRootElementWithScroll(element) {
        if (!this.plan.root.rule.isElementNotABase(element)) return this._getElementWithScroll(element);
        if (this._getElementWithScroll(element.parentNode) !== null) {
            return this._getRootElementWithScroll(element.parentNode);
        } else return this._getElementWithScroll(element);
    }
    hasTarget() {
        return (this._target !== null || this._rootTarget !== null);
    }
    _runRootTarget = null;
    //(ANCHOR)
    _anchor = {
        x: 0,
        y: 0
    }
    setAnchor(x, y) {
        this._anchor.x = x;
        this._anchor.y = y;
    }
    //(DIRECTION TO AUTOSROLL)
    _direction = {
        x: 0,
        y: 0
    }
    setDirection(x, y) {
        this._direction.x = x;
        this._direction.y = y;
    }
    //(SCROLL DURING ANIMATION)
    _scroll = {
        xValue: 0,
        yValue: 0,
        vertical: {
            up: () => (this._scroll.yValue--),
            down: () => (this._scroll.yValue++)
        },
        horizontal: {
            left: () => (this._scroll.xValue--),
            right: () => (this._scroll.xValue++)
        },
        clear: () => {
            this._scroll.xValue = 0;
            this._scroll.yValue = 0;
        }
    }
    //(ANIMATION)
    _autoScrollLoop = () => { };
    startAutoScrolling() {
        this._autoScrollLoop();
    }
    stopAutoScrolling() {
        window.cancelAnimationFrame(this._autoScrollLoop);
    }
    _autoScrollLoop() {
        //É chamada por um dos States
        //Permite mudar o State enquanto ocorre, mudando seu comportamento

        this._autoScrollLoop = window.requestAnimationFrame(this._autoScrollLoop);	//LOOP
    }
    //MAIN
    constructor(autoScrollPlan) {
        this.plan = autoScrollPlan;
    }
    //FUNCS
    clear() {
        this._autoScrollLoop = () => { };
        this._target = null;
        this._rootTarget = null;
        this._runRootTarget = null;
        this.setAnchor(0, 0);
        this.setDirection(0, 0);
        this._scroll.clear();
    }
}