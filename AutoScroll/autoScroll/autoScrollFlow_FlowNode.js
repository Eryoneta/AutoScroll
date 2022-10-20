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
//FLOW_NODE
class FlowNode {
	//VARS
	state = State.INACTIVE;
	stateload = () => { };
	listenerBundle = new ListenerBundle();
	//MAIN
	constructor(state, {
		stateload = () => { },
		mousedown = () => { },
		mouseup = () => { },
		wheel = () => { },
		mousemove = () => { },
		keydown = () => { },
		keyup = () => { }
	} = {}) {
		this.state = state;
		this.stateload = stateload;
		this.listenerBundle.mousedown = mousedown;
		this.listenerBundle.mouseup = mouseup;
		this.listenerBundle.wheel = wheel;
		this.listenerBundle.mousemove = mousemove;
		this.listenerBundle.keydown = keydown;
		this.listenerBundle.keyup = keyup;
	}
}