class Pen extends Vector {
    constructor (ctx) {
        super();
        this.ctx = ctx;
    }
    beginPath() {this.ctx.beginPath();}
    closePath() {this.ctx.closePath();}
    stroke() {this.ctx.stroke();}
    fill() {this.ctx.fill();}

    moveTo(vector) {
        this.goto(vector || this);
        var pos = this.toCtxCoords();
        this.ctx.moveTo(pos.x,pos.y);
    }
    lineTo(vector) {
        this.goto(vector || this);
        var pos = this.toCtxCoords();
        this.ctx.lineTo(pos.x,pos.y);
    }
    moveBy(vector) {
        this.moveTo(this.add(vector));
    }
    lineBy(vector) {
        this.moveTo(this.add(vector));
    }
    moveTo3d(vector) {
        this.moveTo(Cfpv(vector));
    }
    lineTo3d(vector) {
        this.lineTo(Cfpv(vector));
    }
    drawLine3d(v1,v2) {
        var v1 = new Vector(v1), v2 = new Vector(v2),
            sp1 = Cfpv(v1), sp2 = Cfpv(v2),
            sint = sin(player.theta), sinp = sin(player.phi),
            cost = cos(player.theta), cosp = cos(player.phi),
            px = player.x, x1 = v1[0], x2 = v2[0],
            py = player.y, y1 = v1[1], y2 = v2[1],
            pz = player.z, z1 = v1[2], z2 = v2[2],
            
            t1 = ((px-x1)*(cost+sint*cosp)+(py-y1)*(sint-cost*cosp)-(pz-z1)*(sinp))
                /((x2-x1)*(cost+sint*cosp)+(y2-y1)*(sint-cost*cosp)-(z2-z1)*(sinp)),

            t2 = ((px-x1)*(cost-sint*cosp)+(py-y1)*(sint+cost*cosp)+(pz-z1)*(sinp))
                /((x2-x1)*(cost-sint*cosp)+(y2-y1)*(sint+cost*cosp)+(z2-z1)*(sinp)),

            t3 = ((px-x1)*(sint*(sinp+cosp))-(py-y1)*(cost*(sinp+cosp))+(pz-z1)*(cosp-sinp))
                /((x2-x1)*(sint*(sinp+cosp))-(y2-y1)*(cost*(sinp+cosp))+(z2-z1)*(cosp-sinp)),

            t4 = ((px-x1)*(sint*(sinp-cosp))-(py-y1)*(cost*(sinp-cosp))+(pz-z1)*(cosp+sinp))
                /((x2-x1)*(sint*(sinp-cosp))-(y2-y1)*(cost*(sinp-cosp))+(z2-z1)*(cosp+sinp)),

            f = t => v1.add(v2.sub(v1).mul(t)),

            ta = [t1,t2,t3,t4].filter(t => 0 < t && t < 1),
            tb = ta.filter(t => Cfpv(f(t)) && abs(Cfpv(f(t)).x) < 10 + epsilon && abs(Cfpv(f(t)).y) < 10 + epsilon),
            tmin = tb.length ? min.apply(null,tb) : -1,
            tmax = tb.length ? tb.length == 1 ? tmin : min.apply(null,tb.filter(t => t != tmin)) : -1;

        if (sp1 && abs(sp1.x) < 10 && abs(sp1.y) < 10) tmax = 0;
        if (sp2 && abs(sp2.x) < 10 && abs(sp2.y) < 10) tmin = 1;

        var pmin = f(tmin),
            pmax = f(tmax);

        if (Cfv(pmin).y <=0) return;
        if (Cfv(pmax).y <=0) return;
        if (Vector.dist(pmin,pmax)<epsilon) return;

        this.beginPath();
        this.moveTo3d(pmin);
        this.lineTo3d(pmax);
        this.stroke();
        this.closePath();
    }
    clear() {
        this.color = 'black';
        this.ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    static toCtxCoords(vector) {
        vector = vector.mul(canvas.width / 20);
        return new Vector(vector.x + canvas.width / 2, canvas.height / 2 - vector.y)
    }
    toCtxCoords() {
        return Pen.toCtxCoords(this);
    }
    get color() {
        return this.ctx.strokeStyle;
    }
    set color(color) {
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
    }
    get size() {
        return this.ctx.lineWidth;
    }
    set size(size) {
        this.ctx.lineWidth = size;
    }

    get lineCap() {
        return this.ctx.lineCap;
    }
    set lineCap(lineCap) {
        this.ctx.lineCap = lineCap;
    }

    get lineJoin() {
        return this.ctx.lineJoin;
    }
    set lineJoin(lineJoin) {
        this.ctx.lineJoin = lineJoin;
    }

}