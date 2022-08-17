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
class AutoScrollRoot {
	//VARS
	view = new AutoScrollView(this);
	flow = new AutoScrollFlow(this);
	//(AUTOSCROLL)
	autoScroll = {
		//ANIMATION LOOP
		animationLoop: null,
		//TARGETS
		target: null,
		rootTarget: null,
		hasTarget: () => (this.autoScroll.target !== null || this.autoScroll.rootTarget !== null),
		//ANCHOR
		anchor: {
			x: 0,
			y: 0
		},
		setAnchor: (x, y) => {
			this.autoScroll.anchor.x = x;
			this.autoScroll.anchor.y = y;
		},
		//DIRECTION TO AUTOSROLL
		direction: {
			x: 0,
			y: 0
		},
		setDirection: (x, y) => {
			this.autoScroll.direction.x = x;
			this.autoScroll.direction.y = y;
		},
		//SCROLL DURING ANIMATION
		scroll: {
			xValue: 0,
			yValue: 0,
			vertical: {
				up: () => (this.autoScroll.scroll.yValue--),
				down: () => (this.autoScroll.scroll.yValue++)
			},
			horizontal: {
				left: () => (this.autoScroll.scroll.xValue--),
				right: () => (this.autoScroll.scroll.xValue++)
			},
			clear: () => (this.autoScroll.verticalScroll.value = 0)
		},
		//FUNCS
		clear: () => {
			this.autoScroll.animationLoop = null;
			this.autoScroll.target = null;
			this.autoScroll.rootTarget = null;
			this.autoScroll.setAnchor(0, 0);
			this.autoScroll.setDirection(0, 0);
			this.autoScroll.verticalScroll.clear();
		}
	};
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
	constructor() { }
	//FUNCS
	init() {
		this.view.init();
		this.flow.init();
		this._bindListeners();
	}
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
	//(VALIDAÇÃO)
	isValidElement(mouseEvent) {
		return (mouseEvent.clientX < this.view.htmlTag.clientWidth &&
			mouseEvent.clientY < this.view.htmlTag.clientHeight &&
			this._isValidElement(mouseEvent.target));
	}
	_isValidElement(element) {
		if (element === document || element === this.view.htmlTag || element === this.view.bodyTag) return true;	//DOC/HTML/BODY
		if (element.isContentEditable) return false;					//EDITORES
		if (element.localName === "a" && element.href) return false;	//<A> COM LINK
		if (element.localName === "textarea") return false;				//<TEXTAREA>
		if (element.localName === "input") return false;				//<INPUT>
		return this._isValidElement(element.parentNode);			//PASSA PARA VERIFICAR O ELEMENTO-PAI
	}
	//(LOCALIZAR SCROLLBAR)
	setAutoScrollElement(element) {
		this.autoScroll.target = this._getElementWithScroll(element);
		this.autoScroll.rootTarget = this._getRootElementWithScroll(element);
		if (this.autoScroll.target === null) this.autoScroll.target = this.autoScroll.rootTarget;
		if (this.autoScroll.rootTarget === null) this.autoScroll.rootTarget = this.autoScroll.target;
	}
	_getElementWithScroll(element) {
		console.log(element);
		console.log(window);
		if (element === window) return null;
		const elementStyle = getComputedStyle(element);
		const allowScrollOnX = (element.scrollWidth > element.clientWidth);
		const allowScrollOnY = (element.scrollHeight > element.clientHeight);
		if (this._allowScroll(elementStyle) && (allowScrollOnX || allowScrollOnY)) return element;
		if (element === document || element === this.view.htmlTag || element === this.view.bodyTag) return null;
		return this._getElementWithScroll(element.parentNode);		//PASSA PARA VERIFICAR O ELEMENTO-PAI
	}
	_getRootElementWithScroll(element) {
		if (element === document || element === this.view.htmlTag || element === this.view.bodyTag) return this._getElementWithScroll(element);
		if (this._getElementWithScroll(element.parentNode) !== null) {
			return this._getRootElementWithScroll(element.parentNode);
		} else return this._getElementWithScroll(element);
	}
	_allowScroll(elementStyle) {
		if (elementStyle.overflow === "hidden") return false;
		if (elementStyle.overflowX === "hidden" && elementStyle.overflowY === "hidden") return false;
		return true;
	}
	//(ANIMAÇÃO)
	startAutoScroll() {
		this._animationLoop();
	}
	stopAutoScroll() {
		window.cancelAnimationFrame(this.autoScroll.animationLoop);
	}
	_animationLoop() {
		//É chamada por um dos States
		//Permite mudar o State enquanto ocorre, mudando seu comportamento
		//
		this.autoScroll.animationLoop = window.requestAnimationFrame(this._animationLoop);	//LOOP
	}
}