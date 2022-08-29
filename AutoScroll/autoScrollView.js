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
	viewElement = document.createElement("div");				//USADO PARA O VISUAL
	//(CURSOR)
	_cursor = new Cursor(this);
	_anchor = new Anchor(this);
	cursorImageSize = this._cursor.cursorImageSize;
	//MAIN
	constructor(autoScrollRoot) {
		this.root = autoScrollRoot;
	}
	init() {
		this._appendAutoScrollToHTML(this.viewElement);
	}
	//FUNCS
	//(CURSOR)
	loadCursor(cursorMode = CursorMode.FIXED, following = false, anchorLocation = { x: 0, y: 0 }, cursorLocation = { x: 0, y: 0 }) {
		setTimeout(() => this._anchor.show(this.viewElement, anchorLocation), 10);		//DELAY PARA APARECER APÓS O CURSOR
		this._cursor.show(this.viewElement, following, cursorMode, anchorLocation, cursorLocation);
	}
	unloadCursor() {
		this._anchor.hide(this.viewElement);
		setTimeout(() => this._cursor.hide(this.viewElement), 10);	//DELAY PARA DESAPARECER APÓS O FUNDO
	}
	//(INJEÇÃO)
	_appendAutoScrollToHTML(viewElement) {
		document.documentElement.appendChild(this._createAutoScrollTag(viewElement));
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