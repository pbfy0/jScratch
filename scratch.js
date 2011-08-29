/*var sprites = []
var globalvars = [];
var globalcolors = [];*/

function radians(d){
	return d*Math.PI/180;
}

function degrees(r){
	return r/Math.PI*180;
}

function isArray(o){
	try{
		o.join("");
		return true;
	}catch(e){
		return false;
	}
	return false;
}

function Costume(image){
//		console.log("b", image);
	if(isArray(image)){
		var i;
		this.i = [];
		for(i in image){
			this.i.push(new Costume(image[i]));
		}
		this.c = 0;
		this.pos = {x: 0, y: 0, r: 0, w: 100, h: 100};
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
		for(i in this.world.sprites){
			var c = this.world.sprites[i].costumes;
			if(!c.visibility){continue}
			var pos = c.pos;
			var cur = c.current;
			this.ctx.save();
			this.ctx.translate(pos.x + cur.w / 2, pos.y + cur.h / 2);
			this.ctx.rotate(pos.r);
			this.ctx.drawImage(cur.image, 0, 0, pos.w/100 * cur.w, pos.h/100 * cur.h);
//			this.ctx.rotate(pos.r);
  //                      this.ctx.translate(-cur.w / 2, -cur.h / 2);
			this.ctx.restore();
		}
		for(i in this.world.stamps){
			var s = this.world.stamps[i];
			window.x = s;
//                        if(!s.visibility){continue}
			var pos = s.pos;
			var cur = s.current;
			this.ctx.save();
			this.ctx.translate(pos.x + cur.w / 2, pos.y + cur.h / 2);
			this.ctx.rotate(pos.r);
			this.ctx.drawImage(cur.image, 0, 0, pos.w/100 * cur.w, pos.h/100 * cur.h);
//			this.ctx.rotate(-radians(s.r));
//			this.ctx.translate(-s.w / 2, -s.h / 2);
			this.ctx.restore();
		}
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
	this.globals = [];
	this.lines = [];
	this.stamps = [];
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
	this.renderer = new Renderer(document.getElementById("stage"), this);
	this.renderer.start();
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
		document.getElementById('ask').style.display = 'none';
		this.answer = document.getElementById('inp').value;
		this._callback(this.answer);
	}
	this.ask = function(q, c){
		var ask = document.getElementById("ask");
		ask.style.display = "";
		var qe = document.getElementById("question");
		var inp = document.getElementById("inp");
		this._callback = c;
		inp.focus()
		window.asker = this;
		ask.style.display = "";
		qe.innerHTML = q;
		
	}
	this.askInDialog = function(q){
		return prompt(q, "");
	}
	this.answer = function(){
		return this._answer;
	}
	this.showDialog = function(s){
		alert(s);
	}
}
