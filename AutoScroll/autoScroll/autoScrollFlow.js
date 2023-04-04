//AUTOSCROLL_FLOW
class AutoScrollFlow {
	//VARS
	root;
	_states = {};
	//MAIN
	constructor(autoScrollRoot) {
		this.root = autoScrollRoot;
	}
	init() {
		this._loadFlow();
		this.setState(State.INACTIVE);
	}
	//FUNCS
	//(SHORTCUTS)
	_loadCursor(element, mode = CursorMode.FOLLOWING) {
		const isInNeedOfScrollX = this.root.rule.isInNeedOfScrollX(element);
		const isInNeedOfScrollY = this.root.rule.isInNeedOfScrollY(element);
		const isInNeedOfBothScrolls = (isInNeedOfScrollX && isInNeedOfScrollY);
		switch (true) {
			case isInNeedOfBothScrolls:
				this.root.view.loadCursor(CursorOrientation.FREE, mode, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
			case isInNeedOfScrollX:
				this.root.view.loadCursor(CursorOrientation.HORIZONTAL, mode, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
			case isInNeedOfScrollY:
				this.root.view.loadCursor(CursorOrientation.VERTICAL, mode, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
		}
	}
	_unloadCursor() {
		this.root.view.unloadCursor();
	}
	//(FLOW)
	setState(state = State.INACTIVE) {
		const node = this._states[state];
		this.root.plan.listenerBundle.setListeners(node.listenerBundle);
		node.stateload();		//EXECUTA NODE_STATE_LOAD
	}
	_addState(node = new FlowNode()) {
		this._states[node.state] = node;
	}
	_loadFlow() {

		//[INACTIVE]
		this._addState(new FlowNode(State.INACTIVE, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.INACTIVE");
				this._unloadCursor();
				this.root.plan.autoScroll.clear();	//RESETA TUDO
				setTimeout(() => this.root.plan.ableDefaultActions(), 10);	//DELAY PARA IMPEDIR DEFAULT_TOOLBOX
			},
			mousedown: (m) => {
				switch (true) {
					//V
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);	//PARA O DRAGGING FUNCIONAR
						if (this.root.plan.autoScroll.hasTargets()) {
							this.root.plan.stopEvent(m);
							this.root.plan.disableDefaultActions();
							this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);
							this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
							this.setState(State.WAITING_1 + State.INACTIVE);
						}
						break;
					//V
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);	//PARA O HORIZONTAL_SCROLLING FUNCIONAR
						this.setState(State.WAITING_2 + State.INACTIVE);
						break;
				}
			},
			keydown: (k) => {
				switch (true) {
					case KeyboardEvent.match(k, KeyboardEvent.A, { ctrl: true, shift: true, alt: false }):
						this.setState(State.PAUSED + State.AUTO_SCROLLING);
						break;
				}
			}
		}));

		//[WAITING_1+INACTIVE]
		this._addState(new FlowNode(State.WAITING_1 + State.INACTIVE, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_1 + State.INACTIVE");
			},
			mousedown: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.SUBWAITING_1 + State.WAITING_1 + State.INACTIVE);
						break;
				}
			},
			mouseup: (m) => {
				switch (true) {
					//V
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);
						this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);	//CASO O CURSOR TENHA SIDO MOVIDO UM POUCO
						this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);	//CASO O CURSOR TENHA SIDO MOVIDO UM POUCO
						if (this.root.plan.autoScroll.hasTargets()) {
							this.setState(State.AUTO_DRAGGING);
						} else this.setState(State.INACTIVE);
						break;
				}
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				if (this.root.plan.autoScroll.isOutsideRestRadious()) this.setState(State.DRAGGING);
			}
		}));

		//[SUBWAITING_1+WAITING_1+INACTIVE]
		this._addState(new FlowNode(State.SUBWAITING_1 + State.WAITING_1 + State.INACTIVE, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.SUBWAITING_1 + State.WAITING_1 + State.INACTIVE");
			},
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);
						this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);
						this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
						if (this.root.plan.autoScroll.hasTargets()) {
							this.setState(State.WAITING_1 + State.PAUSED + State.AUTO_SCROLLING);
						} else this.setState(State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.AUTO_SCROLLING);
						break;
				}
			}
		}));

		//[WAITING_2+INACTIVE]
		this._addState(new FlowNode(State.WAITING_2 + State.INACTIVE, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_2 + State.INACTIVE");
			},
			mousedown: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.setState(State.DEFAULT_AUTOSCROLLING);
						break;
				}
			},
			//V
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.INACTIVE);	//PERMITE RIGHT_CLICK
						break;
				}
			},
			//V
			wheel: (w) => {
				this.root.plan.stopEvent(w);	//IMPEDE QUALQUER OUTRO MOUSE_WHEEL_ROLL
				this.root.plan.disableDefaultActions();
				this.root.plan.autoScroll.horizontalScroll(w.deltaY);
				this.setState(State.HORIZONTAL_SCROLLING);
			}
		}));



		//[DEFAULT_AUTOSCROLLING]
		this._addState(new FlowNode(State.DEFAULT_AUTOSCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.DEFAULT_AUTOSCROLLING");
			},
			mousedown: (m) => {
				this.setState(State.INACTIVE);
			},
			keydown: (k) => {
				this.setState(State.INACTIVE);
			}
		}));



		//[HORIZONTAL_SCROLLING]
		this._addState(new FlowNode(State.HORIZONTAL_SCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.HORIZONTAL_SCROLLING");
			},
			//V
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.INACTIVE);
						break;
				}
			},
			//V
			wheel: (w) => {
				this.root.plan.autoScroll.horizontalScroll(w.deltaY);
			}
		}));



		//[DRAGGING]
		this._addState(new FlowNode(State.DRAGGING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.DRAGGING");
				this.root.plan.autoScroll.startDrag();
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), CursorMode.FOLLOWING);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), CursorMode.FOLLOWING);
			}
		}));



		//[AUTO_DRAGGING]
		this._addState(new FlowNode(State.AUTO_DRAGGING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.AUTO_DRAGGING");
				this.root.plan.autoScroll.startAutoDrag();
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.FOLLOWING);
			},
			mousedown: (m) => {
				this.root.plan.autoScroll.stop();
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.RESTING);
				this.setState(State.WAITING_1 + State.AUTO_DRAGGING);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.FOLLOWING);
			},
			wheel: (w) => {
				this.root.plan.autoScroll.setScroll(0, w.deltaY);
			},
			keydown: (k) => {

			}
		}));

		//[WAITING_1+AUTO_DRAGGING]
		this._addState(new FlowNode(State.WAITING_1 + State.AUTO_DRAGGING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_1 + State.AUTO_DRAGGING");
			},
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.LEFT, MouseEvent.MIDDLE):
						this.setState(State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):
						if (this.root.plan.autoScroll.isOutsideRestRadious()) {
							this.setState(State.PAUSED + State.AUTO_DRAGGING);
						} else this.setState(State.AUTO_SCROLLING);
						break;
				}
			},
			wheel: (w) => {
				switch (w.buttons) {
					case MouseEvent.LEFT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.lightAutoScroll);
						break;
					case MouseEvent.RIGHT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.heavyAutoScroll);
						break;
				}
				this.setState(State.AUTO_SCROLLING);
			}
		}));

		//[PAUSED+AUTO_DRAGGING]
		this._addState(new FlowNode(State.PAUSED + State.AUTO_DRAGGING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.PAUSED + State.AUTO_DRAGGING");
			},
			mousedown: (m) => {
				this.setState(State.WAITING_1 + State.PAUSED + State.AUTO_DRAGGING);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.RESTING);
			},
			keydown: (k) => {

			}
		}));

		//[WAITING_1+PAUSED+AUTO_DRAGGING]
		this._addState(new FlowNode(State.WAITING_1 + State.PAUSED + State.AUTO_DRAGGING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_1 + State.PAUSED + State.AUTO_DRAGGING");
			},
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.LEFT, MouseEvent.MIDDLE):
						this.setState(State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.AUTO_DRAGGING);
						break;
				}
			},
			wheel: (w) => {
				switch (w.buttons) {
					case MouseEvent.LEFT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.heavyAutoScroll);
						break;
					case MouseEvent.RIGHT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.lightAutoScroll);
						break;
				}
				this.setState(State.AUTO_SCROLLING);
			}
		}));



		//[AUTO_SCROLLING]
		this._addState(new FlowNode(State.AUTO_SCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.AUTO_SCROLLING");
				this.root.plan.autoScroll.startAutoScroll();
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.FOLLOWING);
			},
			mousedown: (m) => {
				this.setState(State.WAITING_1 + State.AUTO_SCROLLING);
			},
			wheel: (w) => {
				this.root.plan.autoScroll.setScroll(0, w.deltaY);
			},
			keydown: (k) => {

			}
		}));

		//[WAITING_1+AUTO_SCROLLING]
		this._addState(new FlowNode(State.WAITING_1 + State.AUTO_SCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_1 + State.AUTO_SCROLLING");
			},
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.LEFT, MouseEvent.MIDDLE):
						this.setState(State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.PAUSED + State.AUTO_SCROLLING);
						break;
				}
			},
			wheel: (w) => {
				switch (w.buttons) {
					case MouseEvent.LEFT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.heavyAutoScroll);
						break;
					case MouseEvent.RIGHT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.lightAutoScroll);
						break;
				}
			}
		}));

		//[PAUSED+AUTO_SCROLLING]
		this._addState(new FlowNode(State.PAUSED + State.AUTO_SCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.PAUSED + State.AUTO_SCROLLING");
			},
			mousedown: (m) => {
				this.setState(State.WAITING_1 + State.PAUSED + State.AUTO_SCROLLING);
			},
			wheel: (w) => {
				this.root.plan.autoScroll.setScroll(0, w.deltaY);
			},
			keydown: (k) => {

			}
		}));

		//[WAITING_1+PAUSED+AUTO_SCROLLING]
		this._addState(new FlowNode(State.WAITING_1 + State.PAUSED + State.AUTO_SCROLLING, {
			stateload: () => {
/*REMOVE! =================>*/console.log("State.WAITING_1 + State.PAUSED + State.AUTO_SCROLLING");
			},
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.LEFT, MouseEvent.MIDDLE):
						this.setState(State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):
						this.setState(State.AUTO_SCROLLING);
						break;
				}
			},
			wheel: (w) => {
				switch (w.buttons) {
					case MouseEvent.LEFT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.heavyAutoScroll);
						break;
					case MouseEvent.RIGHT:
						this.root.plan.autoScroll.setAutoScroll(0, this.root.rule.lightAutoScroll);
						break;
				}
			}
		}));

	}
}