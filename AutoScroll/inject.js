//VARS
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
	const htmlTag=document.documentElement;					//USADO PARA DETECTAR SCROLLBAR
	const bodyTag=(document.body?document.body:htmlTag);	//USADO PARA DETECTAR SCROLLBAR
	const inner=document.createElement("div");				//USADO PARA O VISUAL
//MAIN
	(function(){
		htmlTag.appendChild(createAnchor());
	})();
//FUNCS
	function createAnchor(){
		const outer=document.createElement("auto-scroll");
		const shadow=outer.attachShadow({mode:"open"});
		shadow.appendChild(createAnchorHTML());
		return outer;
	}
	function createAnchorHTML(){
		inner.style.setProperty("transform","translateZ(0)");
		inner.style.setProperty("display","none");
		inner.style.setProperty("position","fixed");
		inner.style.setProperty("left","0px");
		inner.style.setProperty("top","0px");
		inner.style.setProperty("width","100%");
		inner.style.setProperty("height","100%");
		inner.style.setProperty("z-index","2147483647");
		inner.style.setProperty("background-repeat","no-repeat");
		inner.appendChild(createAnchorCSS(inner));
		return inner;
	}
	function createAnchorCSS(inner){
		const styler=document.createElement("style");
		inner.style.setProperty("animation-duration","3s");
		inner.style.setProperty("animation-iteration-count","infinite");
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
		styler.innerHTML=animacoes;
		return styler;
	}