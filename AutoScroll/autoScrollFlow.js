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
//AUTOSCROLL_FLOW
	class AutoScrollFlow{
	//VARS
		root;
				_states={};
	//MAIN
		constructor(autoScroll){
			this.root=autoScroll;
		}
	//FUNCS
		init(){
			this._loadFlow();
			this.setState(State.INACTIVE);
		}
	//(STATES)
		setState(state){
			const node=this._states[state];
			this.root.listeners.mousedown=node.mousedown;
			this.root.listeners.mouseup=node.mouseup;
			this.root.listeners.wheel=node.wheel;
			this.root.listeners.mousemove=node.mousemove;
			this.root.listeners.keydown=node.keydown;
			this.root.listeners.keyup=node.keyup;
			node.statechange();		//EXECUTA NODE_CHANGE
		}
				_addState(state,
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
					const newNode={
						state:state,
						statechange:statechange,
						mousedown:mousedown,
						mouseup:mouseup,
						wheel:wheel,
						mousemove:mousemove,
						keydown:keydown,
						keyup:keyup
					}
					this._states[newNode.state]=newNode;
				}
				_loadFlow(){
				//[INACTIVE]
					this._addState(State.INACTIVE,{
						mousedown:(m)=>{
							if(MouseEvent.match(m,MouseEvent.MIDDLE)){
								if(this.root.isValidElement(m)){
									this.root.setAutoScrollElement(m.target);
									if(this.root.autoScroll.hasTarget()){
										this.root.stopEvent(m);
										this.root.autoScroll.setAnchor(m.clientX,m.clientY);
										this.root.disableDefaultActions();
										// startAnimation();
										this.setState(State.WAITING+State.INACTIVE);
									}
								}
							}else if(MouseEvent.match(m,MouseEvent.RIGHT)){
								
							}
						}
					});
				//[WAITING+INACTIVE]
					this._addState(State.WAITING+State.INACTIVE,{
						statechange:()=>{
							alert("STATUS CHANGED!");
						}
					});
				}
	}