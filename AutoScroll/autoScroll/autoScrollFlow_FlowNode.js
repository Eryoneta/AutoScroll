//STATES
const State = {
	//STATES
	INACTIVE: 0,							//NÃO ESTÁ NA TELA
	HORIZONTAL_SCROLLING: 1,				//O MOUSE_WHEEL_ROLL MOVE O HORIZONTAL_SCROLL
	DRAGGING: 2,							//MOUSE_DRAG MOVE OS SCROLLS
	AUTO_DRAGGING: 3,						//MOUSE_MOVE MOVE OS SCROLLS
	AUTO_SCROLLING: 4,						//OS SCROLLS SÃO MOVIDOS AUTOMATICAMENTE
	DEFAULT_AUTOSCROLLING: 5,				//AUTOSCROLL PADRÃO
	//STATE ALTERNATORS
	PAUSED: 10,								//ATIVO, MAS PARADO
	//STATE MODIFIERS
	WAITING_1: 100,							//ESPERANDO INPUT 1
	WAITING_2: 200,							//ESPERANDO INPUT 2
	WAITING_3: 300,							//ESPERANDO INPUT 3
	//STATE MODIFIER MODIFIERS
	SUBWAITING_1: 100,						//ESPERANDO SUBINPUT 1
	SUBWAITING_2: 200,						//ESPERANDO SUBINPUT 2
	SUBWAITING_3: 300						//ESPERANDO SUBINPUT 3
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