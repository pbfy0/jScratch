function rgbToHsv (a) {
	//var result = new HSV(0, 0, 0);

	//r = RGB.r / 255;
	//g = RGB.g / 255;
	//b = RGB.b / 255;
	var r = a[0]/ 255;
	var g = a[1]/ 255;
	var b = a[2]/ 255;
	var h = 0;
	var s = 0;
	var v = 0;

	var minVal = Math.min(r, g, b);
	var maxVal = Math.max(r, g, b);
	var delta = maxVal - minVal;

	v = maxVal;

	if (delta == 0) {
		h = 0;
		s = 0;
	} else {
		s = delta / maxVal;
		var del_R = (((maxVal - r) / 6) + (delta / 2)) / delta;
		var del_G = (((maxVal - g) / 6) + (delta / 2)) / delta;
		var del_B = (((maxVal - b) / 6) + (delta / 2)) / delta;

		if (r == maxVal) { h = del_B - del_G; }
		else if (g == maxVal) { h = (1 / 3) + del_R - del_B; }
		else if (b == maxVal) { h = (2 / 3) + del_G - del_R; }

		if (h < 0) { h += 1; }
		if (h > 1) { h -= 1; }
	}

	h = Math.round(h * 360);
	s = Math.round(s * 100);
	v = Math.round(v * 100);

	return [h, s, v];
}

function hsvToRgb (a) { 
	//var h = HSV.h / 360;
	//var s = HSV.s / 100;
	//var v = HSV.v / 100;
        var h = a[0]/ 360;
        var s = a[1]/ 100;
        var v = a[2]/ 100;
	var r = 0;
	var g = 0;
	var b = 0;

	if (s == 0) {
		r = v * 255;
		g = v * 255;
		b = v * 255;
	} else {
		var_h = h * 6;
		var_i = Math.floor(var_h);
		var_1 = v * (1 - s);
		var_2 = v * (1 - s * (var_h - var_i));
		var_3 = v * (1 - s * (1 - (var_h - var_i)));

		if (var_i == 0) {var_r = v; var_g = var_3; var_b = var_1}
		else if (var_i == 1) {var_r = var_2; var_g = v; var_b = var_1}
		else if (var_i == 2) {var_r = var_1; var_g = v; var_b = var_3}
		else if (var_i == 3) {var_r = var_1; var_g = var_2; var_b = v}
		else if (var_i == 4) {var_r = var_3; var_g = var_1; var_b = v}
		else {var_r = v; var_g = var_1; var_b = var_2};

		r = var_r * 255;
		g = var_g * 255;
		b = var_b * 255;

		/*r = Math.round(var_r * 255);
		g = Math.round(var_g * 255);
		b = Math.round(var_b * 255);*/
	}
	r = Math.round(r);
        g = Math.round(g);
        b = Math.round(b);

	return [r, g, b];
}
