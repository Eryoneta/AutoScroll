//VARS
//VARS: MOUSE & KEYBOARD
	const Mouse={
		LEFT:0,MIDDLE:1,RIGHT:2,
		match:(mouseEvent,...buttons)=>{
			for(let button of buttons)if(mouseEvent.button===button)return true;
			return false;
		}
	}
	const Key={
		A:65,ENTER:13,SPACE:32,
		UP_ARROW:38,DOWN_ARROW:40,RIGHT_ARROW:39,LEFT_ARROW:37,
		NUM_0:48,NUM_1:49,NUM_2:50,NUM_3:51,NUM_4:52,NUM_5:53,NUM_6:54,NUM_7:55,NUM_8:56,NUM_9:57,
		match:(keyEvent,...keys)=>{
			for(let key of keys)if(keyEvent.keyCode===key)return true;
			return false;
		}
	};
//VARS: AUTODSCROLL
	const autoScroll={
	//ANIMATION
		animationLoop: null,
	//ELEMENTS
		target: null,
		rootTarget: null,
		hasTarget:()=>{
			return (autoScroll.target!==null||autoScroll.rootTarget!==null);
		},
		clearTarget:()=>{
			autoScroll.target=null;
			autoScroll.rootTarget=null;
		},
	//ANCHOR
		anchor: {
			x: 0,
			y: 0
		},
		setAnchor: (x,y)=>{
			autoScroll.anchor.x=x;
			autoScroll.anchor.y=y;
		},
	//DIRECTION
		direction: {
			x: 0,
			y: 0
		},
		setDirection: (x,y)=>{
			autoScroll.direction.x=x;
			autoScroll.direction.y=y;
		}
	};
//VARS: MOUSE
	const mouse={
		x: 0,
		y: 0
	};
	function setMouse(x,y){
		mouse.x=x;
		mouse.y=y;
	}
//VARS: LISTENERS
	const listeners={
		mousedown:(m)=>{},
		mouseup:(m)=>{},
		wheel:(m)=>{},
		mousemove:(m)=>{},
		keydown:(m)=>{},
		keyup:(m)=>{}
	};
	function _bindListeners(){
		addEventListener("mousedown",(m)=>listeners.mousedown(m),true);
		addEventListener("mouseup",(m)=>listeners.mouseup(m),true);
		addEventListener("wheel",(m)=>listeners.wheel(m),true);
		addEventListener("mousemove",(m)=>listeners.mousemove(m),true);
		addEventListener("keydown",(m)=>listeners.keydown(m),true);
		addEventListener("keyup",(m)=>listeners.keyup(m),true);
	}
//MAIN
	(function(){
		_bindListeners();
		setState(State.INACTIVE);
	})();
//FUNCS
//FUNCS: LISTENERS
	function stopEvent(event){		//IMPEDE DEFAULT_EVENTS
		event.preventDefault();
		event.stopImmediatePropagation();
		event.stopPropagation();
	}
	function disableDefaultActions(){
		addEventListener("mousedown",stopEvent,true);
		addEventListener("mouseup",stopEvent,true);
		addEventListener("wheel",stopEvent,{passive:false});
		addEventListener("mousemove",stopEvent,true);
		addEventListener("keydown",stopEvent,true);
		addEventListener("keyup",stopEvent,true);
		addEventListener("contextmenu",stopEvent,true);	//IMPEDE DEFAUL_TOOLBOX
	}
	function ableDefaultActions(){
		removeEventListener("mousedown",stopEvent,true);
		removeEventListener("mouseup",stopEvent,true);
		removeEventListener("wheel",stopEvent,{passive:false});
		removeEventListener("mousemove",stopEvent,true);
		removeEventListener("keydown",stopEvent,true);
		removeEventListener("keyup",stopEvent,true);
		removeEventListener("contextmenu",stopEvent,true);	//PERMITE DEFAUL_TOOLBOX
	}
//FUNCS: VALIDAÇÃO
	function isValidElement(mouseEvent){
		return (mouseEvent.clientX<htmlTag.clientWidth&&
				mouseEvent.clientY<htmlTag.clientHeight&&
				_isValidElement(mouseEvent.target));
	}
		function _isValidElement(element){
			if(element===document||element===htmlTag||element===bodyTag)return true;	//DOC/HTML/BODY
			if(element.isContentEditable)return false;					//EDITORES
			if(element.localName==="a"&&element.href)return false;		//<A> COM LINK
			if(element.localName==="textarea")return false;				//<TEXTAREA>
			if(element.localName==="input")return false;				//<INPUT>
			return _isValidElement(element.parentNode);		//PASSA PARA VERIFICAR O ELEMENTO-PAI
		}
//FUNCS: LOCALIZAR SCROLLBAR
	function setAutoScrollElement(element){
		autoScroll.target=_getElementWithScroll(element);
		autoScroll.rootTarget=_getRootElementWithScroll(element);
		if(autoScroll.target===null)autoScroll.target=autoScroll.rootTarget;
		if(autoScroll.rootTarget===null)autoScroll.rootTarget=autoScroll.target;
	}
		function _getElementWithScroll(element){
			console.log(element);
			console.log(window);
			if(element===window)return null;
			const elementStyle=getComputedStyle(element);
			const allowScrollOnX=(element.scrollWidth>element.clientWidth);
			const allowScrollOnY=(element.scrollHeight>element.clientHeight);
			if(_allowScroll(elementStyle)&&(allowScrollOnX||allowScrollOnY))return element;
			if(element===document||element===htmlTag||element===bodyTag)return null;
			return _getElementWithScroll(element.parentNode);	//PASSA PARA VERIFICAR O ELEMENTO-PAI
		}
		function _getRootElementWithScroll(element){
			if(element===document||element===htmlTag||element===bodyTag)return _getElementWithScroll(element);
			if(_getElementWithScroll(element.parentNode)!==null){
				return _getRootElementWithScroll(element.parentNode);
			}else return _getElementWithScroll(element);
		}
		function _allowScroll(elementStyle){
			if(elementStyle.overflow==="hidden")return false;
			if(elementStyle.overflowX==="hidden"&&elementStyle.overflowY==="hidden")return false;
			return true;
		}
