//VARS
	const cursor={
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
			fileType: "png"
		},
		animation: {
			frames: [],
			duration: "3s",
			iterationCount: "infinite"
		}
	};
//MAIN
	(function(){
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
	})();
//FUNCS
	function generateCursorAnimations(innerStyle){
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