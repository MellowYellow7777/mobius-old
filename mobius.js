const pi = Math.PI, 
    tau = 2 * pi,
    pi2 = pi / 2,
    pi3 = 3 * pi2,
    epsilon = 10e-9,
    mod = (n,d) => ((n % d) + d) % d,
    sin = Math.sin,
    cos = Math.cos,
    min = Math.min,
    max = Math.max,
    abs = Math.abs;

var flength, theta, player;

function C(x,y,z) {
    if (y <= 0) return;
    return new Vector(
        x * flength / y,
        z * flength / y,
    );
}

function Cv(vector) {
    return C.apply(null,vector);
}

function Cfp(x,y,z) {
    return Cv(
        (new Vector(x,y,z))
        .sub(player)
        .multMatrix(Matrix.rZ(-player.theta))
        .multMatrix(Matrix.rX(-player.phi))
    )
}

function Cf(x,y,z) {
    return (new Vector(x,y,z))
        .sub(player)
        .multMatrix(Matrix.rZ(-player.theta))
        .multMatrix(Matrix.rX(-player.phi))
}

function Cfv(vector) {
    return Cf.apply(null,vector);
}

function Cfpv(vector) {
    return Cfp.apply(null,vector);
}

Matrix = {
    rX(theta) {
        return [
            [1,0,0],
            [0,cos(theta),-sin(theta)],
            [0,sin(theta),cos(theta)],
        ];
    },
    rY(theta) {
        return [
            [cos(theta),0,sin(theta)],
            [0,1,0],
            [-sin(theta),0,cos(theta)],
        ];
    },
    rZ(theta) {
        return [
            [cos(theta),-sin(theta),0],
            [sin(theta),cos(theta),0],
            [0,0,1],
        ];
    },
};

Verticies = [[-3,-3,0],[-4,-3,0],[-3,-4,0],[-4,-4,0],[-3,-3,3],[-4,-3,3],[-3,-4,3],[-4,-4,3],[-4,3,2],[-3,3,2],[-4,-2,2],[-3,-2,2],[-4,3,0],[-3,3,0],[-4,-2,0],[-3,-2,0],[-1,2,1],[-2,2,1],[-1,3,1],[-2,3,1],[-1,2,0],[-2,2,0],[-1,3,0],[-2,3,0],[0,3,0],[2,3,0],[0,2,0],[2,2,0],[0,3,1],[2,3,1],[0,2,1],[2,2,1],[3,1,2],[1,1,2],[3,-1,2],[1,-1,2],[3,1,0],[1,1,0],[3,-1,0],[1,-1,0],[3,-2,2],[1,-2,2],[3,-4,2],[1,-4,2],[3,-2,1.5],[1,-2,1.5],[3,-4,1.5],[1,-4,1.5]];


Edges = [[1,2],[1,3],[2,4],[3,4],[1,5],[2,6],[3,7],[4,8],[5,6],[5,7],[6,8],[7,8],[9,10],[9,11],[10,12],[11,12],[9,13],[10,14],[11,15],[12,16],[13,14],[13,15],[14,16],[15,16],[17,18],[17,19],[18,20],[19,20],[17,21],[18,22],[19,23],[20,24],[21,22],[21,23],[22,24],[23,24],[25,26],[25,27],[26,28],[27,28],[25,29],[26,30],[27,31],[28,32],[29,30],[29,31],[30,32],[31,32],[33,34],[33,35],[34,36],[35,36],[33,37],[34,38],[35,39],[36,40],[37,38],[37,39],[38,40],[39,40],[41,42],[41,43],[42,44],[43,44],[41,45],[42,46],[43,47],[44,48],[45,46],[45,47],[46,48],[47,48]]

Faces = [
[1,5,6,2],
[2,6,7,3],
[3,7,8,4],
[4,8,5,1],
[5,8,7,6],
[1,2,3,4]]

function init() {
    flength = 10;
    pen.lineCap = 'round';
    pen.lineJoin = 'round';
    player = new Vector(-5,5,5);
    player._theta = 3.92699081699;
    player._phi = -0.785398163397;
    player.speed = .15;
    player.sensitivity = .05;
    Object.defineProperties(player, {
        theta: {
            get() {return this._theta},
            set(theta) {this._theta = mod(theta - pi,tau) + pi}
        },
        phi: {
            get() {return this._phi},
            set(phi) {this._phi = max(-pi/2,min(pi/2,phi))}
        }
    })
}
function update() {};

function draw() {
    pen.clear();

    pen.size = 1;
    pen.color = 'white';
    pen.drawLine3d([-5,-5,0],[5,-5,0]);

Window.t= []

    pen.color = 'white';
    pen.size = .25;
    for(let i = -5; i <= 5; i+=.2) {
        pen.drawLine3d([i,-5,0],[i,5,0]);
        pen.drawLine3d([-5,i,0],[5,i,0]);
    }
 
    pen.size = 1;
    for(let i = -5; i <= 5; i++) {
        pen.drawLine3d([i,-5,0],[i,5,0]);
        pen.drawLine3d([-5,i,0],[5,i,0]);
    }

}