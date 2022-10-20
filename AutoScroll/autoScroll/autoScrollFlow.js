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
				this.root.plan.autoScroll.clear();	//RESETA TUDO
			},
			mousedown: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);	//PARA O DRAG FUNCIONAR
						if (this.root.plan.autoScroll.hasTargets()) {
							this.root.plan.stopEvent(m);
							this.root.plan.disableDefaultActions();
							this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);
							this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
							this.setState(State.WAITING + State.INACTIVE);
						}
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):

						break;
				}
			}
		}));
		//[WAITING+INACTIVE]
		this._addState(new FlowNode(State.WAITING + State.INACTIVE, {
			mouseup: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);
						if (!this.root.plan.autoScroll.hasTargets()) return;
						this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);
						this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
						this.setState(State.AUTO_DRAGGING);
						break;
				}
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				if (this.root.plan.autoScroll.isOutsideRestRadious()) this.setState(State.DRAGGING);
			}
		}));
		//[AUTO_DRAGGING]
		this._addState(new FlowNode(State.AUTO_DRAGGING, {
			stateload: () => {
				this.root.plan.autoScroll.startAutoDrag();
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.FOLLOWING);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), CursorMode.FOLLOWING);
			}
		}));
		//[DRAGGING]
		this._addState(new FlowNode(State.DRAGGING, {
			stateload: () => {
				this.root.plan.autoScroll.startAutoDrag();
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), CursorMode.FOLLOWING);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), CursorMode.FOLLOWING);
			}
		}));
	}
}