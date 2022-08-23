//ANCHOR
class Anchor {
	//VARS
	view;
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