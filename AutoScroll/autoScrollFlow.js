//STATES
	const State={
	//STATE
		INACTIVE:0,								//NÃO ESTÁ NA TELA
		HORIZONTAL_SCROLLING:1,					//O MOUSE_WHEEL_ROLL MOVE O HORIZONTAL_SCROLL
		DRAGGING:2,								//MOUSE_DRAG MOVE OS SCROLLS
		AUTO_DRAGGING:3,						//MOUSE_MOVE MOVE OS SCROLLS
		AUTO_SCROLLING:4,						//OS SCROLLS SÃO MOVIDOS AUTOMATICAMENTE
		DEFAULT_AUTOSCROLLING:5,				//AUTOSCROLL PADRÃO
	//STATE MODIFIERS
		PAUSED:10,								//ATIVO, MAS PARADO
		WAITING:20								//ESPERANDO INPUT
	}
//STATES NODES
	class StateNode{
		state=State.INACTIVE;
		statechange=()=>{};
		mousedown=()=>{};
		mouseup=()=>{};
		wheel=()=>{};
		mousemove=()=>{};
		keydown=()=>{};
		keyup=()=>{};
	//MAIN
		constructor(
			state,
			{
				statechange=()=>{},
				mousedown=()=>{},
				mouseup=()=>{},
				wheel=()=>{},
				mousemove=()=>{},
				keydown=()=>{},
				keyup=()=>{}
			}
		){
			this.state=state;
			this.statechange=statechange;
			this.mousedown=mousedown;
			this.mouseup=mouseup;
			this.wheel=wheel;
			this.mousemove=mousemove;
			this.keydown=keydown;
			this.keyup=keyup;
		}
	}
//LISTA DE STATES
	const states={};
	function addState(node){
		states[node.state]=node;
	}
	function setState(state){
		const node=states[state];
		listeners.mousedown=node.mousedown;
		listeners.mouseup=node.mouseup;
		listeners.wheel=node.wheel;
		listeners.mousemove=node.mousemove;
		listeners.keydown=node.keydown;
		listeners.keyup=node.keyup;
		node.statechange();		//EXECUTA NODE_CHANGE
	}
//MAIN
	(function(){
	//[INACTIVE]
		addState(new StateNode(State.INACTIVE,{
			mousedown:(m)=>{
				if(Mouse.match(m,Mouse.MIDDLE)){
					if(isValidElement(m)){
						setAutoScrollElement(m.target);
						if(autoScroll.hasTarget()){
							stopEvent(m);
							autoScroll.setAnchor(m.clientX,m.clientY);
							disableDefaultActions();
							
							// ativar(elemento,mouseDownX,mouseDownY);
							
							setState(State.WAITING+State.INACTIVE);
						}
					}
				}else if(Mouse.match(m,Mouse.RIGHT)){
					
				}
			}
		}));
	//[WAITING+INACTIVE]
		addState(new StateNode(State.WAITING+State.INACTIVE,{
			statechange:()=>{
				alert("STATUS CHANGED!");
			}
		}));
	})();