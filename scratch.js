/*var sprites = []
var globalvars = [];
var globalcolors = [];*/

Date.prototype.getDOY = function() {
var onejan = new Date(this.getFullYear(),0,1);
return Math.ceil((this - onejan) / 86400000);
}

window.util = {
	radians: function(d){
		return d*Math.PI/180;
	},
	degrees: function(r){
		return r/Math.PI*180;
	},
	isArray: function(o){
		try{
			o.join("");
			return true;
		}catch(e){
			return false;
		}
		return false;
	},
	strm: function(str, f){
		return (new Array(f + 1)).join(str);
	},
	pad: function(n, nop){
		if(nop === undefined){nop = 2}
		return this.strm("0", nop - String(n).length) + n;
	},
	factorial: function(n){
		if(typeof n == 'string') n = Number(n);
		if(typeof n != 'number' || isNaN(n)){
			return 0;
		}
		if (n < 2) return 1;
		return (n * this.factorial(n-1));
	},
	months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
	days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
	lsort: function(a,b){
		return a.costumes.layer - b.costumes.layer;
	}
}

window.keymouse = {
	mousepos: [0, 0],
	mouseisdown: false,
	keyisdown: false,
	keychar: 0,
	keycode: 0,
	mousemove: function(ev){
		this.mousepos = [ev.pageX, ev.pageY];
	},
	mousedown: function(){this.mouseisdown = true},
	mouseup: function(){this.mouseisdown = false},
	keypresses: {},
	keypress: function(e){
		this.keyisdown = true;
		this.keychar = String.fromCharCode(e.charCode);
		this.keycode = e.keyCode;
		if(this.keypresses[e.keyCode]){
			var i;
			for(i in this.keypresses[e.keyCode]){
				this.keypresses[e.keyCode][i]();
			}
		}
	},
	keyup: function(){
		this.keyisdown = false;
		this.keychar = this.keycode = 0;
	}
};
function Costume(image){
//		console.log("b", image);
	if(util.isArray(image)){
		var i;
		this.i = [];
		for(i in image){
			this.i.push(new Costume(image[i]));
		}
		this.c = 0;
		this.pos = {x: 0, y: 0, r: 0, w: 1, h: 1};
		this.layer = 0;
		this.visibility = true;
		this.__defineGetter__("current", function(){return this.i[this.c]});
		this.__defineSetter__("current", function(v){this.i[this.c] = v});
	}else{
		//nsole.log(image);
		this.image = new Image(); this.image.src = image;
//		this.x = this.y = this.r = 0;
		this.w = this.image.width;
		this.h = this.image.height;
	}
}

function Stamp(costume){
	var c = new Costume([costume.current.image.src]);
	c.pos = {x: costume.pos.x, y: costume.pos.y, r: costume.pos.r, w: costume.pos.w, h: costume.pos.h};
	c.c = costume.c;
	c.visibility = costume.visibility;
	return c;
}

function Renderer(canvas, world){
	this.world = world;
//	this.sprites = this.world.sprites;
	this.canvas = canvas;
	this.ctx = this.canvas.getContext("2d");
	this.render = function(){
		var i;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
//		window.x = this;
		for(i in this.world.lines){
			var l = this.world.lines[i];
			this.ctx.beginPath();
			this.ctx.strokeStyle = "rgba(" + l.c.join(",") + ",255)";
			this.ctx.lineWidth = l.w
			this.ctx.moveTo(l.s.x, l.s.y);
			this.ctx.lineTo(l.e.x, l.e.y);
			this.ctx.stroke();
//			this.lines.splice(i, 1);
		}
		for(i in this.world.stamps){
			var s = this.world.stamps[i];
			window.x = s;
                        if(!s.visibility){continue}
			var pos = s.pos;
			var cur = s.current;
			this.ctx.save();
			this.ctx.translate(pos.x + cur.w / 2, pos.y + cur.h / 2);
			this.ctx.rotate(pos.r);
			this.ctx.drawImage(cur.image, 0, 0, pos.w * cur.w, pos.h * cur.h);
//			this.ctx.rotate(-radians(s.r));
//			this.ctx.translate(-s.w / 2, -s.h / 2);
			this.ctx.restore();
		}
		var spr = this.world.sprites.slice().sort(util.lsort);
		for(i in spr){
			var c = spr[i].costumes;
			if(!c.visibility){continue}
			var pos = c.pos;
			var cur = c.current;
			this.ctx.save();
			this.ctx.translate(pos.x + cur.w / 2, pos.y + cur.h / 2);
			this.ctx.rotate(pos.r);
			this.ctx.drawImage(cur.image, 0, 0, pos.w * cur.w, pos.h * cur.h);
//			this.ctx.rotate(pos.r);
  //                      this.ctx.translate(-cur.w / 2, -cur.h / 2);
			this.ctx.restore();
		}		
	};
	this.intervalRender = function(that){
		that.render();
	}
/*	this.lines = [];
	this.pen = function(o){
		this.lines.push(o);
	}*/
	this.start = function(){
		this.intvl = setInterval(this.intervalRender, 50, this);
	};
	this.stop = function(){
		clearInterval(this.intvl);
	};
}
function World(lsprites){
	var i;
	this.sprites = [];
	this.sounds = [];
	this.vars = [];
	this.lines = [];
	this.stamps = [];
	this.greenflag = [];
	this.timer = new Date();
	for(i in lsprites){
//		console.log(lsprites[i]);
		this.sprites.push(new Sprite(lsprites[i].name, lsprites[i].costumes, this));
	}
	this.pen = function(o){
		this.lines.push(o);
	}
	this.stamp = function(s){
		this.stamps.push(s);
	}
	this.greenflagClicked = function(){
		var i;
		for(i in this.greenflag){
			setTimeout(this.greenflag[i], 0);
		}
	}
	this.renderer = new Renderer(document.getElementById("stage"), this);
	this.renderer.start();
	window.world = this;
}
function Sprite(name, costumes, world){
	this.name = name;
	this.stage = world;
	this.costumes = new Costume(costumes);
	this.vars = [];
//	this.colors = [];
	this.penColor = [0,0,0];
	this.penSize = 1;
	this.draggable = true;
//	this.costumeNum = 0;
//	this.currentCostume = new Costume(costumes[0]);
	this.pendown = false;
	this.click = function(){};
/*	this.e = new Image();
	this.e.src = costumes[0];
	this.e.id = name;
	this.e.onclick = function(){this.click()};*/
//	document.getElementById("sprites").appendChild(this.e);
	this._cloned = false;
	this._answer = "";
	this.volume = 100;
	this.dpen = function(bx, by, ex, ey){
		if(this.pendown){
			var xo = this.costumes.current.w / 2;
			var yo = this.costumes.current.h / 2;
			this.stage.pen({s: {x: bx + xo, y: by + yo}, e: {x: ex + xo, y: ey + yo}, c: this.penColor, w: this.penSize});
		}
	}
	this.finit = function(){
		if(localStorage.files === undefined){
			localStorage.files = "{}";
		}
	}
	this.moveSteps = function(amount){
		var cc = this.costumes.pos;
	        var d = cc.r;
	       	var x = cc.x;
	        var y = cc.y;
	        var nx = x + amount * Math.cos(d);
	        var ny = y + amount * Math.sin(d);
	        cc.x = nx;
	        cc.y = ny;
		this.dpen(x, y, cc.x, cc.y);
/*	        if(this.pendown){
			this.stage.renderer.pen({s: {x: x, y: y}, e: {x: nx, y: ny}});
	        }*/
	}
	this.turnClockwise = function(amount){
//		var d = parseFloat(this.e.style.webkitTransform) + amount;
//		this.e.style.webkitTransform = "rotate(" + d + "deg)";
		this.costumes.pos.r += amount;
	}
	this.turnCounterClockwise = function(amount){
		this.turnClockwise(-amount);
	}
	this.pointInDirection = function(dir){
//		this.e.style.webkitTransform = "rotate(" + dir + "deg)";
		this.costumes.pos.r = dir;
	}
	this.pointTowards = function(spr){
//		var tx = parseFloat(this.e.style.left);
		var cc = this.costumes.pos;
//		var ty = parseFloat(this.e.style.top);
		var occ = spr.costumes.pos;
//		var ox = parseFloat(sprites[spr].e.style.left);
  //              var oy = parseFloat(sprites[spr].e.style.top);
		var dir = Math.atan((occ.y - cc.y)/(occ.x - cc.x));
		this.pointInDirection(dir);
	}
	this.goToXY = function(nx, ny){
//		window.x = this;
		var cc = this.costumes.pos;
		var x = cc.x;
		var y = cc.y;
		cc.x = nx;
		cc.y = ny;
		this.dpen(x, y, cc.x, cc.y);
		/*if(this.pendown){
			this.stage.renderer.pen({s: {x: x, y: y}, e: {x: nx, y: ny}});
		}*/
	}
	this.goToSprite = function(spr){
		var cc = this.costumes.pos;
		var x = cc.x;
		var y = cc.y;
		var occ = spr.costumes.pos;
		cc.x = occ.x;
		cc.y = occ.y;
		this.dpen(x, y, cc.x, cc.y);
	}
	// No jQuery, not sure how to glide
	this.makeDraggable = function(){
		this.draggable = true;
	}
	this.makeUnDraggable = function(){
		this.draggable = false;
	}
	this.changeX = function(a){
		var cc = this.costumes.pos;
		var x = cc.x;
		cc.x += a;
		this.dpen(x, cc.y, cc.x, cc.y);
/*		if(this.pendown){
			this.stage.renderer.pen({s: {x: x, y: cc.y}, e: {x: cc.x, y: cc.y}});
		}*/
	}
	this.setX = function(a){
		var cc = this.costumes.pos;
		var x = cc.x;
		cc.x = a;
		this.dpen(x, cc.y, cc.x, cc.y);
/*		if(this.pendown){
			this.stage.renderer.pen({s: {x: x, y: cc.y}, e: {x: cc.x, y: cc.y}});
		}*/
	}
	this.changeY = function(a){
                var cc = this.costumes.pos;
                var y = cc.y;
                cc.y += a;
		this.dpen(cc.x, y, cc.x, cc.y);
/*                if(this.pendown){
                        this.stage.renderer.pen({s: {x: cc.x, y: y}, e: {x: cc.x, y: cc.y}});
                }*/
        }
        this.setY = function(a){
                var cc = this.costumes.pos;
                var y = cc.y;
                cc.y = a;
		this.dpen(cc.x, y, cc.x, cc.y);
/*                if(this.pendown){
                        this.stage.renderer.pen({s: {x: cc.x, y: y}, e: {x: cc.x, y: cc.y}});
                }*/
        }
	// Bounce on edge later
	this.xPosition = function(){
		return this.costumes.pos.x;
	}
	this.yPosition = function(){
		return this.costumes.pos.y;
	}
	this.direction = function(){
		return this.costumes.pos.r;
	}
	this.switchToCostume = function(c){
		this.costumes.c = c - 1;
	}
	this.costumeNum = function(){
		return this.costumes.c + 1;
	}
	// no camera so far
	this.deleteCostume = function(n){
		this.costumes.i.splice(n-1, 1);
	}
	this.changeSizeBy = function(d){
		var cc = this.costumes.pos;
		cc.w += d;
		cc.h += d;
	}
	this.setSizeTo = function(a){
		var cc = this.costumes.pos;
		cc.w = cc.h = a;
	}
	this.changeWidthBy = function(d){
		this.costumes.pos.w += d;
	}
	this.setWidthTo = function(a){
		this.costumes.pos.w = a;
	}
	this.changeHeightBy = function(d){
                this.costumes.pos.h += d;
        }
        this.setHeightTo = function(a){
                this.costumes.pos.h = a;
        }
	this.show = function(){
		this.costumes.visibility = true;
	}
	this.hide = function(){
		this.costumes.visibility = false;
	}
	this.visible = function(){
		return this.costumes.visibility;
	}
	this.playSound = function(n){
		var s = new Audio();
		s.src = "audio/" + n;
		s.play();
		this.stage.sound.push(s);
	}
	this.playSoundUntilDone = this.playSound; //waiting to finish freezes
	this.stopAllSounds = function(){
		var s = this.stage.sound;
		var i;
		for(i in s){
			s[i].pause();
			s[i].currentTime = 0;
		}
	}
	this.clear = function(){
		this.stage.lines = [];
		this.stage.stamps = [];
	}
	this.penDown = function(){
		this.pendown = true;
	}
	this.penUp = function(){
		this.pendown = false;
	}
	this.setPenColor = function(c){
		this.penColor = c;
	}
	this.getPenColor = function(){
		return this.penColor;
	}
	this.changePenHue = function(h){
//		var rgbs = this.penColor;
//		var rgbsa = this.penColor.split(",");
//		var a = rgbToHsv(parseInt(rgbsa[0]), parseInt(rgbsa[1]), parseInt(rgbsa[2]));
		var a = rgbToHsv(this.penColor.slice());
		a[0] += h;
		this.penColor = hsvToRgb(a);
//		return "rgb(" + HsvToRgb(a).join(",") + ")";
	}
	this.setPenHue = function(h){
//		var rgbsa = this.penColor.split(",");
//		var a = rgbToHsv(parseInt(rgbsa[0]), parseInt(rgbsa[1]), parseInt(rgbsa[2]));
		var a = rgbToHsv(this.penColor);
		a[0] = h;
		this.penColor = hsvToRgb(a);
//		return "rgb(" + HsvToRgb(a).join(",") + ")";
	}
	this.getPenHue = function(){
//		var rgbsa = this.penColor.split(",");
	//	var a = rgbToHsv(parseInt(rgbsa[0]), parseInt(rgbsa[1]), parseInt(rgbsa[2]));
		var a = rgbToHsv(this.penColor);
		return a[0];
	}
	this.changePenShade = function(s){
		var a = rgbToHsv(this.penColor);
		a[1] += s;
		this.penColor = hsvToRgb(a);
	}
	this.setPenShade = function(s){
		var a = rgbToHsv(this.penColor);
		a[1] = s;
		this.penColor = hsvToRgb(a);
	}
	this.getPenShade = function(s){
		var a = rgbToHsv(this.penColor);
		return a[1];
	}
	this.stamp = function(){
		this.stage.stamp(Stamp(this.costumes));
	}
//	localStorage.__defineGetter__("files", function(){return JSON.parse(localStorage._files)});
//	localStorage.__defineSetter__("files", function(v){localStorage._files = JSON.stringify(v)});
	this._setFile = function(f){localStorage.files = JSON.stringify(f)}
	this._getFile = function(){return JSON.parse(localStorage.files)}
	this.__defineSetter__("files", function(v){console.log(v); localStorage.files = JSON.stringify(v)});
	this.__defineGetter__("files", function(){return JSON.parse(localStorage.files)});
	this.contentsOfFile = function(n){
		this.finit();
//		return this.files[n];
//		var f = this.files;
		return this.files[n];
	}
	this.lineOfFile = function(l, f){
		return this.contentsOfFile(f).split("\n")[l+1];
	}
	this.lengthOfFile = function(f){
		return this.contentsOfFile(f).split("\n").length;
	}
	//cross-domain XHR problems
	this.contentsOfUrl = function(u){
		return "URLS are not implemented yet\n";
	}
	this.lineOfUrl = function(l, u){
		return this.contentsOfUrl(u).split("\n")[l+1];
	}
	this.lengthOfUrl = function(u){
		return this.contentsOfUrl(u).split("\n").length;
	}
	this.writeToFile = function(c, f){
		this.finit();
//		localStorage.files[f] += c;
//		this._setFile(this._getFile()[f] + c);
		var s = this.files;
		s[f] += c;
		this.files = s;
	}
	this.clearFile = function(f){
		this.finit();
		var s = this.files;
		s[f] = "";
		this.files = s;
	}
	// delay freezes things up
	// broadcasts later
	this.spriteName = function(){
		return this.name;
	}
	this.setSpriteName = function(n){
		this.name = n;
	}
	this.cloned = function(){
		return this._cloned;
	}
	this.__callback = function(){
		var ask = document.getElementById('ask');
		document.getElementById('ask').style.display = '';
		var inp = document.getElementById('inp');
		this._answer = inp.value;
		inp.value = "";
		this._callback(this._answer);
	}
	this.ask = function(q, c){
		var ask = document.getElementById("ask");
//		ask.style.display = "block";
		var qe = document.getElementById("question");
		var inp = document.getElementById("inp");
		this._callback = c;
		inp.focus()
		window.asker = this;
		ask.style.display = "block";
		qe.innerHTML = q;
	}
	this.askInDialog = function(q){
		this._answer = prompt(q, "");
	}
	this.answer = function(){
		return this._answer;
	}
	this.showDialog = function(s){
		alert(s);
	}
	this.mouseX = function(){
		return keymouse.mousepos[0];
	}
	this.mouseY = function(){
		return keymouse.mousepos[1];
	}
	this.mouseDown = function(){
		return keymouse.mouseisdown;
	}
	this.keyKPressed = function(k){
		return !!(mousedown.keychar == k);
	}
	this.resetTimer = function(){
		this.stage.timer = new Date();
	}
	this.timer = function(){
		var nt = new Date();
		return (nt.getTime() - this.stage.timer.getTime()) / 1000;
	}
	this.ofSprite = function(p, s){
	switch(p){
		case "x position":
			return s.costumes.pos.x;
		case "y position":
			return s.costumes.pos.y;
		case "direction":
			return s.costumes.pos.r;
		case "costume #":
			return s.costumes.c;
		case "size":
			return Math.sqrt(s.costumes.w * s.costumes.h);
		case "volume":
			return s.volume;
		}
	}
	this.dateTime = function(t){
		var d = new Date();
		switch(t){
		case "time":
			var h = d.getHours();
			var s = h <= 12 ? "am" : "pm";
			h %= 12;
			return h + ":" + util.pad(d.getMinutes()) + ":" + util.pad(d.getSeconds()) + " " + s;
		case "hour":
			return util.pad(d.getHours());
		case "minute":
			return util.pad(d.getMinutes());
		case "second":
			return util.pad(d.getSeconds());
		case "date":
			return d.getDate() + " " + util.months[d.getMonth()] + " " + d.getFullYear();
		case "day of month":
			return d.getDate();
		case "day of year":
			return d.getDOY();
		case "weekday-name":
			return util.days[d.getDay() - 1];
		case "weekday-#":
			return d.getDay() + 1;
		case "month-name":
			return util.months[d.getMonth()];
		case "month-#":
			return d.getMonth() + 1;
		case "year":
			return d.getFullYear();
		}
	}
	this.pickRandom = function(from, to){
		var t = Math.random() * ((to - from) + 1);
		return Math.floor(t) + from;
	}
	this.join = function(){
		return Array.prototype.slice.call(arguments).join("");
//		return String(a) + String(b);
	}
	this.letterOf = function(l, s){
		return s.substr(l-1,1);
	}
	this.lettersOf = function(l, n, s){
		return s.substr(l-1, n);
	}
	this.indexOfStartingAt = function(f, st, s){
		return s.indexOf(f, st - 1) + 1;
	}
	this.lengthOf = function(s){
		return String(s).length;
	}
	this.mod = function(n, m){
		return n % m;
	}
	this.round = function(n){
		return Math.round(Number(n));
	}
	this.opOf = function(op, n){
		switch(op){
		case "factorial":
			return util.factorial(n);
		case "abs":
			return Math.abs(n);
		case "sqrt":
			return Math.sqrt(n);
		case "sin":
			return Math.sin(n);
		case "cos":
			return Math.cos(n);
		case "tan":
			return Math.tan(n);
		case "asin":
			return Math.asin(n);
		case "acos":
			return Math.acos(n);
		case "atan":
			return Math.atan(n);
		case "atan2":
			return Math.atan2(n);
		case "ln":
			return Math.log(n);
		case "log:
			return Math.log(n) / Math.LN10;
		case "e ^":
			return Math.exp(n);
		case "10 ^":
			return Math.pow(10, n);
		}
		return 0;
	}
	this.constant = function(c){
		switch(t1){
		case "e":
			return Math.E;
		case "pi":
			return Math.PI;
		case "newline":
			return "\n";
		case "tab":
			return "\t";
		}
	}
	this.getVar = function(n){
		if(this.vars[n] !== undefined){
			return this.vars[n];
		}else{
			return this.stage.vars[n];
		}
	}
	this.setVar = function(n, v){
		if(this.vars[n] !== undefined){
			this.vars[n] = v;
		}else{
			this.stage.vars[n] = v;
		}
	}
	this.changeVar = function(n, v){
		if(this.vars[n] !== undefined){
			this.vars[n] += v;
		}else{
			this.stage.vars[n] += v;
		}
	}
	this.createVar = function(n, t){
		if(t){
			this.vars[n] = "";
		}else{
			this.stage.vars[n] = "";
		}
	}
	this.deleteVar = function(n){
		if(this.vars[n] !== undefined){
			delete this.vars[n];
		}else{
			delete this.stage.vars[n];
		}
	}
	this.getList = this.getVar;
	this.addToList = function(n, v){
		if(this.vars[n] !== undefined){
			this.vars[n].push(v);
		}else{
			this.stage.vars[n].push(v);
		}
	}
	this.deleteOfList = function(n, i){
		if(this.vars[n] !== undefined){
			this.vars[n].splice(i - 1);
		}else{
			this.stage.vars[n].splice(i - 1);
		}
	}
	this.insertInList = function(n, i, v){
		if(this.vars[n] !== undefined){
			this.vars[n].splice(i - 1, 0, v);
		}else{
			this.stage.vars[n].splice(i - 1, 0, v);
		}
	}
	this.replaceItemOfList(n, i, v){
		if(this.vars[n] !== undefined){
			this.vars[n][i] = v;
		}else{
			this.stage.vars[n][i] = v;
		}
	}
	this.getItemOfList(n, i){
		if(this.vars[n] !== undefined){
			return this.vars[n][i];
		}else{
			return this.stage.vars[n][i];
		}
	}
	this.lengthOfList(n){
		if(this.vars[n] !== undefined){
			return this.vars[n].length;
		}else{
			return this.stage.vars[n].length;
		}
	}
	this.getColor = this.getVar;
	this.setColor = this.setVar;
	this.colorFromRGB = function(r, g, b){
		return [r, g, b];
	}
	this.redOf = function(c){
		return c[0];
	}
	this.greenOf = function(c){
		return c[1];
	}
	this.blueOf = function(c){
		return c[2];
	}
	this.hueOf = function(c){
		return rgbToHsv(c)[0];
	}
	this.satOf = function(c){
		return rgbToHsv(c)[1];
	}
	this.valOf = function(c){
		return rgbToHsv(c)[2];
	}
}
