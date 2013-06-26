function trace(str) {
	console.log(str);
}

var DisplayObjectContainer = function() {
	this.x = 0;
	this.y = 0;
	this.width = 100;
	this.height = 100;
	this.alpha = 1;
	this.scaleX = 1;
	this.scaleY = 1;
	this.children = [];
	this.visible = true;
	this.numChildren = 0;
};

DisplayObjectContainer.prototype = {
	paint : function(context) {
		var tmp = [];
		$.each(this.children, function(i, child) {
			tmp.unshift(child);
		});
		$.each(tmp, function(i, child) {
			child.paint(context);
		});
	},

	addChild : function(child) {
		this.children.unshift(child);
		this.numChildren = this.children.length;
	},

	swapChildrenAt : function(index1, index2) {
		var tmp = this.children[index1];
		this.children[index1] = this.children[index2];
		this.children[index2] = tmp;
	},

	swapChildren : function(child1, child2) {
		var index1 = $.inArray(child1, this.children);
		var index2 = $.inArray(child2, this.children);
		this.swapChildrenAt(index1, index2);
	},

	setChildIndex : function(child, index) {
		var index0 = $.inArray(child, this.children);
		if (index0 > -1)
			this.children.splice(index0, 1);
		this.children.splice(index, 0, child);
		this.numChildren = this.children.length;
	},

	contains : function(child) {
		return $.inArray(child, this.children) > -1;
	},

	getChildIndex : function(child) {
		return $.inArray(child, this.children);
	}
};

var Stage = function(context) {
	DisplayObjectContainer.call();
	this.context = context;
	this.draw();
};

Stage.prototype = $.extend(new DisplayObjectContainer(), {
	draw : function() {
		this.context.clearRect(0, 0, this.context.canvas.width,
				this.context.canvas.height);

		this.paint(this.context);
		var self = this;
		setTimeout(function() {
			self.draw.call(self);
		}, 40);
	}
});

var Sprite = function() {
	DisplayObjectContainer.call();
};

Sprite.prototype = $.extend(new DisplayObjectContainer(), {

});

var Tween = function(obj, prop, start, end, duration) {
	this.target = obj;
	this.prop = prop;
	this.start = start;
	this.end = end;
	this.distance = end - start;
	this.duration = duration;
	this.firstTime = +new Date();
	this.eventListener = {};
	this.run();
};
var TweenEvent = {"END":"end"};
Tween.prototype = {
	run : function() {
		var now = +new Date();
		var pass = now - this.firstTime;
		//trace(pass);
		if (pass < this.duration) {
			this.lastTime = now;
			var newValue = this.start + this.distance * pass / this.duration;
			this.target[this.prop] = newValue;
			
			var self = this;
			setTimeout(function() {
				self.run.call(self);
			}, 10);
		} else {
			this.target[this.prop] = this.end;
			//trace(this.prop+" end");
			this.callEventListener(TweenEvent.END);
		}
	},
	callEventListener : function(event) {
		
		var listeners = this.eventListener[event];
		//trace("callEventListener "+event+" "+listeners);
		if(listeners!=undefined) {
			$.each(listeners, function(i, listener){
				listener();
			});
		}
	},
	addEventListener : function(event, listener) {
		var listeners = this.eventListener[event];
		if(listeners==undefined) {
			listeners = [];
			this.eventListener[event] = listeners;
		}
		listeners.push(listener);
		//trace("addEventListener "+event);
	}
};