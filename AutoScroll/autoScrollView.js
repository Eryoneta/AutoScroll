//CURSOR_MODE
const CursorMode = {
	FIXED: 0, FREE: 1, HORIZONTAL: 2, VERTICAL: 3
};
//CURSOR
class Cursor {
	//VARS
	//(IMAGENS)
	_image = {
		basePath: "Scrolls",
		anchor: {
			name: "F"	//EX: "Scrolls/F.png"
		},
		direction: {
			center: { name: "M", modes: ["H", "V", "HV"] },
			up: { name: "C", modes: ["S", "E"] },		//EX: "Scrolls/C/S/2.png"
			upRight: { name: "C", modes: ["S", "E"] },
			right: { name: "C", modes: ["S", "E"] },
			downRight: { name: "C", modes: ["S", "E"] },
			down: { name: "B", modes: ["S", "E"] },
			downLeft: { name: "C", modes: ["S", "E"] },
			left: { name: "C", modes: ["S", "E"] },
			upLeft: { name: "C", modes: ["S", "E"] }
		},
		frames: ["1", "2", "3", "4"],
		fileType: "png"
	}
	//(ANIMAÇÃO)
	_animation = {
		frames: [],
		duration: "3s",
		iterationCount: "infinite"
	}
	//MAIN
	constructor() {
		//NÃO PODEM RECEBER frames ANTES DE INICIAR, APENAS DEPOIS
		const frames = this._image.frames;
		this._animation.frames = [	//BLINK, BLINK-BLINK
			{ time: 0.000, name: frames[0] },	//BLINK START
			{ time: 23.35, name: frames[0] },
			{ time: 23.36, name: frames[1] },
			{ time: 25.23, name: frames[2] },
			{ time: 27.10, name: frames[3] },
			{ time: 28.97, name: frames[2] },
			{ time: 30.84, name: frames[1] },
			{ time: 32.71, name: frames[0] },	//BLINK END
			{ time: 79.42, name: frames[0] },	//BLINK START
			{ time: 79.43, name: frames[1] },
			{ time: 81.30, name: frames[2] },
			{ time: 83.17, name: frames[3] },
			{ time: 85.04, name: frames[2] },
			{ time: 86.91, name: frames[1] },	//BLINK END
			{ time: 88.78, name: frames[0] },	//BLINK START
			{ time: 90.65, name: frames[1] },
			{ time: 92.52, name: frames[2] },
			{ time: 94.39, name: frames[3] },
			{ time: 96.26, name: frames[2] },
			{ time: 98.13, name: frames[1] },
			{ time: 100.0, name: frames[0] }	//BLINK END
		];
	}
	//FUNCS
	//(INJECT)
	injectCursorStyle(viewElement) {
		viewElement.style.setProperty("animation-duration", this._animation.duration);
		viewElement.style.setProperty("animation-iteration-count", this._animation.iterationCount);
		let keyframes = "";
		for (let dir in this._image.direction) {
			const direction = this._image.direction[dir];
			for (let mode of direction.modes) {
				keyframes += "@keyframes " + direction.name + "_" + mode + " {";		//EX: "@keyframes C_S {"
				keyframes += "\n";
				for (let frame of this._animation.frames) {
					const cursorName = (direction.name + "/" + mode + "/" + frame.name);
					const cursorPath = this._image.basePath + "/" + cursorName + "." + this._image.fileType;
					keyframes += ("	" + frame.time + "%{ cursor:url('" + chrome.runtime.getURL(cursorPath) + "')16 16, auto; }");
					//EX:  "	0.000%{ cursor:url('Scrolls/C/S/1.png')16 16, auto; }"
					keyframes += "\n";
				}
				keyframes += "}";		//EX: }
				keyframes += "\n";
			}
		}
		const styler = document.createElement("style");		//ANIMAÇÃO DE CURSOR É SEPARADA EM OUTRO <style>
		styler.innerHTML = keyframes;
		viewElement.appendChild(styler);
	}
	//(SHOW/HIDE)
	show(viewElement, mode = CursorMode.FIXED, anchorLocation = { x: 0, y: 0 }, location = { x: 0, y: 0 }) {
		//TODO
	}
	hide(viewElement) {
		viewElement.style.removeProperty("cursor");
		viewElement.style.removeProperty("animationName");		//TODO: CHECK!
	}
}
//ANCHOR
class Anchor {
	//VARS
	//(IMAGENS)
	_image = {
		basePath: "Scrolls",
		anchor: {
			name: "F"	//EX: "Scrolls/F.png"
		},
		fileType: "png"
	}
	//FUNCS
	//(INJECT)
	injectAnchorStyle(viewElement) {
		viewElement.style.setProperty("transform", "translateZ(0)");
		viewElement.style.setProperty("display", "none");
		viewElement.style.setProperty("position", "fixed");
		viewElement.style.setProperty("left", "0px");
		viewElement.style.setProperty("top", "0px");
		viewElement.style.setProperty("width", "100%");
		viewElement.style.setProperty("height", "100%");
		viewElement.style.setProperty("z-index", "2147483647");
		viewElement.style.setProperty("background-repeat", "no-repeat");
	}
	//(SHOW/HIDE)
	show(viewElement, location = { x: 0, y: 0 }) {
		const cursorPath = this._image.basePath + "/" + this._image.anchor.name + this._image.fileType;
		viewElement.style.setProperty("background-image", "url('" + chrome.runtime.getURL(cursorPath) + "')");
		viewElement.style.setProperty("background-position", location.x + "px " + location.y + "px");
		viewElement.style.removeProperty("display");
	}
	hide(viewElement) {
		viewElement.style.removeProperty("background-image");
		viewElement.style.removeProperty("background-position");
		viewElement.style.setProperty("display", "none");
	}
}
//AUTOSCROLL_VIEW
class AutoScrollView {
	//VARS
	_root;
	//(ELEMENTS)
	htmlTag = document.documentElement;							//USADO PARA DETECTAR SCROLLBAR
	bodyTag = (document.body ? document.body : this.htmlTag);	//USADO PARA DETECTAR SCROLLBAR
	viewElement = document.createElement("div");				//USADO PARA O VISUAL
	//(CURSOR)
	_cursor = new Cursor();
	_anchor = new Anchor();
	//MAIN
	constructor(autoScrollRoot) {
		this._root = autoScrollRoot;
	}
	init() {
		this._appendAutoScrollToHTML(this.viewElement);
	}
	//FUNCS
	//(CURSOR)
	loadCursor(cursorMode = CursorMode.FREE, anchorLocation = { x: 0, y: 0 }, cursorLocation = { x: 0, y: 0 }) {
		setTimeout(() => this._anchor.show(this.viewElement, anchorLocation), 10);		//DELAY PARA APARECER APÓS O CURSOR
		this._cursor.show(this.viewElement, cursorMode, anchorLocation, cursorLocation);
	}
	unloadCursor() {
		this._anchor.hide(this.viewElement);
		setTimeout(() => this._cursor.hide(this.viewElement), 10);	//DELAY PARA DESAPARECER APÓS O FUNDO
	}
	//(INJEÇÃO)
	_appendAutoScrollToHTML(viewElement) {
		this.htmlTag.appendChild(this._createAutoScrollTag(viewElement));
	}
	_createAutoScrollTag(viewElement) {
		const autoScrollTag = document.createElement("auto-scroll");
		const autoScrollTagShadow = autoScrollTag.attachShadow({ mode: "open" });
		this._anchor.injectAnchorStyle(viewElement);
		this._cursor.injectCursorStyle(viewElement);
		autoScrollTagShadow.appendChild(viewElement);
		return autoScrollTag;
	}
}