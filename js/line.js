// drawline and its listener
hc.graphic.Line = function() {
	hc.graphic.Drawable.call(this);
	this.points = [];
	this.path = function(ctx) {
		var firstPoint = true;
		for ( var i in this.points) {
			if (firstPoint) {
				ctx.moveTo(this.points[i].x, this.points[i].y);
				firstPoint = false;
			} else {
				ctx.lineTo(this.points[i].x, this.points[i].y);
			}
		}
	};

	this.getCtrlPts = function(ctx) {
		var rings = [];
		for ( var i = 0; i < this.points.length; i++) {
			var p = this.points[i];
			rings.push(new hc.graphic.ControlRing(p, ctx.toUILoc(p)));
		}
		return rings;
	};
};
/**
 * The listener for create a line drawable
 */
hc.graphic.Line.creator = {
	onCreate : function(ctx) {
		this.pts=[];
		this.lpts=[];//lint points
		ctx.topContext2d.canvas.title='Press c to stop, alt+c to stop and close.';
	},
	onMousedown : function(ctx) {
		var l=ctx.loc;
		this.pts.push({x:l.x, y:l.y});
		l=ctx.crd;
		this.lpts.push({x:l.x, y:l.y});
	},
	onMousemove : function(ctx) {
		var pts = this.pts;
		if (pts.length == 0)
			return;
		var c=ctx.topContext2d;
		c.beginPath();
		c.moveTo(pts[0].x, pts[0].y);
		for(var i=1;i<pts.length;i++){
			c.lineTo(pts[i].x, pts[i].y);
		}
		c.lineTo(ctx.loc.x, ctx.loc.y);
		//console.log('stroke line:', c.strokeStyle, pts);
		c.stroke();
	},
	onKeyup : function(ctx, evt) {
		if (this.pts.length < 2)
			return;
		if ('C'.charCodeAt(0) == evt.keyCode) {//console.log(evt);
			var line=new hc.graphic.Line();
			line.points=this.lpts;
			if(evt.altKey)
				line.points.push(line.points[0]);
			ctx.commit(line);
			delete this.lpts, this.pts;
		}
	}
};