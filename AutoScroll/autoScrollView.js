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
	}
	//FUNCS
	//(CURSOR)
	loadCursor(orientation = CursorOrientation.FIXED, mode = CursorMode.FOLLOWING, anchorLocation = { x: 0, y: 0 }, cursorLocation = { x: 0, y: 0 }) {
		setTimeout(() => this.anchor.show(anchorLocation), 10);		//DELAY PARA APARECER APÓS O CURSOR
		this.cursor.show(orientation, mode, anchorLocation, cursorLocation);
	}
	unloadCursor() {
		this.anchor.hide();
		setTimeout(() => this.cursor.hide(), 10);	//DELAY PARA DESAPARECER APÓS O FUNDO
	}
	//(INJEÇÃO)
	_appendAutoScrollToHTML(element) {
		document.documentElement.appendChild(this._createAutoScrollTag(element));
	}
	_createAutoScrollTag(element) {
		const autoScrollTag = document.createElement("auto-scroll");
		const autoScrollTagShadow = autoScrollTag.attachShadow({ mode: "open" });
		this.anchor.injectAnchor(element);
		this.cursor.injectCursor(element);
		autoScrollTagShadow.appendChild(element);
		return autoScrollTag;
	}
}