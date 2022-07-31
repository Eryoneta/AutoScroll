	(function(){
		//<HTML>
		const htmlTag=document.documentElement;					//HTML
		const bodyTag=(document.body?document.body:htmlTag);	//BODY
			const outer=document.createElement("div");			//CRIA ELEMENTO AUTOSCROLL PARA O FUNDO(IMAGEM DA ÂNCORA)
				outer.id="AutoScroll";
				const shadow=outer.attachShadow({mode:"open"});		//SHADOW DO OUTER(HTML DO FUNDO)
					const inner=document.createElement("div");
						inner.style.setProperty("transform","translateZ(0)");
						inner.style.setProperty("display","none");
						inner.style.setProperty("position","fixed");
						inner.style.setProperty("left","0px");
						inner.style.setProperty("top","0px");
						inner.style.setProperty("width","100%");
						inner.style.setProperty("height","100%");
						inner.style.setProperty("z-index","2147483647");
						inner.style.setProperty("background-repeat","no-repeat");
						const estilo=document.createElement("style");		//CRIA ELEMENTO STYLE PARA ANIMACAO CSS
							inner.style.setProperty("animation-duration","3s");
							inner.style.setProperty("animation-iteration-count","infinite");
							const frames=[
								[											//PARADO
									["M"],										//MEIO
									["H","V","HV"]									//MODO HORIZONTAL, VERTICAL, OU AMBOS
								],[											//APONTANDO
									["C","CD","D","BD","B","BE","E","CE"],		//DIREÇÕES EM QUE APONTA
									["S","E"]										//MODO APONTANDO O CURSOR OU NÃO
								],[		//TEMPOS DA ANIMAÇÃO
									[0.000,1],[23.35,1],[23.36,2],[25.23,3],[27.10,4],[28.97,3],[30.84,2],[32.71,1],	//BLINK
									[79.42,1],[79.43,2],[81.30,3],[83.17,4],[85.04,3],[86.91,2],						//BLINK-
									[88.78,1],[90.65,2],[92.52,3],[94.39,4],[96.26,3],[98.13,2],[100.0,1],				//-BLINK
								]
							];
							let animacoes="";
							for(let s=0;s<=1;s++){						//PARADO OU APONTANDO
								for(let direcao of frames[s][0]){			//MEIO OU DIREÇÕES
									for(let modo of frames[s][1]){				//MODOS
										animacoes+="@keyframes "+direcao+"_"+modo+"{";
										for(let frame of frames[2]){	//ANIMAÇÃO
											const cursor=(direcao+"/"+modo+"/"+frame[1]);	//EX: M/H/3 MEIO>HORIZONTAL>FRAME 3
											animacoes+=(frame[0]+"%{cursor:url('"+chrome.runtime.getURL("Scrolls/"+cursor+".png")+"')16 16,auto;}");
										}
										animacoes+="}";
									}
								}
							}
						estilo.innerHTML=animacoes;		//ESTILO RECEBE ANIMAÇÕES(KEYFRAMES)
					inner.appendChild(estilo);		//INNER RECEBE ESTILO(CSS DO CURSOR)
				shadow.appendChild(inner);		//SHADOW RECEBE INNER(CSS DO FUNDO)
											//OUTER USA SHADOW
		htmlTag.appendChild(outer);		//HTML RECEBE OUTER
		//</HTML>
		//<VARIÁVEIS>
		const Status={
			INACTIVE:0,								//NÃO ESTÁ NA TELA
			HORIZONTAL_SCROLLING:1,					//O MOUSE_WHEEL_ROLL MOVE O HORIZONTAL_SCROLL
			DRAGGING:2,								//MOUSE_DRAG MOVE OS SCROLLS
			AUTO_DRAGGING:3,						//MOUSE_MOVE MOVE OS SCROLLS
			AUTO_SCROLLING:4,						//OS SCROLLS SÃO MOVIDOS AUTOMATICAMENTE
			DEFAULT_AUTOSCROLLING:5,				//AUTOSCROLL PADRÃO
			PAUSED:10,								//ATIVO, MAS PARADO
			WAITING:20								//ESPERANDO INPUT
		};
		const Mouse={
			LEFT:0,MIDDLE:1,RIGHT:2
		}
		const Key={
			A:65,ENTER:13,SPACE:32,
			UP_ARROW:38,DOWN_ARROW:40,RIGHT_ARROW:39,LEFT_ARROW:37,
			NUM_0:48,NUM_1:49,NUM_2:50,NUM_3:51,NUM_4:52,NUM_5:53,NUM_6:54,NUM_7:55,NUM_8:56,NUM_9:57
		};
		const autoScroll={		//GUARDA O DADOS DO AUTOSCROLL
			animacao:null,							//LOOP DA ANIMAÇÃO
			elemento:null,							//ELEMENTO QUE RECEBE AUTOSCROLL
			centroX:0,centroY:0,					//ÂNCORA
			dirX:0,dirY:0,							//VELOCIDADE E DIREÇÃO DO DRAG
			dirAutoX:0,dirAutoY:0,					//VELOCIDADE E DIREÇÃO DO AUTOSCROLL
			mouseX:0,mouseY:0,						//POSIÇÃO DO MOUSE
			verticalScrolled:0,						//VALOR SE SCROLL FOR USADO
			status:Status.INACTIVE,					//STATUS
			setStatus:function(status){				//CONFIGURA STATUS
				this.status=status;
			},
			statusIs:function(...statuses){			//COMPARA STATUS COM VÁRIOS STATUSES
				for(let status of statuses)if(status===this.status)return true;
				return false;
			}
		}
		const customCursorSize=32;					//TAMANHO DO CURSOR
		const speedIncremento=0.125;				//INCREMENTADOR DE VELOCIDADE
		const restRadius=(customCursorSize/2)+5;	//RAIO DA ÁREA EM QUE NÃO HÁ AUTOSCROLL
		const speedControle=8;						//DIVIDE A VELOCIDADE
		const autoScrollPesado=5;					//QUANTIDADE DE SCROLLS DADOS EM SCROLL PESADO
		//</VARIÁVEIS>
		//<INPUTS>
		function stopEvento(e){						//IMPEDE DEFAULT_EVENTOS
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
		}
		addEventListener("mousedown",function(m){
			switch(m.button){
				case Mouse.LEFT:		input.mouseDown.left(m);break;
				case Mouse.MIDDLE:		input.mouseDown.middle(m);break;
				case Mouse.RIGHT:		input.mouseDown.right(m);break;
			}
										
										// console.log(autoScroll.status);
										
		},true);
		addEventListener("mouseup",function(m){
			switch(m.button){
				case Mouse.LEFT:		input.mouseUp.left(m);break;
				case Mouse.MIDDLE:		input.mouseUp.middle(m);break;
				case Mouse.RIGHT:		input.mouseUp.right(m);break;
			}
										
										// console.log(autoScroll.status);
										
		},true);
		addEventListener("wheel",function(w){
										input.mouseWheelRoll(w);
										
										// console.log(autoScroll.status);
										
		},{passive:false});
		addEventListener("mousemove",function(m){
										input.mouseMove(m);
										
										// console.log(autoScroll.status);
										
		},true);
		addEventListener("keydown",function(k){
			if(k.ctrlKey&&k.shiftKey)switch(k.keyCode){
				case Key.A:				input.keyDown.ctrlShiftA(k);break;
										
										// console.log(autoScroll.status);
										
			}
		},true);
		addEventListener("keyup",function(k){
			const tecla=k.keyCode;
			switch(tecla){
				case Key.ENTER:			input.keyUp.enter();break;
				case Key.SPACE:			input.keyUp.space();break;
				case Key.UP_ARROW:
				case Key.DOWN_ARROW:
				case Key.RIGHT_ARROW:
				case Key.LEFT_ARROW:
										input.keyUp.arrow(tecla);break;
				case Key.NUM_0:
				case Key.NUM_1:
				case Key.NUM_2:
				case Key.NUM_3:
				case Key.NUM_4:
				case Key.NUM_5:
				case Key.NUM_6:
				case Key.NUM_7:
				case Key.NUM_8:
				case Key.NUM_9:
										input.keyUp.number(tecla);break;
			}
			if(k.ctrlKey)switch(tecla){
				case Key.UP_ARROW:
				case Key.DOWN_ARROW:
				case Key.RIGHT_ARROW:
				case Key.LEFT_ARROW:
					for(let i=0;i<autoScrollPesado;i++)
										input.keyUp.arrow(tecla);break;
			}
		},true);
		//</INPUTS>
		//<LOCALIZAR_E_VALIDAR_SCROLLS>
		function isValid(elemento){//VALIDA ELEMENTO-ALVO
			while(true){
				if(elemento===document||elemento===htmlTag||elemento===bodyTag)return true;
					else if(isInvalid(elemento))return false;
						else elemento=elemento.parentNode;//PASSA PARA VERIFICAR O ELEMENTO-PAI
			}
		}
		function isInvalid(elemento){//NÃO É UM ELEMENTO INVÁLIDO
			if(elemento.isContentEditable)return true;					//EDITORES
			if(elemento.localName==="a"&&elemento.href)return true;		//<A> COM LINK
			if(elemento.localName==="textarea")return true;				//<TEXTAREA>
			if(elemento.localName==="input")return true;				//<INPUT>
			return false;
		}
		function getElementWithScroll(elemento){//LOCALIZA ELEMENTO COM SCROLL
			while(elemento!==document&&elemento!==htmlTag&&elemento!==bodyTag){
				const elem=getWithScrollNormal(elemento);
				if(elem!==null){
					autoScroll.elemento=elem;
					break;
				}else elemento=elemento.parentNode;//PASSA PARA VERIFICAR O ELEMENTO-PAI
			}
			const elem=getWithScrollBase(document.compatMode==="CSS1Compat"?htmlTag:bodyTag);
			if(autoScroll.elemento===null)autoScroll.elemento=elem;
			return elem;//PODE SER DIFERENTE DE autoScroll.elemento, RETORNANDO O SCROLL DE UM PAINEL!
		}
		function getWithScrollNormal(elemento){//LOCALIZA ELEMENTO COM SCROLL NORMAL
			const estilo=getComputedStyle(elemento);
			const width=(permiteScroll(estilo.overflowX)&&elemento.scrollWidth>elemento.clientWidth);
			const height=(permiteScroll(estilo.overflowY)&&elemento.scrollHeight>elemento.clientHeight);
			if(width||height)return {
				tag:elemento,
				scroll:elemento,
				width:width,
				height:height,
				isRoot:false
			};else return null;
		}
		function getWithScrollBase(elemento){//LOCALIZA ELEMENTO BASE COM SCROLL
			const scroll=(document.scrollingElement?document.scrollingElement:bodyTag);
			const htmlEstilo=getComputedStyle(htmlTag);
			const bodyEstilo=getComputedStyle(bodyTag);
			const width=(permiteScrollBase(htmlEstilo.overflowX,bodyEstilo.overflowX)&&scroll.scrollWidth>elemento.clientWidth);
			const height=(permiteScrollBase(htmlEstilo.overflowY,bodyEstilo.overflowY)&&scroll.scrollHeight>elemento.clientHeight);
			if(width||height)return {
				tag:elemento,
				scroll:elemento,
				width:width,
				height:height,
				isRoot:true
			};else return null;
		}
		function permiteScrollBase(html,body){//VERIFICA PERMISSÃO DA TAG
			return (html==="visible"?(body!=="hidden"):permiteScroll(html));//SE TAG PERMITE QUE HAJA SCROLL
		}
		function permiteScroll(estilo){//VERIFICA PERMISSÃO DO STYLE
			return (estilo==="auto"||estilo==="scroll");//SE STYLE PERMITE QUE HAJA SCROLL
		}
		//</LOCALIZAR_E_VALIDAR_SCROLLS>
		function ativar(elemento,x,y){//COMECA O AUTOSCROLL
			autoScroll.centroX=x;
			autoScroll.centroY=y;
			startLoop(elemento.tag,elemento.scroll,elemento.isRoot);
			addEventListener("mousedown",	stopEvento,true);
			addEventListener("mouseup",		stopEvento,true);
			addEventListener("wheel",		stopEvento,{passive:false});
			addEventListener("mousemove",	stopEvento,true);
			addEventListener("keydown",		stopEvento,true);
			addEventListener("keyup",		stopEvento,true);
			addEventListener("contextmenu",	stopEvento,true);//IMPEDE DEFAUL_TOOLBOX
			addCursor(true);
		}
		function addCursor(inserir){
			if(inserir){
				setCursor(true);
				setTimeout(function(){
					inner.style.setProperty("background-image","url('"+chrome.runtime.getURL("Scrolls/F.png")+"')");
				},10);//DELAY PARA APARECER APÓS O CURSOR
				inner.style.setProperty("background-position",(autoScroll.centroX-(customCursorSize/2))+"px "+(autoScroll.centroY-(customCursorSize/2))+"px");
				inner.style.removeProperty("display");
			}else{
				inner.style.removeProperty("background-image");
				inner.style.removeProperty("background-position");
				setTimeout(function(){
					inner.style.removeProperty("cursor");
					inner.style.setProperty("display","none");
				},10);//DELAY PARA DESAPARECER APÓS O FUNDO
			}
		}
		function setCursor(esperando){
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
		function desativa(){	//DESATIVA AUTOSCROLL
			cancelAnimationFrame(autoScroll.animacao);
			removeEventListener("mousedown",	stopEvento,true);
			removeEventListener("mouseup",		stopEvento,true);
			removeEventListener("wheel",		stopEvento,{passive:false});
			removeEventListener("mousemove",	stopEvento,true);
			removeEventListener("keydown",		stopEvento,true);
			removeEventListener("keyup",		stopEvento,true);
			removeEventListener("contextmenu",	stopEvento,true);//PERMITE DEFAUL_TOOLBOX
			addCursor(false);
			autoScroll.animacao=null;
			autoScroll.elemento=null;
			autoScroll.centroX=0;
			autoScroll.centroY=0;
			autoScroll.dirX=0;
			autoScroll.dirY=0;
		}
		function startLoop(tag,scroll,isRoot){//LOOP DO MOVIMENTO
			let scrollX=(isRoot?window.scrollX:scroll.scrollLeft);
			let scrollY=(isRoot?window.scrollY:scroll.scrollTop);
			let innerScrollX=(autoScroll.elemento.isRoot?window.scrollX:autoScroll.elemento.scroll.scrollLeft);
			let innerScrollY=(autoScroll.elemento.isRoot?window.scrollY:autoScroll.elemento.scroll.scrollTop);
			function loop(){
				if(autoScroll.statusIs(Status.DRAGGING)){//DRAG SCROLL DE UM PAINEL INTERNO
					const innerScrollWidth=autoScroll.elemento.scroll.scrollWidth-autoScroll.elemento.tag.clientWidth;
					const innerScrollHeight=autoScroll.elemento.scroll.scrollHeight-autoScroll.elemento.tag.clientHeight;
					innerScrollX+=autoScroll.dirX;
					innerScrollY+=autoScroll.dirY;
					innerScrollX=Math.max(0,Math.min(innerScrollX,innerScrollWidth));
					innerScrollY=Math.max(0,Math.min(innerScrollY,innerScrollHeight));
					if(autoScroll.verticalScrolled!==0){//MOUSE_WHEEL_MOVE
						innerScrollY+=autoScroll.verticalScrolled;
						autoScroll.verticalScrolled=0;
					}
					if(autoScroll.elemento.isRoot)window.scroll(innerScrollX,innerScrollY);else{
						autoScroll.elemento.scroll.scrollLeft=innerScrollX;
						autoScroll.elemento.scroll.scrollTop=innerScrollY;
					}
				}else if(autoScroll.statusIs(Status.AUTO_DRAGGING,
											Status.AUTO_SCROLLING,
											Status.WAITING+Status.AUTO_DRAGGING,
											Status.WAITING+Status.AUTO_SCROLLING)){//DRAG SCROLL PRINCIPAL
					const scrollWidth=scroll.scrollWidth-tag.clientWidth;
					const scrollHeight=scroll.scrollHeight-tag.clientHeight;
					if(autoScroll.statusIs(Status.AUTO_SCROLLING,
											Status.WAITING+Status.AUTO_SCROLLING)){//AUTO_SCROLLING
						scrollX+=autoScroll.dirAutoX;
						scrollY+=autoScroll.dirAutoY;
					}else{//AUTO_DRAGGING
						scrollX+=autoScroll.dirX;
						scrollY+=autoScroll.dirY;
					}
					if(autoScroll.verticalScrolled!==0){//MOUSE_WHEEL_MOVE
						scrollY+=autoScroll.verticalScrolled;
						autoScroll.verticalScrolled=0;
					}
					scrollX=Math.max(0,Math.min(scrollX,scrollWidth));
					scrollY=Math.max(0,Math.min(scrollY,scrollHeight));
					if(isRoot)window.scroll(scrollX,scrollY);else{
						scroll.scrollLeft=scrollX;
						scroll.scrollTop=scrollY;
					}
				}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_SCROLLING,
											Status.PAUSED+Status.AUTO_DRAGGING)){
					const scrollHeight=scroll.scrollHeight-tag.clientHeight;
					if(autoScroll.verticalScrolled!==0){//MOUSE_WHEEL_MOVE
						scrollY+=autoScroll.verticalScrolled;
						autoScroll.verticalScrolled=0;
					}
					scrollY=Math.max(0,Math.min(scrollY,scrollHeight));
					if(isRoot)window.scroll(scrollX,scrollY);else{
						scroll.scrollLeft=scrollX;
						scroll.scrollTop=scrollY;
					}
				}
				autoScroll.animacao=requestAnimationFrame(loop);//CONTINUA A ANIMAÇÃO
			}
			loop();//INICIA LOOP
		}
		//<FUNÇÕES>
		const input={
			mouseDown:{
			//MOUSE.DOWN.LEFT_BUTTON
				left:function(m){
					if(autoScroll.statusIs(Status.AUTO_DRAGGING)){										//STATUS: AUTO_DRAGGING -> WAITING+AUTO_DRAGGING
						autoScroll.setStatus(Status.WAITING+Status.AUTO_DRAGGING);
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_DRAGGING)){					//STATUS: PAUSED+AUTO_DRAGGING -> WAITING+PAUSED+AUTO_DRAGGING
						autoScroll.setStatus(Status.WAITING+Status.PAUSED+Status.AUTO_DRAGGING);
					}else if(autoScroll.statusIs(Status.AUTO_SCROLLING)){								//STATUS: AUTO_SCROLLING -> WAITING+AUTO_SCROLLING
						autoScroll.setStatus(Status.WAITING+Status.AUTO_SCROLLING);
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_SCROLLING)){					//STATUS: PAUSED+AUTO_SCROLLING -> WAITING+PAUSED+AUTO_SCROLLING
						autoScroll.setStatus(Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING);
					}
				},
			//MOUSE.DOWN.MIDDLE_BUTTON
				middle:function(m){
					const mouseDownX=m.clientX;
					const mouseDownY=m.clientY;
					if(autoScroll.statusIs(Status.INACTIVE)){											//STATUS: INACTIVE -> WAITING+INACTIVE
						if(mouseDownX<htmlTag.clientWidth&&mouseDownY<htmlTag.clientHeight&&isValid(m.target)){//VALIDA ELEMENTO
							const elemento=getElementWithScroll(m.target);
							if(elemento!==null){
								autoScroll.setStatus(Status.WAITING+Status.INACTIVE);
								stopEvento(m);//IMPEDE DEFAULT_AUTOSCROLL
								ativar(elemento,mouseDownX,mouseDownY);//ATIVA AUTOSCROLL
							}
						}
					}else if(autoScroll.statusIs(Status.AUTO_DRAGGING,									//STATUS: AUTO_DRAGGING -> DRAGGING
												Status.AUTO_SCROLLING,									//STATUS: AUTO_SCROLLING -> DRAGGING
												Status.PAUSED+Status.AUTO_SCROLLING)){					//STATUS: PAUSED+AUTO_SCROLLING -> DRAGGING
						autoScroll.setStatus(Status.WAITING+Status.AUTO_DRAGGING);
					}else if(autoScroll.statusIs(Status.WAITING+Status.HORIZONTAL_SCROLLING)){			//STATUS: WAITING+HORIZONTAL_SCROLLING -> DEFAULT_AUTOSCROLLING
						autoScroll.setStatus(Status.DEFAULT_AUTOSCROLLING);
						addEventListener("contextmenu",stopEvento,true);//IMPEDE DEFAUL_TOOLBOX
					}
				},
			//MOUSE.DOWN.RIGHT_BUTTON
				right:function(m){
					const mouseDownX=m.clientX;
					const mouseDownY=m.clientY;
					if(autoScroll.statusIs(Status.INACTIVE)){											//STATUS: INACTIVE -> WAITING+HORIZONTAL_SCROLLING
						if(mouseDownX<htmlTag.clientWidth&&mouseDownY<htmlTag.clientHeight&&isValid(htmlTag)){//VALIDA ELEMENTO
							const elemento=getElementWithScroll(m.target);
							if(elemento!==null){
								autoScroll.setStatus(Status.WAITING+Status.HORIZONTAL_SCROLLING);
								// stopEvento(m);//IMPEDE QUALQUER OUTRO MOUSE_DOWN_RIGHT
							}
						}
					}else if(autoScroll.statusIs(Status.AUTO_DRAGGING)){								//STATUS: AUTO_DRAGGING -> WAITING+AUTO_DRAGGING
						autoScroll.setStatus(Status.WAITING+Status.AUTO_DRAGGING);
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_DRAGGING)){					//STATUS: PAUSED+AUTO_DRAGGING -> WAITING+PAUSED+AUTO_DRAGGING
						autoScroll.setStatus(Status.WAITING+Status.PAUSED+Status.AUTO_DRAGGING);
					}else if(autoScroll.statusIs(Status.AUTO_SCROLLING)){								//STATUS: AUTO_SCROLLING -> WAITING+AUTO_SCROLLING
						autoScroll.setStatus(Status.WAITING+Status.AUTO_SCROLLING);
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_SCROLLING)){					//STATUS: PAUSED+AUTO_SCROLLING -> WAITING+PAUSED+AUTO_SCROLLING
						autoScroll.setStatus(Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING);
					}
				}
			},
			mouseUp:{
			//MOUSE.UP.LEFT_BUTTON
				left:function(m){
					if(autoScroll.statusIs(Status.WAITING+Status.AUTO_DRAGGING,							//STATUS: WAITING+AUTO_DRAGGING -> INACTIVE
											Status.WAITING+Status.PAUSED+Status.AUTO_DRAGGING,			//STATUS: WAITING+PAUSED+AUTO_DRAGGING -> INACTIVE
											Status.WAITING+Status.AUTO_SCROLLING,						//STATUS: WAITING+AUTO_SCROLLING -> INACTIVE
											Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING)){		//STATUS: WAITING+PAUSED+AUTO_SCROLLING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						desativa();																		//STATUS: INACTIVE
					}
				},
			//MOUSE.UP.MIDDLE_BUTTON
				middle:function(m){
					if(autoScroll.statusIs(Status.DRAGGING)){											//STATUS: DRAGGING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						desativa();																		//STATUS: INACTIVE
					}else if(autoScroll.statusIs(Status.WAITING+Status.AUTO_DRAGGING)){					//STATUS: WAITING+INACTIVE -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						desativa();																		//STATUS: INACTIVE
					}else if(autoScroll.statusIs(Status.WAITING+Status.INACTIVE)){						//STATUS: WAITING+INACTIVE -> AUTO_DRAGGING
						if(m.buttons==Mouse.RIGHT){
							autoScroll.setStatus(Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING);	//STATUS: WAITING+INACTIVE -> WAITING+AUTO_SCROLLING
						}else autoScroll.setStatus(Status.AUTO_DRAGGING);
					}
				},
			//MOUSE.UP.RIGHT_BUTTON
				right:function(m){
					if(autoScroll.statusIs(Status.WAITING+Status.HORIZONTAL_SCROLLING)){				//STATUS: WAITING+HORIZONTAL_SCROLLING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
					}else if(autoScroll.statusIs(Status.HORIZONTAL_SCROLLING)){							//STATUS: HORIZONTAL_SCROLLING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						autoScroll.elemento=null;
						addEventListener("contextmenu",stopEvento,true);//IMPEDE DEFAUL_TOOLBOX
						setTimeout(function(){
							removeEventListener("contextmenu",stopEvento,true);
						},10);//DELAY PARA IMPEDIR DE FATO DEFAUL_TOOLBOX
					}else if(autoScroll.statusIs(Status.WAITING+Status.AUTO_DRAGGING)){					//STATUS: WAITING+AUTO_DRAGGING -> PAUSED+AUTO_DRAGGING
						autoScroll.setStatus(Status.AUTO_DRAGGING);
						input.keyUp.space();// -> PAUSED+AUTO_DRAGGING
					}else if(autoScroll.statusIs(Status.WAITING+Status.PAUSED+Status.AUTO_DRAGGING)){	//STATUS: WAITING+PAUSED+AUTO_DRAGGING -> AUTO_DRAGGING
						autoScroll.setStatus(Status.PAUSED+Status.AUTO_DRAGGING);
						input.keyUp.space();// -> AUTO_DRAGGING
					}else if(autoScroll.statusIs(Status.WAITING+Status.AUTO_SCROLLING)){				//STATUS: WAITING+AUTO_SCROLLING -> PAUSED+AUTO_SCROLLING
						autoScroll.setStatus(Status.AUTO_SCROLLING);
						input.keyUp.space();// -> PAUSED+AUTO_SCROLLING
					}else if(autoScroll.statusIs(Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING)){	//STATUS: WAITING+PAUSED+AUTO_SCROLLING -> AUTO_SCROLLING
						autoScroll.setStatus(Status.PAUSED+Status.AUTO_SCROLLING);
						input.keyUp.space();// -> AUTO_SCROLLING
					}else if(autoScroll.statusIs(Status.WAITING+Status.INACTIVE)){						//STATUS: WAITING+INACTIVE -> AUTO_SCROLLING
						autoScroll.setStatus(Status.AUTO_SCROLLING);
					}else if(autoScroll.statusIs(Status.DEFAULT_AUTOSCROLLING)){						//STATUS: DEFAULT_AUTOSCROLLING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						setTimeout(function(){
							removeEventListener("contextmenu",stopEvento,true);
						},10);//DELAY PARA IMPEDIR DE FATO DEFAUL_TOOLBOX
					}
				}
			},
		//MOUSE.WHEEL.ROLL
			mouseWheelRoll:function(w){
				const scroll=w.deltaY;
				if(autoScroll.statusIs(Status.WAITING+Status.HORIZONTAL_SCROLLING,						//STATUS: WAITING+HORIZONTAL_SCROLLING -> HORIZONTAL_SCROLLING
										Status.HORIZONTAL_SCROLLING)){									//STATUS: HORIZONTAL_SCROLLING
					autoScroll.setStatus(Status.HORIZONTAL_SCROLLING);
					stopEvento(w);//IMPEDE QUALQUER OUTRO MOUSE_WHEEL_ROLL
					let scrollX=autoScroll.elemento.scroll.scrollLeft;
					const scrollWidth=autoScroll.elemento.scroll.scrollWidth-autoScroll.elemento.tag.clientWidth;
					scrollX+=scroll;
					scrollX=(scrollX<0?0:Math.min(scrollX,scrollWidth));
					autoScroll.elemento.scroll.scrollLeft=scrollX;
				}else if(autoScroll.statusIs(Status.AUTO_DRAGGING,
											Status.PAUSED+Status.AUTO_DRAGGING)){
					autoScroll.verticalScrolled=scroll;//SCROLL ENQUANTO AUTO_DRAGGING
				}else if(autoScroll.statusIs(Status.AUTO_SCROLLING,										//STATUS: AUTO_SCROLLING
											Status.WAITING+Status.AUTO_SCROLLING)){						//STATUS: WAITING+AUTO_SCROLLING -> AUTO_SCROLLING
					autoScroll.setStatus(Status.AUTO_SCROLLING);
					if(w.buttons==Mouse.LEFT+1){//AUTO_SCROLL PESADO
						for(let i=0;i<autoScrollPesado;i++)if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}else if(w.buttons==Mouse.RIGHT){//AUTO_SCROLL LEVE
						if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}else autoScroll.verticalScrolled=scroll;//SCROLL VERTICAL
				}else if(autoScroll.statusIs(Status.WAITING+Status.AUTO_DRAGGING)){						//STATUS: WAITING+AUTO_DRAGGING -> AUTO_SCROLLING
					autoScroll.setStatus(Status.PAUSED+Status.AUTO_SCROLLING);
					if(w.buttons==Mouse.LEFT+1){//AUTO_SCROLL PESADO
						for(let i=0;i<autoScrollPesado;i++)if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}else if(w.buttons==Mouse.RIGHT){//AUTO_SCROLL LEVE
						if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}
				}else if(autoScroll.statusIs(Status.WAITING+Status.PAUSED+Status.AUTO_DRAGGING,			//STATUS: WAITING+PAUSED+AUTO_DRAGGING -> AUTO_SCROLLING
											Status.WAITING+Status.PAUSED+Status.AUTO_SCROLLING)){		//STATUS: WAITING+PAUSED+AUTO_SCROLLING -> AUTO_SCROLLING
					autoScroll.setStatus(Status.PAUSED+Status.AUTO_SCROLLING);//RESETA O AUTOSCROLLING
					if(w.buttons==Mouse.LEFT+1){//AUTO_SCROLL PESADO
						for(let i=0;i<autoScrollPesado;i++)if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}else if(w.buttons==Mouse.RIGHT){//AUTO_SCROLL LEVE
						if(scroll>0)input.keyUp.arrow(Key.DOWN_ARROW);else input.keyUp.arrow(Key.UP_ARROW);// -> AUTO_SCROLLING
					}
				}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_SCROLLING)){						//STATUS: PAUSED+AUTO_SCROLLING
					autoScroll.verticalScrolled=scroll;//SCROLL VERTICAL
				}
			},
		//MOUSE.MOVE
			mouseMove:function(m){
				const mouseMoveX=m.clientX;
				const mouseMoveY=m.clientY;
				autoScroll.mouseX=mouseMoveX;
				autoScroll.mouseY=mouseMoveY;
				const difX=mouseMoveX-autoScroll.centroX;
				const difY=mouseMoveY-autoScroll.centroY;
				const distancia=Math.sqrt(difX*difX+difY*difY);
				if(autoScroll.statusIs(Status.WAITING+Status.INACTIVE)){								//STATUS: WAITING+INACTIVE -> DRAGGING
					if(distancia>restRadius)autoScroll.setStatus(Status.DRAGGING);
				}else if(autoScroll.statusIs(Status.DRAGGING,											//STATUS: DRAGGING
											Status.AUTO_DRAGGING,										//STATUS: AUTO_DRAGGING
											Status.PAUSED+Status.DRAGGING,//MESMO SE ESTIVER PAUSADO
											Status.PAUSED+Status.AUTO_DRAGGING)){//MESMO SE ESTIVER PAUSADO
					if(distancia>restRadius){
						setCursor(false);
						autoScroll.dirX=difX/speedControle;
						autoScroll.dirY=difY/speedControle;
					}else{
						setCursor(true);
						autoScroll.dirX=0;
						autoScroll.dirY=0;
					}
				}
			},
			keyDown:{
			//KEY.UP.CTRL_SHIFT_A
				ctrlShiftA:function(k){
					if(autoScroll.statusIs(Status.INACTIVE)){											//STATUS: INACTIVE -> AUTO_DRAGGING
						const target=document.elementFromPoint(autoScroll.mouseX,autoScroll.mouseY);
						if(autoScroll.mouseX<htmlTag.clientWidth&&autoScroll.mouseY<htmlTag.clientHeight&&isValid(htmlTag)){//VALIDA ELEMENTO
							const elemento=getElementWithScroll(target);
							if(elemento!==null){
								autoScroll.setStatus(Status.AUTO_DRAGGING);
								stopEvento(k);
								ativar(elemento,autoScroll.mouseX,autoScroll.mouseY);//ATIVA AUTOSCROLL
							}
						}
					}else if(autoScroll.statusIs(Status.AUTO_DRAGGING,									//STATUS: WAITING+AUTO_DRAGGING -> INACTIVE
											Status.PAUSED+Status.AUTO_DRAGGING,							//STATUS: WAITING+PAUSED+AUTO_DRAGGING -> INACTIVE
											Status.AUTO_SCROLLING,										//STATUS: WAITING+AUTO_SCROLLING -> INACTIVE
											Status.PAUSED+Status.AUTO_SCROLLING)){						//STATUS: WAITING+PAUSED+AUTO_SCROLLING -> INACTIVE
						autoScroll.setStatus(Status.INACTIVE);
						desativa();																		//STATUS: INACTIVE
					}
				},
			},
			keyUp:{
			//KEY.UP.ENTER
				enter:function(){
					if(autoScroll.statusIs(Status.AUTO_SCROLLING)){
						autoScroll.dirAutoY*=2;
					}
				},
			//KEY.UP.SPACE
				space:function(){
					if(autoScroll.statusIs(Status.AUTO_DRAGGING)){										//STATUS: AUTO_DRAGGING -> PAUSED+AUTO_DRAGGING
						const difX=autoScroll.mouseX-autoScroll.centroX;
						const difY=autoScroll.mouseY-autoScroll.centroY;
						const distancia=Math.sqrt(difX*difX+difY*difY);
						if(distancia>restRadius)autoScroll.setStatus(Status.PAUSED+Status.AUTO_DRAGGING);
							else autoScroll.setStatus(Status.AUTO_SCROLLING);
						setCursor(false);//ATUALIZA PARA ESPERANDO
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_DRAGGING)){					//STATUS: PAUSED+AUTO_DRAGGING -> AUTO_DRAGGING
						autoScroll.setStatus(Status.AUTO_DRAGGING);
						setCursor(false);//ATUALIZA PARA SEGUINDO
					}else if(autoScroll.statusIs(Status.AUTO_SCROLLING)){								//STATUS: AUTO_SCROLLING -> PAUSED+AUTO_SCROLLING
						autoScroll.setStatus(Status.PAUSED+Status.AUTO_SCROLLING);
					}else if(autoScroll.statusIs(Status.PAUSED+Status.AUTO_SCROLLING)){					//STATUS: PAUSED+AUTO_SCROLLING -> AUTO_SCROLLING
						autoScroll.setStatus(Status.AUTO_SCROLLING);
					}
				},
			//KEY.UP.[UP|DOWN|RIGHT|LEFT]_ARROW
				arrow:function(seta){
					if(autoScroll.statusIs(Status.AUTO_SCROLLING)){									//STATUS: AUTO_SCROLLING
						switch(seta){
							case Key.UP_ARROW:		autoScroll.dirAutoY-=speedIncremento;break;
							case Key.DOWN_ARROW:	autoScroll.dirAutoY+=speedIncremento;break;
							case Key.RIGHT_ARROW:	autoScroll.dirAutoX+=speedIncremento;break;
							case Key.LEFT_ARROW:	autoScroll.dirAutoX-=speedIncremento;break;
						}
					}else if(autoScroll.statusIs(Status.AUTO_DRAGGING,									//STATUS: AUTO_DRAGGING -> AUTO_SCROLLING
												Status.PAUSED+Status.AUTO_DRAGGING,						//STATUS: PAUSED+AUTO_DRAGGING -> AUTO_SCROLLING
												Status.PAUSED+Status.AUTO_SCROLLING)){					//STATUS: PAUSED+AUTO_SCROLLING -> AUTO_SCROLLING
						autoScroll.setStatus(Status.AUTO_SCROLLING);
						setCursor(true);
						autoScroll.dirAutoY=0;
						autoScroll.dirAutoX=0;
						switch(seta){
							case Key.UP_ARROW:		autoScroll.dirAutoY-=speedIncremento;break;
							case Key.DOWN_ARROW:	autoScroll.dirAutoY+=speedIncremento;break;
							case Key.RIGHT_ARROW:	autoScroll.dirAutoX+=speedIncremento;break;
							case Key.LEFT_ARROW:	autoScroll.dirAutoX-=speedIncremento;break;
						}
					}
				},
			//KEY.UP.NUM_[0-9]
				number:function(numero){
					if(autoScroll.statusIs(Status.AUTO_DRAGGING,										//STATUS: AUTO_DRAGGING -> AUTO_SCROLLING
											Status.AUTO_SCROLLING,										//STATUS: AUTO_SCROLLING
											Status.PAUSED+Status.AUTO_DRAGGING,							//STATUS: PAUSED+AUTO_DRAGGING -> AUTO_SCROLLING
											Status.PAUSED+Status.AUTO_SCROLLING)){						//STATUS: PAUSED+AUTO_SCROLLING -> AUTO_SCROLLING
						autoScroll.setStatus(Status.AUTO_SCROLLING);
						switch(numero){
							case Key.NUM_0:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*0);break;
							case Key.NUM_1:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*1);break;
							case Key.NUM_2:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*2);break;
							case Key.NUM_3:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*3);break;
							case Key.NUM_4:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*4);break;
							case Key.NUM_5:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*5);break;
							case Key.NUM_6:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*6);break;
							case Key.NUM_7:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*7);break;
							case Key.NUM_8:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*8);break;
							case Key.NUM_9:			autoScroll.dirAutoY=(autoScroll.dirY=speedIncremento*9);break;
						}
					}
				}
			}
		};
		//</FUNÇÕES>
	})();
	/*
	+ Inputs:
		- AutoScroll curto:
			MOUSE.MIDDLE.DOWN + MOUSE.DRAG
		- AutoScroll:
			MOUSE.MIDDLE.CLICK > MOUSE.MOVE
			KEY.CTRL.DOWN + KEY.DOWN.SHIFT + KEY.CLICK.A > MOUSE.MOVE
		. Up automático:
			MOUSE.RIGHT.DOWN + MOUSE.WHEEL.ROLL_UP
			KEY.UP_ARROW.CLICK
		. Up automático pesado:
			MOUSE.LEFT.DOWN + MOUSE.WHEEL.ROLL_UP
			KEY.CTRL.DOWN + KEY.UP_ARROW.CLICK
		. Down automático:
			MOUSE.RIGHT.DOWN + MOUSE.WHEEL.ROLL_DOWN
			KEY.DOWN_ARROW.CLICK
		. Down automático pesado:
			MOUSE.LEFT.DOWN +MOUSE.WHEEL.ROLL_DOWN
			KEY.CTRL.DOWN + KEY.DOWN_ARROW.CLICK
		. Down automático calculado:
			KEY.[0-9].CLICK
		. Right automático:
			KEY.RIGHT_ARROW.CLICK
		. Left automático:
			KEY.LEFT_ARROW.CLICK
		. Pausa:
			MOUSE.RIGHT.CLICK
			KEY.SPACE_BAR.CLICK
		. Boost:
			KEY.ENTER.CLICK
		. Scroll up:
			MOUSE.WHEEL.ROLL_UP
		. Scroll down:
			MOUSE.WHEEL.ROLL_DOWN
		- Scroll right:
			MOUSE.RIGHT.PRESS + MOUSE.WHEEL.ROLL_DOWN
		- Scroll left:
			MOUSE.RIGHT.PRESS + MOUSE.WHEEL.ROLL_UP
		- DefaultAutoScroll:
			MOUSE.RIGHT.DOWN + MOUSE.MIDDLE.CLICK
	*/