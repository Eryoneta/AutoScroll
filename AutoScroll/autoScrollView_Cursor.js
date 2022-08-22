//CURSOR
class Cursor {
	//VARS
	cursorImageSize = this._image.size;
	//(IMAGENS)
	_image = {
		basePath: "Scrolls",
		anchor: {
			name: "F"	//EX: "Scrolls/F.png"
		},
		direction: {
			center: {
				name: "M",
				modes: { horizontal: { name: "H" }, vertical: { name: "V" }, center: { name: "HV" } }
			},
			up: {		//EX: "Scrolls/C/S/2.png"
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			upRight: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			right: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			downRight: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			down: {
				name: "B",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			downLeft: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			left: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			},
			upLeft: {
				name: "C",
				modes: { free: { name: "S" }, fixed: { name: "E" } }
			}
		},
		frames: ["1", "2", "3", "4"],
		fileType: "png",
		size: 32
	}
	//(ANIMAÇÃO)
	_animation = {
		frames: [],
		duration: "3s",
		iterationCount: "infinite"
	}
	//MAIN
	constructor() {
		//NÃO PODE RECEBER frames ANTES DE INICIAR, APENAS DEPOIS
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
			for (let mod in direction.modes) {
				const mode = direction.modes[mod];
				keyframes += "@keyframes " + direction.name + "_" + mode.name + " {";		//EX: "@keyframes C_S {"
				keyframes += "\n";
				for (let frame of this._animation.frames) {
					const cursorName = (direction.name + "/" + mode.name + "/" + frame.name);
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
	show(viewElement, mode = CursorMode.FREE, following = false, anchorLocation = { x: 0, y: 0 }, location = { x: 0, y: 0 }) {
		const diffX = location.x - anchorLocation.x;
		const diffY = location.y - anchorLocation.y;
		const distance = Math.sqrt(diffX * diffX + diffY * diffY);
		const angle = (diffX < 0 ? 180 : diffY > 0 ? 360 : 0) - (Math.atan(diffY / diffX) / (Math.PI / 180));
		/* ANGLE: SENTIDO HORÁRIO:
				90
			180	o  0
			   270
		*/
		const isResting = this._root.rule.isOutsideRestRadious(distance);	//DENTRO DA ÁREA DE REPOUSO
		let imageNome = "";
		let imageMode = "";
		switch (mode) {
			case CursorMode.FREE: default:
				const right = (angle > 0 && angle < 90 && angle > 270 && angle < 360);
				const upRight = (angle > 0 && angle < 90);
				const up = (angle > 0 && angle < 90);
				const upLeft = (angle > 0 && angle < 90);
				const left = (angle > 0 && angle < 90);
				const downLeft = (angle > 0 && angle < 90);
				const down = (angle > 0 && angle < 90);
				const downRight = (angle > 0 && angle < 90);
				switch (true) {
					case isResting:
						imageNome = this._image.direction.center.name;					//CENTER
						imageMode = this._image.direction.center.modes.center.name;			//FREE
						break;
					case right:
						imageNome = this._image.direction.right.name;					//RIGHT
						if (following) {
							imageMode = this._image.direction.right.modes.free.name;		//FREE
						} else imageMode = this._image.direction.right.modes.fixed.name;	//FIXED
						break;
					case upRight:
						imageNome = this._image.direction.upRight.name;					//UP-RIGHT
						if (following) {
							imageMode = this._image.direction.upRight.modes.free.name;		//FREE
						} else imageMode = this._image.direction.upRight.modes.fixed.name;	//FIXED
						break;
					case up:
						imageNome = this._image.direction.up.name;						//UP
						if (following) {
							imageMode = this._image.direction.up.modes.free.name;			//FREE
						} else imageMode = this._image.direction.up.modes.fixed.name;		//FIXED
						break;
					case upLeft:
						imageNome = this._image.direction.upLeft.name;					//UP-LEFT
						if (following) {
							imageMode = this._image.direction.upLeft.modes.free.name;		//FREE
						} else imageMode = this._image.direction.upLeft.modes.fixed.name;	//FIXED
						break;
					case left:
						imageNome = this._image.direction.left.name;					//UP-RIGHT
						if (following) {
							imageMode = this._image.direction.left.modes.free.name;			//FREE
						} else imageMode = this._image.direction.left.modes.fixed.name;		//FIXED
						break;
					case downLeft:
						imageNome = this._image.direction.downLeft.name;				//DOWN-LEFT
						if (following) {
							imageMode = this._image.direction.downLeft.modes.free.name;		//FREE
						} else imageMode = this._image.direction.downLeft.modes.fixed.name;	//FIXED
						break;
					case down:
						imageNome = this._image.direction.down.name;					//DOWN
						if (following) {
							imageMode = this._image.direction.down.modes.free.name;			//FREE
						} else imageMode = this._image.direction.down.modes.fixed.name;		//FIXED
						break;
					case downRight:
						imageNome = this._image.direction.downRight.name;				//DOWN-RIGHT
						if (following) {
							imageMode = this._image.direction.downRight.modes.free.name;	//FREE
						} else imageMode = this._image.direction.downRight.modes.fixed.name;//FIXED
						break;
				}
				break;
			case CursorMode.HORIZONTAL:
				const pointingRight = (angle > 0 && angle < 90 && angle > 270 && angle < 360);
				const horizontalCenter = (angle === 90 || angle === 270);
				const pointingLeft = (angle > 90 && angle < 270);
				switch (true) {
					case pointingRight:
						imageNome = this._image.direction.right.name;					//RIGHT
						if (following) {
							imageMode = this._image.direction.right.modes.free.name;		//FREE
						} else imageMode = this._image.direction.right.modes.fixed.name;	//FIXED
						break;
					case isResting:
					case horizontalCenter:
						imageNome = this._image.direction.center.name;					//CENTER
						imageMode = this._image.direction.center.modes.horizontal.name;		//HORIZONTAL
						break;
					case pointingLeft:
						imageNome = this._image.direction.left.name;					//LEFT
						if (following) {
							imageMode = this._image.direction.left.modes.free.name;			//FREE
						} else imageMode = this._image.direction.left.modes.fixed.name;		//FIXED
						break;
				}
				break;
			case CursorMode.VERTICAL:
				const pointingUp = (angle > 0 && angle < 180);
				const verticalCenter = (angle === 0 || angle === 180);
				const pointingDown = (angle > 0 && angle < 180);
				switch (true) {
					case pointingUp:
						imageNome = this._image.direction.up.name;						//UP
						if (following) {
							imageMode = this._image.direction.up.modes.free.name;			//FREE
						} else imageMode = this._image.direction.up.modes.fixed.name;		//FIXED
						break;
					case isResting:
					case verticalCenter:
						imageNome = this._image.direction.center.name;					//CENTER
						imageMode = this._image.direction.center.modes.vertical.name;		//VERTICAL
						break;
					case pointingDown:
						imageNome = this._image.direction.down.name;					//DOWN
						if (following) {
							imageMode = this._image.direction.down.modes.free.name;			//FREE
						} else imageMode = this._image.direction.down.modes.fixed.name;		//FIXED
						break;
				}
				break;
		}
		viewElement.style.setProperty("animation-name", imageNome + "_" + imageMode);
	}
	hide(viewElement) {
		viewElement.style.removeProperty("cursor");
		viewElement.style.removeProperty("animationName");		//TODO: CHECK!
	}
}