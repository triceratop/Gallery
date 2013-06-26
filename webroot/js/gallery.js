var images = [];
var canvas, context, config, stage;

var ImageSprite = function(image) {
	Sprite.call();
	this.image = image;
};

ImageSprite.prototype = $.extend(new Sprite(), {
	paint : function(context) {
		context.save();
		
		context.scale(this.scaleX, this.scaleY);
		// trace(this.image+", "+this.width+", "+this.height);
		context.fillStyle="rgb(0, 0, 0)";
		context.fillRect(this.x / this.scaleX, this.y / this.scaleY,
				this.width, this.height);
		context.fill();
		
		context.globalAlpha = this.alpha;
		context.drawImage(this.image, this.x / this.scaleX, this.y
				/ this.scaleY, this.width, this.height);
		context.restore();
	}
});

$(function() {
	// console.log($({x:10, y:20}).prop("x"));

	canvas = document.getElementById("canvas");

	context = canvas.getContext("2d");
	console.log("document loaded.");
	stage = new Stage(context);
	loadXML();
});

function loadXML() {
	$.get("../xml/imgLink.xml", onXMLLoad, "xml");
}

function onXMLLoad(xmlDoc) {
	console.log("xml loaded.");
	$("config", xmlDoc).each(function(i) {
		config = eval($(this).text());

	});

	$("image", xmlDoc).each(function(i) {
		console.log("node url: " + $(this).attr("url"));
		var img = new Image();
		img.src = $(this).attr("url");
		img.onload = onImageLoad;
	});
}

var h0 = 400;
function onImageLoad(e) {
	var img = e.target;
	trace(img.src + " loaded.");
	var imageSprite = new ImageSprite(img);
	images.push(imageSprite);
	stage.addChild(imageSprite);
	var index = images.length - 1;
	// trace("num: "+stage.numChildren);
	imageSprite.x = config[index].x;
	imageSprite.y = config[index].y;
	var ratio = imageSprite.image.width/imageSprite.image.height;
	imageSprite.width = ratio*h0;
	imageSprite.height = h0;
	imageSprite.scaleX = config[index].scale;
	imageSprite.scaleY = config[index].scale;
	imageSprite.alpha = config[index].alpha;
	if (images.length == config.length) {
		setImageLoad();
		$.each(images, function(i, imageSprite){
			var layer = config[i].layer;
			stage.setChildIndex(imageSprite, layer);
		});
	}
}

function setImageLoad() {
	var tmp = images.shift();
	images.push(tmp);
	
	$.each(images, function(index, imageSprite) {
		var x0 = imageSprite.x;
		var y0 = imageSprite.y;
		var scale0 = imageSprite.scaleX;
		var alpha0 = imageSprite.alpha;
		// imageSprite.x = config[index].x;
		// imageSprite.y = config[index].y;

		var ratio = imageSprite.image.width/imageSprite.image.height;
		imageSprite.width = ratio*h0;
		imageSprite.height = h0;
		// imageSprite.scaleX = config[index].scale;
		// imageSprite.scaleY = config[index].scale;
		// imageSprite.alpha = config[index].alpha;
		var layer = config[index].layer;
		//stage.setChildIndex(imageSprite, layer);

		
		var t1 = new Tween(imageSprite, "x", x0, config[index].x, 1000);
		var t2 = new Tween(imageSprite, "y", y0, config[index].y, 1000);
		var t3 = new Tween(imageSprite, "scaleX", scale0, config[index].scale,
				1000);
		var t4 = new Tween(imageSprite, "scaleY", scale0, config[index].scale,
				1000);
		
		var t5 = new Tween(imageSprite, "alpha", alpha0, config[index].alpha,
				1000);

		
		t1.addEventListener(TweenEvent.END, function() {
			stage.setChildIndex(imageSprite, layer);
			//trace("END!!!!!!!!!!!!!!!");
		});
	});

	var log = "";
	$.each(images, function(index, imageSprite) {
		log += stage.getChildIndex(imageSprite) + " ";
	});
	trace(log);

	setTimeout(setImageLoad, 5000);
}
