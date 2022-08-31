//CURSOR_MODE
const CursorMode = {
	FREE: 0,
	HORIZONTAL: 1,
	VERTICAL: 2
};
//AUTOSCROLL_VIEW
class AutoScrollView {
	//VARS
	root;
	//(ELEMENTS)
	viewElement = document.createElement("div");	//USADO PARA O VISUAL
	//(CURSOR)
	cursor = new Cursor(this);
	anchor = new Anchor(this);
	//MAIN
	constructor(autoScrollRoot) {
		this.root = autoScrollRoot;
	}
	init() {
		this._appendAutoScrollToHTML(this.viewElement);
		this.cursor.init();
		this.anchor.init();
	}
	//FUNCS
	//(CURSOR)
	loadCursor(cursorMode = CursorMode.FIXED, following = false, anchorLocation = { x: 0, y: 0 }, cursorLocation = { x: 0, y: 0 }) {
		setTimeout(() => this.anchor.show(anchorLocation), 10);		//DELAY PARA APARECER APÓS O CURSOR
		this.cursor.show(following, cursorMode, anchorLocation, cursorLocation);
	}
	unloadCursor() {
		this.anchor.hide();
		setTimeout(() => this.cursor.hide(), 10);	//DELAY PARA DESAPARECER APÓS O FUNDO
	}
	//(INJEÇÃO)
	_appendAutoScrollToHTML(viewElement) {
		document.documentElement.appendChild(this._createAutoScrollTag(viewElement));
	}
	_createAutoScrollTag(viewElement) {
		const autoScrollTag = document.createElement("auto-scroll");
		const autoScrollTagShadow = autoScrollTag.attachShadow({ mode: "open" });
		this.anchor.injectAnchorStyle(viewElement);
		this.cursor.injectCursorStyle(viewElement);
		autoScrollTagShadow.appendChild(viewElement);
		return autoScrollTag;
	}
}