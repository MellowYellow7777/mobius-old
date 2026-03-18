function vector(...contents) {
    var v = new Vector();
    if (contents.length == 1
        && Array.isArray(contents[0])
    ) contents = contents[0];
    contents.forEach((item,i) => {
        v[i] = item;
    });
    return v;
}

class Vector extends Array {
    constructor(...contents) {
        if (contents.length == 1
            && Array.isArray(contents[0])
        ) contents = contents[0];
        super(contents.length)
        contents.forEach((item,i) => {
            this[i] = item;
        });
    }

    static add(v1,v2) {
        return vector(v1).addeq(v2);
    }
    static sub(v1,v2) {
        return vector(v1).subeq(v2);
    }
    static mul(v,n) {
        return vector(v).muleq(n);
    }
    static div(v,n) {
        return vector(v).diveq(n);
    }
    static dot(v1,v2) {
        return v1.map((item,i) => item * v2[i]).reduce((a,v) => a + v, 0);
    }
    static norm(v) {
        return this.dot(v,v);
    }
    static abs(v) {
        return Math.sqrt(this.norm(v));
    }
    static unit(v) {
        return this.div(v,this.abs(v));
    }
    static unit0(v) {
        if (this.abs(v) == 0) return new Vector(0,0);
        return this.div(v,this.abs(v));
    }
    static proj(v1,v2) {
        return this.dot(v1,v2)/this.abs(v2);
    }
    static angle(v1,v2) {
        return Math.acos(this.dot(v1,v2)/this.abs(v1)/this.abs(v2));
    }
    static intersect(v1,d1,v2,d2) {
        return this.mul(d1,this.cross(this.sub(v2,v1),d2)/this.cross(d1,d2)).add(v1);
    }

    static pintersect(p1,p2,p3,p4) {
        return this.intersect(p1,this.sub(p2,p1),p3,this.sub(p4,p3));
    }
    static dist(p1,p2) {
        return this.abs(this.sub(p2,p1));
    }

    copy() {
        return new Vector(this);
    }

    addeq(vector) {
        vector.forEach((item,i) => this[i] += item);
        return this;
    }
    subeq(vector) {
        vector.forEach((item,i) => this[i] -= item);
        return this;
    }
    muleq(n) {
        this.forEach((_,i) => this[i] *= n);
        return this;
    }
    diveq(n) {
        this.forEach((_,i) => this[i] /= n);
        return this;
    }
    add(vector) {
        return this.copy().addeq(vector);
    }
    sub(vector) {
        return this.copy().subeq(vector);
    }
    mul(number) {
        return this.copy().muleq(number);
    }
    div(number) {
        return this.copy().diveq(number);
    }
    dot(vector) {
        return this.map((item,i) => item * vector[i]).reduce((a,v) => a + v, 0);
    }
    norm() {
        return this.dot(this);
    }
    abs() {
        return Math.sqrt(this.norm());
    }
    unit() {
        return this.div(this.abs());
    }
    proj(v) {
        return this.dot(v) / Vector.abs(v);
    }
    angle(v) {
        return Math.acos(this.dot(v)/this.abs()/Vector.abs(v));
    }

  normalize() {
    let m = this.abs();
    if (m === 0) return this.copy();
    return this.div(m);
  }

    get x() {
        return this[0];
    }
    set x(x) {
        this[0] = x;
    }
    get y() {
        return this[1];
    }
    set y(y) {
        this[1] = y;
    }
    get z() {
        return this[2];
    }
    set z(z) {
        this[2] = z;
    }

    static cross(v1,v2) {
        if (v1.length == 2) {
            return v1[0] * v2[1] - v1[1] * v2[0];
        } else if (v1.length == 3) {
            return new Vector(
                v1[1] * v2[2] - v1[2] * v2[1],
                v1[2] * v2[0] - v1[0] * v2[2],
                v1[0] * v2[1] - v1[1] * v2[0]
            );
        }
    }
    cross(v) {
        if (this.length == 2) {
            return this.x * v[1] - this.y * v[0];
        } else if (this.length == 3) {
            return new Vector(
                this.y * v[2] - this.z * v[1],
                this.z * v[0] - this.x * v[2],
                this.x * v[1] - this.y * v[0]
            );
        }
    }

    static triple(v1,v2,v3) {
        return this.dot(v1,this.cross(v2,v3));
    }
    static vtriple(v1,v2,v3) {
        return this.cross(v1,this.cross(v2,v3));
    }

    
    goto(vector) {
        vector.forEach((item,i) => {
            this[i] = item;
        });
        return this;
    }

    multMatrix(matrix) {
        return new Vector(matrix.map(row => this.dot(row)));
    }
}

