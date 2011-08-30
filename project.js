function start(){
new World([
	{name: 'a', costumes: [
		'greenflag.png', 'stopsign.png'
	]},
	{name: 'b', costumes: [
		'stopsign.png'
	]}
]);
world.greenFlagRegister(function(){
var spr = world.sprites[0];
spr.goToXY(12,34);
spr.penDown();
setInterval(function(){
	spr.moveSteps(2);
	spr.turnClockwise(util.radians(2));
}, 100);
});
}
