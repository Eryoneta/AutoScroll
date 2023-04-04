//ANCHOR
class Anchor {
	//VARS
	view;
	_element;
	//(IMAGENS)
	_image = {
		basePath: "scrolls",
		anchor: {
			name: "F"	//EX: "scrolls/F.png"
		},
		fileType: "png"
	}
	//MAIN
	constructor(autoScrollView) {
		this.view = autoScrollView;
	}
	//FUNCS
	//(INJECT)
	injectAnchor(element) {
		this._element = element;
		this._element.style.setProperty("transform", "translateZ(0)");
		this._element.style.setProperty("display", "none");
		this._element.style.setProperty("position", "fixed");
		this._element.style.setProperty("left", "0px");
		this._element.style.setProperty("top", "0px");
		this._element.style.setProperty("width", "100%");
		this._element.style.setProperty("height", "100%");
		this._element.style.setProperty("z-index", "2147483647");
		this._element.style.setProperty("background-repeat", "no-repeat");
	}
	//(SHOW/HIDE)
	show(location = { x: 0, y: 0 }) {
		if (!this._element) return;
		const cursorPath = this._image.basePath + "/" + this._image.anchor.name + "." + this._image.fileType;
		this._element.style.setProperty("background-image", "url('" + chrome.runtime.getURL(cursorPath) + "')");
		this._element.style.setProperty("background-position", location.x + "px " + location.y + "px");
		this._element.style.removeProperty("display");
	}
	hide() {
		if (!this._element) return;
		this._element.style.removeProperty("background-image");
		this._element.style.removeProperty("background-position");
		this._element.style.setProperty("display", "none");
	}
}