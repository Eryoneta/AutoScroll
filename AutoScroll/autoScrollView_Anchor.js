//ANCHOR
class Anchor {
	//VARS
	view;
	_element;
	//(IMAGENS)
	_image = {
		basePath: "Scrolls",
		anchor: {
			name: "F"	//EX: "Scrolls/F.png"
		},
		fileType: "png"
	}
	//MAIN
	constructor(autoScrollView) {
		this.view = autoScrollView;
	}
	init() { }
	//FUNCS
	//(INJECT)
	injectAnchorStyle(element) {
		this._element = element;
		_element.style.setProperty("transform", "translateZ(0)");
		_element.style.setProperty("display", "none");
		_element.style.setProperty("position", "fixed");
		_element.style.setProperty("left", "0px");
		_element.style.setProperty("top", "0px");
		_element.style.setProperty("width", "100%");
		_element.style.setProperty("height", "100%");
		_element.style.setProperty("z-index", "2147483647");
		_element.style.setProperty("background-repeat", "no-repeat");
	}
	//(SHOW/HIDE)
	show(location = { x: 0, y: 0 }) {
		if (!this._element) return;
		const cursorPath = this._image.basePath + "/" + this._image.anchor.name + this._image.fileType;
		_element.style.setProperty("background-image", "url('" + chrome.runtime.getURL(cursorPath) + "')");
		_element.style.setProperty("background-position", location.x + "px " + location.y + "px");
		_element.style.removeProperty("display");
	}
	hide() {
		if (!this._element) return;
		_element.style.removeProperty("background-image");
		_element.style.removeProperty("background-position");
		_element.style.setProperty("display", "none");
	}
}