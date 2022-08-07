class CursorAnimation{
//VARS
	static cursor={
		image: {
			basePath: "Scrolls",
			direction: {
				center: 	{ name: "M", modes: ["H", "V", "HV"] },
				up: 		{ name: "C", modes: ["S", "E"] },
				upRight: 	{ name: "C", modes: ["S", "E"] },
				right: 		{ name: "C", modes: ["S", "E"] },
				downRight: 	{ name: "C", modes: ["S", "E"] },
				down: 		{ name: "B", modes: ["S", "E"] },
				downLeft: 	{ name: "C", modes: ["S", "E"] },
				left: 		{ name: "C", modes: ["S", "E"] },
				upLeft: 	{ name: "C", modes: ["S", "E"] }
			},
			frames: [ "1", "2", "3", "4" ],
			anchor: {
				name: "F"
			},
			fileType: "png"
		},
		animation: {
			frames: [],
			duration: "3s",
			iterationCount: "infinite"
		}
	};
	innerStyle;
	static CursorMode={
		FREE: 0, HORIZONTAL: 1, VERTICAL: 2
	};
//MAIN
	constructor(){
		cursor.animation.frames = [
			{time: 0.000, name: cursor.image.frames[0]},	//BLINK START
			{time: 23.35, name: cursor.image.frames[0]},
			{time: 23.36, name: cursor.image.frames[1]},
			{time: 25.23, name: cursor.image.frames[2]},
			{time: 27.10, name: cursor.image.frames[3]},
			{time: 28.97, name: cursor.image.frames[2]},
			{time: 30.84, name: cursor.image.frames[1]},
			{time: 32.71, name: cursor.image.frames[0]},	//BLINK END
			{time: 79.42, name: cursor.image.frames[0]},	//BLINK START
			{time: 79.43, name: cursor.image.frames[1]},
			{time: 81.30, name: cursor.image.frames[2]},
			{time: 83.17, name: cursor.image.frames[3]},
			{time: 85.04, name: cursor.image.frames[2]},
			{time: 86.91, name: cursor.image.frames[1]},	//BLINK END
			{time: 88.78, name: cursor.image.frames[0]},	//BLINK START
			{time: 90.65, name: cursor.image.frames[1]},
			{time: 92.52, name: cursor.image.frames[2]},
			{time: 94.39, name: cursor.image.frames[3]},
			{time: 96.26, name: cursor.image.frames[2]},
			{time: 98.13, name: cursor.image.frames[1]},
			{time: 100.0, name: cursor.image.frames[0]}		//BLINK END
		];
	}
//FUNCS
	generateCursorAnimations(innerStyle){
		this.innerStyle=innerStyle;
		innerStyle.setProperty("animation-duration", cursor.animation.duration);
		innerStyle.setProperty("animation-iteration-count", cursor.animation.iterationCount);
		let keyframes="";
		for(let dir in cursor.image.direction){
			const direction=cursor.image.direction[dir];
			for(let mode of direction.modes){
				keyframes+="@keyframes "+direction.name+"_"+mode+" {";		//EX: "@keyframes C_S {"
				keyframes+="\n";
				for(let frame of cursor.animation.frames){
					const cursorName=(direction.name+"/"+mode+"/"+frame.name);
					const cursorPath=cursor.image.basePath+"/"+cursorName+"."+cursor.image.fileType;
					keyframes+=("	"+frame.time+"%{ cursor:url('"+chrome.runtime.getURL(cursorPath)+"')16 16, auto; }");
							//EX:  "	0.000%{ cursor:url('Scrolls/C/S/1.png')16 16, auto; }"
					keyframes+="\n";
				}
				keyframes+="}";		//EX: }
				keyframes+="\n";
			}
		}
		return keyframes;
	}
	loadCursor(backgroundPosition={x:0,y:0}){
		if(!innerStyle)return;
		setTimeout(()=>_showBackground(backgroundPosition),10);		//DELAY PARA APARECER APÓS O CURSOR
		_showCursor();
	}
	unloadCursor(){
		if(!innerStyle)return;
		_hideBackground();
		setTimeout(()=>_hideCursor(),10);		//DELAY PARA DESAPARECER APÓS O FUNDO
	}
		_showBackground(position={x:0,y:0}){
			const cursorPath=cursor.image.basePath+"/"+cursor.image.anchor.name+cursor.image.fileType;
			innerStyle.setProperty("background-image","url('"+chrome.runtime.getURL(cursorPath)+"')");
			innerStyle.setProperty("background-position",position.x+"px "+position.y+"px");
			innerStyle.removeProperty("display");
		}
		_hideBackground(){
			innerStyle.removeProperty("background-image");
			innerStyle.removeProperty("background-position");
			innerStyle.setProperty("display","none");
		}
		_showCursor(cursorMode=CursorMode.FREE,middle=true,distanceFromAnchor=0,angleOnAnchor=0){
			//O 
			
		}
		_hideCursor(){
			innerStyle.removeProperty("cursor");
			innerStyle.removeProperty("animationName");					//TODO: CHECK!
		}
		
		
		
		setCursor(esperando){
			const difX=autoScroll.mouseX-autoScroll.centroX;
			const difY=autoScroll.mouseY-autoScroll.centroY;
			const distancia=Math.sqrt(difX*difX+difY*difY);
			const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
			if(distancia<=restRadius)esperando=true;//DENTRO DA ÁREA DE REPOUSO
			const horizontal=((autoScroll.elemento.scroll.scrollWidth-autoScroll.elemento.tag.clientWidth)!==0);
			const vertical=((autoScroll.elemento.scroll.scrollHeight-autoScroll.elemento.tag.clientHeight)!==0);
			if(!horizontal&&vertical){			//VERTICAL
				status="V";//VERTICAL
				if(esperando){
					nome="M";//MEIO
				}else{
					if(angulo===0||angulo===180)nome="M";			//MEIO
						else if(angulo>0&&angulo<180)nome="B";		//BAIXO
							else nome= "C";							//CIMA
				}
			}else if(horizontal&&!vertical){	//HORIZONTAL
				status="H";//HORIZONTAL
				if(esperando){
					nome="M";//MEIO
				}else{
					const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
					if(angulo===90||angulo===270)nome="M";			//MEIO
						else if(angulo>90&&angulo<270)nome="E";		//ESQUERDA
							else nome= "D";							//DIREITA
				}
			}else{								//HORIZONTAL-VERTICAL
				status="HV";//HORIZONTAL-VERTICAL
				if(esperando){
					nome="M";//MEIO
				}else{
					const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
					if(angulo<30||angulo>=330)nome="D";							//DIREITA
						else if(angulo<60)nome="BD";							//BAIXO-DIREITA
							else if(angulo<120)nome="B";						//BAIXO
								else if(angulo<150)nome="BE";					//BAIXO-ESQUERDA
									else if(angulo<210)nome="E";				//ESQUERDA
										else if(angulo<240)nome="CE";			//CIMA-ESQUERDA
											else if(angulo<300)nome="C";		//CIMA
												else nome= "CD";				//CIMA-DIREITA
				}
				
			}
			if(nome!=="M"){
				if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_DRAGGING))status="E";//ESPERANDO
					else status="S";//SEGUINDO
			}
			inner.style.animationName=nome+"_"+status;
		}
}



//VARS
	// cursor={
		// image: {
			// basePath: "Scrolls",
			// direction: {
				// center: 	{ name: "M", modes: ["H", "V", "HV"] },
				// up: 		{ name: "C", modes: ["S", "E"] },
				// upRight: 	{ name: "C", modes: ["S", "E"] },
				// right: 		{ name: "C", modes: ["S", "E"] },
				// downRight: 	{ name: "C", modes: ["S", "E"] },
				// down: 		{ name: "B", modes: ["S", "E"] },
				// downLeft: 	{ name: "C", modes: ["S", "E"] },
				// left: 		{ name: "C", modes: ["S", "E"] },
				// upLeft: 	{ name: "C", modes: ["S", "E"] }
			// },
			// frames: [ "1", "2", "3", "4" ],
			// anchor: {
				// name: "F"
			// },
			// fileType: "png"
		// },
		// animation: {
			// frames: [],
			// duration: "3s",
			// iterationCount: "infinite"
		// }
	// };
	// var innerStyle;
	// const CursorMode={
		// FREE: 0, HORIZONTAL: 1, VERTICAL: 2
	// };
//MAIN
	// (function(){
		// cursor.animation.frames = [
			// {time: 0.000, name: cursor.image.frames[0]},	//BLINK START
			// {time: 23.35, name: cursor.image.frames[0]},
			// {time: 23.36, name: cursor.image.frames[1]},
			// {time: 25.23, name: cursor.image.frames[2]},
			// {time: 27.10, name: cursor.image.frames[3]},
			// {time: 28.97, name: cursor.image.frames[2]},
			// {time: 30.84, name: cursor.image.frames[1]},
			// {time: 32.71, name: cursor.image.frames[0]},	//BLINK END
			// {time: 79.42, name: cursor.image.frames[0]},	//BLINK START
			// {time: 79.43, name: cursor.image.frames[1]},
			// {time: 81.30, name: cursor.image.frames[2]},
			// {time: 83.17, name: cursor.image.frames[3]},
			// {time: 85.04, name: cursor.image.frames[2]},
			// {time: 86.91, name: cursor.image.frames[1]},	//BLINK END
			// {time: 88.78, name: cursor.image.frames[0]},	//BLINK START
			// {time: 90.65, name: cursor.image.frames[1]},
			// {time: 92.52, name: cursor.image.frames[2]},
			// {time: 94.39, name: cursor.image.frames[3]},
			// {time: 96.26, name: cursor.image.frames[2]},
			// {time: 98.13, name: cursor.image.frames[1]},
			// {time: 100.0, name: cursor.image.frames[0]}		//BLINK END
		// ];
	// })();
//FUNCS
	// function generateCursorAnimations(innerStyle){
		// this.innerStyle=innerStyle;
		// innerStyle.setProperty("animation-duration", cursor.animation.duration);
		// innerStyle.setProperty("animation-iteration-count", cursor.animation.iterationCount);
		// let keyframes="";
		// for(let dir in cursor.image.direction){
			// const direction=cursor.image.direction[dir];
			// for(let mode of direction.modes){
				// keyframes+="@keyframes "+direction.name+"_"+mode+" {";		//EX: "@keyframes C_S {"
				// keyframes+="\n";
				// for(let frame of cursor.animation.frames){
					// const cursorName=(direction.name+"/"+mode+"/"+frame.name);
					// const cursorPath=cursor.image.basePath+"/"+cursorName+"."+cursor.image.fileType;
					// keyframes+=("	"+frame.time+"%{ cursor:url('"+chrome.runtime.getURL(cursorPath)+"')16 16, auto; }");
							EX:  "	0.000%{ cursor:url('Scrolls/C/S/1.png')16 16, auto; }"
					// keyframes+="\n";
				// }
				// keyframes+="}";		//EX: }
				// keyframes+="\n";
			// }
		// }
		// return keyframes;
	// }
	// function loadCursor(backgroundPosition={x:0,y:0}){
		// if(!innerStyle)return;
		// setTimeout(()=>_showBackground(backgroundPosition),10);		//DELAY PARA APARECER APÓS O CURSOR
		// _showCursor();
	// }
	// function unloadCursor(){
		// if(!innerStyle)return;
		// _hideBackground();
		// setTimeout(()=>_hideCursor(),10);		//DELAY PARA DESAPARECER APÓS O FUNDO
	// }
		// function _showBackground(position={x:0,y:0}){
			// const cursorPath=cursor.image.basePath+"/"+cursor.image.anchor.name+cursor.image.fileType;
			// innerStyle.setProperty("background-image","url('"+chrome.runtime.getURL(cursorPath)+"')");
			// innerStyle.setProperty("background-position",position.x+"px "+position.y+"px");
			// innerStyle.removeProperty("display");
		// }
		// function _hideBackground(){
			// innerStyle.removeProperty("background-image");
			// innerStyle.removeProperty("background-position");
			// innerStyle.setProperty("display","none");
		// }
		// function _showCursor(cursorMode=CursorMode.FREE,middle=true,distanceFromAnchor=0,angleOnAnchor=0){
			
		// }
		// function _hideCursor(){
			// innerStyle.removeProperty("cursor");
			// innerStyle.removeProperty("animationName");					//TODO: CHECK!
		// }
		
		
		
	// function setCursor(esperando){
		// const difX=autoScroll.mouseX-autoScroll.centroX;
		// const difY=autoScroll.mouseY-autoScroll.centroY;
		// const distancia=Math.sqrt(difX*difX+difY*difY);
		// const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
		// if(distancia<=restRadius)esperando=true;//DENTRO DA ÁREA DE REPOUSO
		// const horizontal=((autoScroll.elemento.scroll.scrollWidth-autoScroll.elemento.tag.clientWidth)!==0);
		// const vertical=((autoScroll.elemento.scroll.scrollHeight-autoScroll.elemento.tag.clientHeight)!==0);
		// if(!horizontal&&vertical){			//VERTICAL
			// status="V";//VERTICAL
			// if(esperando){
				// nome="M";//MEIO
			// }else{
				// if(angulo===0||angulo===180)nome="M";			//MEIO
					// else if(angulo>0&&angulo<180)nome="B";		//BAIXO
						// else nome= "C";							//CIMA
			// }
		// }else if(horizontal&&!vertical){	//HORIZONTAL
			// status="H";//HORIZONTAL
			// if(esperando){
				// nome="M";//MEIO
			// }else{
				// const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
				// if(angulo===90||angulo===270)nome="M";			//MEIO
					// else if(angulo>90&&angulo<270)nome="E";		//ESQUERDA
						// else nome= "D";							//DIREITA
			// }
		// }else{								//HORIZONTAL-VERTICAL
			// status="HV";//HORIZONTAL-VERTICAL
			// if(esperando){
				// nome="M";//MEIO
			// }else{
				// const angulo=(Math.atan(difY/difX)/(Math.PI/180))+(difX<0?180:difY<0?360:0);
				// if(angulo<30||angulo>=330)nome="D";							//DIREITA
					// else if(angulo<60)nome="BD";							//BAIXO-DIREITA
						// else if(angulo<120)nome="B";						//BAIXO
							// else if(angulo<150)nome="BE";					//BAIXO-ESQUERDA
								// else if(angulo<210)nome="E";				//ESQUERDA
									// else if(angulo<240)nome="CE";			//CIMA-ESQUERDA
										// else if(angulo<300)nome="C";		//CIMA
											// else nome= "CD";				//CIMA-DIREITA
			// }
			
		// }
		// if(nome!=="M"){
			// if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_DRAGGING))status="E";//ESPERANDO
				// else status="S";//SEGUINDO
		// }
		// inner.style.animationName=nome+"_"+status;
	// }