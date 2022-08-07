//CURSOR_MODE
	const CursorMode={
		FIXED: 0, FREE: 1, HORIZONTAL: 2, VERTICAL: 3
	};
//AUTOSCROLL_VIEW
	class AutoScrollView{
	//VARS
		root;
	//(ELEMENTS)
		htmlTag=document.documentElement;					//USADO PARA DETECTAR SCROLLBAR
		bodyTag=(document.body?document.body:this.htmlTag);		//USADO PARA DETECTAR SCROLLBAR
		viewElement=document.createElement("div");			//USADO PARA O VISUAL
	//(CURSOR)
				_cursor={
					image: {
						basePath: "Scrolls",
						anchor: {
							name: "F"	//EX: "Scrolls/F.png"
						},
						direction: {
							center: 	{ name: "M", modes: ["H", "V", "HV"] },
							up: 		{ name: "C", modes: ["S", "E"] },		//EX: "Scrolls/C/S/2.png"
							upRight: 	{ name: "C", modes: ["S", "E"] },
							right: 		{ name: "C", modes: ["S", "E"] },
							downRight: 	{ name: "C", modes: ["S", "E"] },
							down: 		{ name: "B", modes: ["S", "E"] },
							downLeft: 	{ name: "C", modes: ["S", "E"] },
							left: 		{ name: "C", modes: ["S", "E"] },
							upLeft: 	{ name: "C", modes: ["S", "E"] }
						},
						frames: [ "1", "2", "3", "4" ],
						fileType: "png"
					},
					animation: {
						frames: [],
						duration: "3s",
						iterationCount: "infinite"
					}
				};
	//MAIN
		constructor(autoScroll){
			this.root=autoScroll;
			this._fillFrames();
		}
	//FUNCS
		init(){
			this._appendAutoScrollToHTML(this.viewElement);
		}
	//(CURSOR)
		loadCursor(cursorMode=CursorMode.FREE,anchorLocation={x:0,y:0},cursorLocation={x:0,y:0}){
			const innerStyle=this.viewElement.style;
			if(!innerStyle)return;
			setTimeout(()=>this._showBackground(innerStyle,anchorLocation),10);		//DELAY PARA APARECER APÓS O CURSOR
			this._showCursor(innerStyle,cursorMode,anchorLocation,cursorLocation);
		}
		unloadCursor(){
			const innerStyle=this.viewElement.style;
			if(!innerStyle)return;
			this._hideBackground(innerStyle);
			setTimeout(()=>this._hideCursor(innerStyle),10);		//DELAY PARA DESAPARECER APÓS O FUNDO
		}
	//(FRAMES)
				_fillFrames(){	//NÃO PODEM RECEBER frames ANTES DE INICIAR, APENAS DEPOIS
					const frames=this._cursor.image.frames;
					this._cursor.animation.frames = [	//BLINK, BLINK-BLINK
						{time: 0.000, name: frames[0]},	//BLINK START
						{time: 23.35, name: frames[0]},
						{time: 23.36, name: frames[1]},
						{time: 25.23, name: frames[2]},
						{time: 27.10, name: frames[3]},
						{time: 28.97, name: frames[2]},
						{time: 30.84, name: frames[1]},
						{time: 32.71, name: frames[0]},	//BLINK END
						{time: 79.42, name: frames[0]},	//BLINK START
						{time: 79.43, name: frames[1]},
						{time: 81.30, name: frames[2]},
						{time: 83.17, name: frames[3]},
						{time: 85.04, name: frames[2]},
						{time: 86.91, name: frames[1]},	//BLINK END
						{time: 88.78, name: frames[0]},	//BLINK START
						{time: 90.65, name: frames[1]},
						{time: 92.52, name: frames[2]},
						{time: 94.39, name: frames[3]},
						{time: 96.26, name: frames[2]},
						{time: 98.13, name: frames[1]},
						{time: 100.0, name: frames[0]}	//BLINK END
					];
				}
	//(INJEÇÃO)
				_appendAutoScrollToHTML(inner){
					this.htmlTag.appendChild(this._createAnchor(inner));
				}
				_createAnchor(inner){
					const outer=document.createElement("auto-scroll");
					const shadow=outer.attachShadow({mode:"open"});
					shadow.appendChild(this._createAnchorHTML(inner));
					return outer;
				}
				_createAnchorHTML(inner){
					inner.style.setProperty("transform","translateZ(0)");
					inner.style.setProperty("display","none");
					inner.style.setProperty("position","fixed");
					inner.style.setProperty("left","0px");
					inner.style.setProperty("top","0px");
					inner.style.setProperty("width","100%");
					inner.style.setProperty("height","100%");
					inner.style.setProperty("z-index","2147483647");
					inner.style.setProperty("background-repeat","no-repeat");
					inner.appendChild(this._createAnchorCSS(inner));
					return inner;
				}
				_createAnchorCSS(inner){
					const styler=document.createElement("style");	//ANIMAÇÃO DE CURSOR É SEPARADA EM <style>
					styler.innerHTML=this._generateCursorAnimations(inner);
					return styler;
				}
				_generateCursorAnimations(inner){
					inner.style.setProperty("animation-duration", this._cursor.animation.duration);
					inner.style.setProperty("animation-iteration-count", this._cursor.animation.iterationCount);
					let keyframes="";
					for(let dir in this._cursor.image.direction){
						const direction=this._cursor.image.direction[dir];
						for(let mode of direction.modes){
							keyframes+="@keyframes "+direction.name+"_"+mode+" {";		//EX: "@keyframes C_S {"
							keyframes+="\n";
							for(let frame of this._cursor.animation.frames){
								const cursorName=(direction.name+"/"+mode+"/"+frame.name);
								const cursorPath=this._cursor.image.basePath+"/"+cursorName+"."+this._cursor.image.fileType;
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
	//(SHOW/HIDE)
				_showBackground(innerStyle,location={x:0,y:0}){
					const cursorPath=this._cursor.image.basePath+"/"+this._cursor.image.anchor.name+this._cursor.image.fileType;
					innerStyle.setProperty("background-image","url('"+chrome.runtime.getURL(cursorPath)+"')");
					innerStyle.setProperty("background-position",location.x+"px "+location.y+"px");
					innerStyle.removeProperty("display");
				}
				_hideBackground(innerStyle){
					innerStyle.removeProperty("background-image");
					innerStyle.removeProperty("background-position");
					innerStyle.setProperty("display","none");
				}
				_showCursor(innerStyle,cursorMode=CursorMode.FIXED,anchorLocation={x:0,y:0},cursorLocation={x:0,y:0}){
					//TODO
				}
				_hideCursor(innerStyle){
					innerStyle.removeProperty("cursor");
					innerStyle.removeProperty("animationName");					//TODO: CHECK!
				}
	}