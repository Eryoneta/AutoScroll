//STATES
const State = {
	//STATE
	INACTIVE: 0,							//NÃO ESTÁ NA TELA
	HORIZONTAL_SCROLLING: 1,				//O MOUSE_WHEEL_ROLL MOVE O HORIZONTAL_SCROLL
	DRAGGING: 2,							//MOUSE_DRAG MOVE OS SCROLLS
	AUTO_DRAGGING: 3,						//MOUSE_MOVE MOVE OS SCROLLS
	AUTO_SCROLLING: 4,						//OS SCROLLS SÃO MOVIDOS AUTOMATICAMENTE
	DEFAULT_AUTOSCROLLING: 5,				//AUTOSCROLL PADRÃO
	//STATE MODIFIERS
	PAUSED: 10,								//ATIVO, MAS PARADO
	WAITING: 20								//ESPERANDO INPUT
}
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
	_loadCursor(element, following) {
		const isInNeedOfScrollX = this.root.rule.isInNeedOfScrollX(element);
		const isInNeedOfScrollY = this.root.rule.isInNeedOfScrollY(element);
		const isInNeedOfBothScroll = (isInNeedOfScrollX && isInNeedOfScrollY);
		switch (true) {
			case isInNeedOfBothScroll:
				this.root.plan.loadCursor(CursorMode.FREE, following, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
			case isInNeedOfScrollX:
				this.root.plan.loadCursor(CursorMode.HORIZONTAL, following, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
			case isInNeedOfScrollY:
				this.root.plan.loadCursor(CursorMode.VERTICAL, following, this.root.plan.autoScroll.getAnchor(), this.root.plan.autoScroll.getCursor());
				break;
		}
	}
	//(STATES)
	setState(state) {
		const node = this._states[state];
		this.root.listeners.mousedown = node.mousedown;
		this.root.listeners.mouseup = node.mouseup;
		this.root.listeners.wheel = node.wheel;
		this.root.listeners.mousemove = node.mousemove;
		this.root.listeners.keydown = node.keydown;
		this.root.listeners.keyup = node.keyup;
		node.statechange();		//EXECUTA NODE_CHANGE
	}
	_addState(state,
		{
			statechange = () => { },
			mousedown = () => { },
			mouseup = () => { },
			wheel = () => { },
			mousemove = () => { },
			keydown = () => { },
			keyup = () => { }
		}
	) {
		const newNode = {
			state: state,
			statechange: statechange,
			mousedown: mousedown,
			mouseup: mouseup,
			wheel: wheel,
			mousemove: mousemove,
			keydown: keydown,
			keyup: keyup
		}
		this._states[newNode.state] = newNode;
	}
	_loadFlow() {
		//[INACTIVE]
		this._addState(State.INACTIVE, {
			statechange: () => {
				this.root.plan.autoScroll.clear();	//RESETA TUDO
			},
			mousedown: (m) => {
				switch (true) {
					case MouseEvent.match(m, MouseEvent.MIDDLE):
						this.root.plan.autoScroll.loadTargetsWithScrollableElements(m.target);	//PARA O DRAG
						if (!this.root.plan.autoScroll.hasTargets()) return;
						this.root.plan.stopEvent(m);
						this.root.plan.disableDefaultActions();
						this.root.plan.autoScroll.setAnchor(m.clientX, m.clientY);
						this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
						this.setState(State.WAITING + State.INACTIVE);
						break;
					case MouseEvent.match(m, MouseEvent.RIGHT):

						break;
				}
			}
		});
		//[WAITING+INACTIVE]
		this._addState(State.WAITING + State.INACTIVE, {
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
		});
		//[AUTO_DRAGGING]
		this._addState(State.AUTO_DRAGGING, {
			statechange: () => {
				this.root.plan.autoScroll.startAutoDrag();
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), true);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getRootTarget(), true);
			}
		});
		//[DRAGGING]
		this._addState(State.DRAGGING, {
			statechange: () => {
				this.root.plan.autoScroll.startAutoDrag();
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), true);
			},
			mousemove: (m) => {
				this.root.plan.autoScroll.setCursor(m.clientX, m.clientY);
				this._loadCursor(this.root.plan.autoScroll.getForegroundTarget(), true);
			}
		});
	}
}