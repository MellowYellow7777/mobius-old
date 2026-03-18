const mod = (n,d) => ((n % d) + d) % d;
const pi = Math.PI;
const tau = 2 * pi;
const min = Math.min;
const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const abs = Math.abs;
const sqrt = Math.sqrt;

fn = (x,y) => sin(x)*sin(y);

function setFn(fn, xRange = [-5, 5], yRange = [-5, 5], resolution = 40) {
  Polyhedra.all.length = 0;
  let [xMin, xMax] = xRange;
  let [yMin, yMax] = yRange;
  let dx = (xMax - xMin) / resolution;
  let dy = (yMax - yMin) / resolution;

  let vertices = [];
  let edges = new Set();  // Using a set to avoid duplicate edges
  let faces = [];

  let indexMap = new Map();
  let index = 0;

  // Generate vertices and store their indices
  for (let i = 0; i <= resolution; i++) {
    for (let j = 0; j <= resolution; j++) {
      let x = xMin + i * dx;
      let y = yMin + j * dy;
      let z = fn(x, y);

      let vertex = new Vector(x, y, z);
      vertices.push(vertex);
      indexMap.set(`${i},${j}`, index++);
    }
  }

  // Generate faces (quads split into two triangles) for both top and bottom
  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      let idx1 = indexMap.get(`${i},${j}`);
      let idx2 = indexMap.get(`${i+1},${j}`);
      let idx3 = indexMap.get(`${i},${j+1}`);
      let idx4 = indexMap.get(`${i+1},${j+1}`);

      // Store edges (avoiding duplicates)
      edges.add(`${idx1},${idx2}`);
      edges.add(`${idx2},${idx4}`);
      edges.add(`${idx4},${idx3}`);
      edges.add(`${idx3},${idx1}`);

      // Top side
      faces.push([idx1, idx2, idx3]); // Triangle 1
      faces.push([idx2, idx4, idx3]); // Triangle 2

      // Bottom side (inverted normals)
      faces.push([idx3, idx2, idx1]); // Triangle 1 (flipped)
      faces.push([idx3, idx4, idx2]); // Triangle 2 (flipped)
    }
  }

  // Convert edge set to array of edge pairs
  let edgesArray = Array.from(edges).map(e => e.split(',').map(Number));

  new Polyhedra(vertices, edgesArray, faces);
}


var canvas, ctx, as;

window.onload = function(event) {

  document.body.style.margin = 0;

  canvas = document.createElement('canvas');
  ctx = canvas.getContext('2d');

  //ctx.imageSmoothingEnabled = false;

  document.body.appendChild(canvas);

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    as = canvas.width / canvas.height;
  }

  window.onresize = resize;

  resize();

  canvas.requestPointerLock = canvas.requestPointerLock 
    || canvas.mozRequestPointerLock 
    || canvas.webkitRequestPointerLock;

canvas.onclick = function(event) {
  canvas.requestPointerLock();

  const lockedElement = document.pointerLockElement 
    || document.mozPointerLockElement 
    || document.webkitPointerLockElement;

  if (lockedElement === canvas && hovering[0] !== null && hovering[1] !== null) {
    mirrorDodecahedronAcrossFace(...hovering);
  }
};

  document.onmousemove = function(event) {
    if (document.pointerLockElement === null) return;

    var ptheta0 = camera.theta,
        pphi0 = camera.phi,
        wsize = -min(window.innerWidth,window.innerHeight)/1,
        mdx = (event.movementX || event.mozMovementX || event.webkitMovementX || 0)/wsize,
        mdy = (event.movementY || event.mozMovementY || event.webkitMovementY || 0)/wsize;

    setTheta(ptheta0 + 2 * mdx);
    setPhi(pphi0 + 2 * mdy);
  }

  keys = {
    w: false, a: false, s: false, d: false,
    up: false, down: false, left: false, right: false,
    shift: false,
    space: false,
    wasd() {
      var x = this.d - this.a;
      var y = this.w - this.s;
      var abs = sqrt(x * x + y * y);
      x /= abs; y /= abs;
      return [x,y];
    },
    arrows() {
      var x = this.right - this.left;
      var y = this.up - this.down;
      var abs = sqrt(x * x + y * y);
      x /= abs; y /= abs;
      return [x,y];
    },
    vert() {
      return this.space * (1 - 2 * this.shift);
    }
  };
(update => {
  window.onkeydown = update(1);
  window.onkeyup = update(0);
})(value => event => {
  var k;
  switch (event.code) {
    case 'KeyW':
    case 'KeyA':
    case 'KeyS':
    case 'KeyD':
      k = event.code[3].toLowerCase(); break;
    case 'ArrowUp':
    case 'ArrowLeft':
    case 'ArrowDown':
    case 'ArrowRight':
      k = event.code.slice(5).toLowerCase(); break;
    case 'ShiftLeft':
    case 'ShiftRight':
      k = 'shift'; break;
    case 'Space':
      k = 'space'; break;
    default: return;
  }
  keys[k] = value;
})
  
  init();
  loop();
}

var camera;

var sin_t, cos_t, sin_p, cos_p;

var v1,v2;

var hovering;

function init() {
  sun = new Vector(75,100,125);
  camera = new Vector(-5,-5,0);
  setTheta(0);
  setPhi(0);

  pspeed = .035;
  psensitivity = .025;

dodecahedron = new Polyhedra(
[[0.11802045374397556,0.363230280945104,1],[0.11802045374397556,-0.363230280945104,1],[0.19096038556482897,-0.5877512636652169,0.6180792288703421],[0.5,-0.363230280945104,0.38203832138239097],[0.38192077112965794,0,1],[0.617961678617609,0,0.6180792288703421],[0.5,0.363230280945104,0.38203832138239097],[0.19096038556482897,0.5877512636652169,0.6180792288703421],[-0.19096038556482897,-0.5877512636652169,0.3819795462560244],[-0.30903961443517103,-0.22452098272011284,0.9999412248736336],[0.30903961443517103,-0.22452098272011284,0.00005877512636652169],[-0.5,-0.363230280945104,0.6180204537439756],[0.30903961443517103,0.22452098272011284,0.00005877512636652169],[-0.11802045374397556,-0.363230280945104,0.00005877512636652169],[-0.30903961443517103,0.22452098272011284,0.9999412248736336],[-0.5,0.363230280945104,0.6180204537439756],[-0.617961678617609,0,0.38192077112965794],[-0.38192077112965794,0,0],[-0.19096038556482897,0.5877512636652169,0.3819795462560244],[-0.11802045374397556,0.363230280945104,0.00005877512636652169]].map(arr => new Vector(arr))
,
[[0,14],[14,9],[9,1],[1,4],[4,0],[0,7],[4,5],[1,2],[9,11],[14,15],[15,16],[16,11],[11,8],[8,2],[2,3],[3,5],[5,6],[6,7],[7,18],[18,15],[15,16],[16,11],[8,13],[3,10],[6,12],[18,19],[16,17],[10,12],[12,19],[19,17],[17,13],[13,10]]
,
[[1,9,14,0,4],[3,2,1,4,5],[6,5,4,0,7],[18,7,0,14,15],[16,15,14,9,11],[8,11,9,1,2],[19,18,15,16,17],[17,16,11,8,13],[13,8,2,3,10],[10,3,5,6,12],[12,6,7,18,19],[13,10,12,19,17]]
);
/*

new Polyhedra(
[[ 1, 1, 1],
 [ 1,-1,-1],
 [-1, 1,-1],
 [-1,-1, 1]].map(a => a.map(n => n-2)),
[[1,2],[1,3],[1,4],[2,3],[3,4],[4,2]].map(a => a.map(n => n-1)),
[[1,2,4],[1,4,3],[2,3,4],[1,3,2]].map(a => a.map(n => n-1))
)


new Polyhedra(
[[ 1, 0, 0],
 [-1, 0, 0],
 [ 0, 1, 0],
 [ 0,-1, 0],
 [ 0, 0, 1],
 [ 0, 0,-1]].map(a => a.map((n,i) => i == 1 ? n + 2 : n)),
[[1,2],[1,3],[1,4],[2,3],[3,4],[4,2]].map(a => a.map(n => n-1)),
[[1,5,3],[3,5,2],[2,5,4],[4,5,1],[3,6,1],[2,6,3],[4,6,2],[1,6,4]].map(a => a.map(n => n-1))
)

new PolyRect([1.5,1.5,2],[2.5,2.5,3]);


new PolyRect([-38,16,145],[340,208,427]);


new PolyRect([346,-396,30],[376,-314,485]);


new PolyRect([-140,-278,-413],[97,-119,196]);



new PolyRect([-454,-376,146],[-333,239,351]);


new PolyRect([125,-161,-333],[499,81,-106]);


*/
}

function setTheta(theta) {
  camera.theta = mod(theta + pi, tau) - pi;
  sin_t = sin(theta);
  cos_t = cos(theta);
  trig_stuff();
}
function setPhi(phi) {
  camera.phi = min(pi/2, max(-pi/2, phi));
  sin_p = sin(phi);
  cos_p = cos(phi);
  trig_stuff();
}

function trig_stuff(t,p) {
  sc = sin_t*cos_p;
  ss = sin_t*sin_p;
  cs = cos_t*sin_p;
  cc = cos_t*cos_p;
}

function upd() {
  var wasd = keys.wasd(),
    arrows = keys.arrows(),
    vert = keys.vert();

  if (abs(wasd[0])||abs(wasd[1])) {
    camera.x -= pspeed * (-wasd[0] * cos_t + wasd[1] * sin_t);
    camera.y -= pspeed * (-wasd[0] * sin_t - wasd[1] * cos_t);
   }
  if (abs(arrows[0])||abs(arrows[1])) {
    setTheta(camera.theta - psensitivity * arrows[0]);
    setPhi(camera.phi + psensitivity * arrows[1]);
  }
  if (abs(vert)) {
    camera.z += pspeed * vert;
  }
}

function loop() {
requestAnimationFrame(loop);
upd();
draw();
}

var cd;

function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.lineCap = 'round';
  ctx.lineWidth = 1;
  ctx.strokeStyle = 'white';

  var [cx,cy,cz] = camera;

  cd = new Vector(cx-sc,cy+cc,cz+sin_p);

  var mid_top = new Vector(
    cx - sc + ss,
    cy + cc - cs,
    cz + sin_p + cos_p
  );
  var mid_bot = new Vector(
    cx - sc - ss,
    cy + cc + cs,
    cz + sin_p - cos_p
  );

  var tr = new Vector(
    cx - sc + cos_t + ss,
    cy + cc + sin_t - cs,
    cz + sin_p + cos_p
  );
  var tl = new Vector(
    cx - sc - cos_t + ss,
    cy + cc - sin_t - cs,
    cz + sin_p + cos_p
  );
  var br = new Vector(
    cx - sc + cos_t - ss,
    cy + cc + sin_t + cs,
    cz + sin_p - cos_p
  );
  var bl = new Vector(
    cx - sc - cos_t - ss,
    cy + cc - sin_t + cs,
    cz + sin_p - cos_p
  );

  top_right = mid_top.add(tr.sub(mid_top).mul(as));
  top_left = mid_top.add(tl.sub(mid_top).mul(as));
  bottom_right = mid_bot.add(br.sub(mid_bot).mul(as));
  bottom_left = mid_bot.add(bl.sub(mid_bot).mul(as));

  right_plane = plane_eq(camera,top_right,bottom_right);
  left_plane = plane_eq(camera,top_left,bottom_left);
  top_plane = plane_eq(camera,top_left,top_right);
  bottom_plane = plane_eq(camera,bottom_left,bottom_right);

  in_right = v => (
    right_plane.a * v.x + 
    right_plane.b * v.y + 
    right_plane.c * v.z + 
    right_plane.d
  ) > 0;
  in_left = v => (
    left_plane.a * v.x + 
    left_plane.b * v.y + 
    left_plane.c * v.z + 
    left_plane.d
  ) < 0;
  in_top = v => (
    top_plane.a * v.x + 
    top_plane.b * v.y + 
    top_plane.c * v.z + 
    top_plane.d
  ) > 0;
  in_bottom = v => (
    bottom_plane.a * v.x + 
    bottom_plane.b * v.y + 
    bottom_plane.c * v.z + 
    bottom_plane.d
  ) < 0;

  intersect_right = (v1,v2) =>
    line_plane_intersection(v2,v1,right_plane);
  intersect_left = (v1,v2) =>
    line_plane_intersection(v2,v1,left_plane);
  intersect_top = (v1,v2) =>
    line_plane_intersection(v2,v1,top_plane);
  intersect_bottom = (v1,v2) =>
    line_plane_intersection(v2,v1,bottom_plane);

  var faces = Polyhedra.all.map(poly => poly.faces).flat();

  faces.forEach(face => {
    var points = face.vertices;

    this.center = new Vector(
      points.reduce((a,v) => a + v[0], 0),
      points.reduce((a,v) => a + v[1], 0),
      points.reduce((a,v) => a + v[2], 0)
    );

    face.normal = Vector.triple(
      camera.sub(points[0]),
      points[2].sub(points[0]),
      points[1].sub(points[0])
    );

    face.render = face.normal >= 0;

    if (!face.render) return;

    face.lighting = (2 * Vector.dot(
      Vector.unit(sun.sub(points[0])),
      Vector.unit(Vector.cross(
        points[2].sub(points[0]),
        points[1].sub(points[0])
      ))) + 3) / 5;

    var points = face.vertices;

    points = suthHodg(points, in_left, intersect_left);
    points = suthHodg(points, in_top, intersect_top);
    points = suthHodg(points, in_right, intersect_right);
    points = suthHodg(points, in_bottom, intersect_bottom);

    face.points = points;

    face.render = face.points.length >= 3;

    face.projected = points.map(p => toScreen.apply(null, Cfpv(p)));
  });

  faces = faces.filter(face => face.render);

  hovering = faces.filter(face => {
    var plane = plane_eq(...face.vertices.slice(0,3));
    var intersection = line_plane_intersection(camera, cd, plane);
    if (!intersection) return false;
    return pointInConvexPolygon(intersection, face.vertices, plane);
  });

hovering = hovering.sort((a,b) => {
  var d = face => Math.max(...face.vertices.map(v => Vector.dist(camera, v)));
  return d(b) - d(a);
}).toReversed()[0];

  if (hovering) {
    hovering = [Polyhedra.all.find(p => p.faces.find(f => f === hovering)), hovering];
  } else {
    hovering = [null,null];
  }

  faces = faces.sort((a,b) => {
  var d = face => Math.max(...face.vertices.map(v => Vector.dist(camera, v)));
  return d(b) - d(a);
})

  faces.forEach(face => {face.draw(); face.stroke();});

  drawCrosshairs();

  ctx.lineWidth = 8;
  ctx.strokeStyle = 'magenta';

  point(...top_left);
  point(...top_right);
  point(...bottom_left);
  point(...bottom_right);

  ctx.strokeStyle = 'cyan';

  point(...camera);
  
}

function drawCrosshairs() {
  var w2 = canvas.width / 2;
  var h2 = canvas.height / 2;

  ctx.strokeStyle = 'white';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w2-5+.5,h2+.5);
  ctx.lineTo(w2+5+.5,h2+.5);
  ctx.moveTo(w2+.5,h2-5+.5);
  ctx.lineTo(w2+.5,h2+5+.5);
  ctx.stroke();
  ctx.closePath();
}

function mirrorDodecahedronAcrossFace(poly, mirrorFace) {
  // 1. Compute the mirror plane.
  // Use three points from the face to define the plane.
  let a = mirrorFace.vertices[0];
  let b = mirrorFace.vertices[1];
  let c = mirrorFace.vertices[2];
  let n = b.sub(a).cross(c.sub(a)).normalize();  // normal of the mirror face

  // 2. Reflect each vertex across the plane.
  // Reflection formula: v' = v - 2 * (v - a).dot(n) * n
  const reflectedVertices = poly.vertices.map(v => {
    let toV = v.sub(a);
    let d = toV.dot(n);
    return v.sub(n.mul(2 * d));
  });

  // 3. Reconstruct edge connectivity.
  // Assuming poly.edges was built using index pairs,
  // we recover the indices from the original vertices array.
  const newEdges = poly.edges.map(edge => {
    let i1 = poly.vertices.indexOf(edge.v1);
    let i2 = poly.vertices.indexOf(edge.v2);
    return [i1, i2];
  });

  // 4. Reconstruct face connectivity.
  // For each face, create an array of indices.
  // Reverse the vertex order for every face except the mirror face.
  const newFaces = poly.faces.map(face => {
    let indices = face.vertices.map(v => poly.vertices.indexOf(v));
    indices.reverse();
    return indices;
  });

  // 5. Create and return the new (mirrored) polyhedron.
  let mirroredPoly = new Polyhedra(reflectedVertices, newEdges, newFaces);
  return mirroredPoly;
}


suthHodg = (points,inside,intersect) => {

  var new_points = [];

  for(i = 0; i < points.length; i++) {
    var j = (i + 1) % points.length;
    var i_point = points[i];
    var j_point = points[j];

    var i_in = inside(i_point);
    var j_in = inside(j_point);

    
    if (i_in == j_in) {
      if (i_in) new_points.push(i_point)
    } else if (i_in) {
      new_points.push(i_point);
      new_points.push(intersect(i_point,j_point));
    } else if (j_in) {
      new_points.push(intersect(i_point,j_point));
    }
  }

  return new_points;
}

CanvasRenderingContext2D.prototype.vmoveTo = function(vector) {
  this.moveTo(vector.x,vector.y);
}
CanvasRenderingContext2D.prototype.vlineTo = function(vector) {
  this.lineTo(vector.x,vector.y);
}

line_plane_intersection = (p,q,plane) => {
  var d = (
    plane.a * (q.x - p.x) +
    plane.b * (q.y - p.y) +
    plane.c * (q.z - p.z)
  );
  var t = -(
    plane.a * p.x +
    plane.b * p.y +
    plane.c * p.z +
    plane.d
  ) / d;

  return p.add(q.sub(p).mul(t));
}

plane_eq = (A,B,C) => {
  var a = (B.y - A.y) * (C.z - A.z) - (C.y - A.y) * (B.z - A.z),
    b = (B.z - A.z) * (C.x - A.x) - (C.z - A.z) * (B.x - A.x),
    c = (B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y),
    d = -(a * A.x + b * A.y + c * A.z);

  return {a,b,c,d};
}

function pointInConvexPolygon(pt, poly, plane) {
  // Create a normal vector from the plane coefficients.
  let normal = new Vector(plane.a, plane.b, plane.c);
  
  // Loop over each edge of the polygon.
  for (let i = 0; i < poly.length; i++) {
    let current = poly[i];
    let next = poly[(i + 1) % poly.length];
    let edge = next.sub(current);
    let toPoint = pt.sub(current);
    let cross = edge.cross(toPoint);
    
    // If the dot product is negative, pt is outside for this edge.
    if (normal.dot(cross) < 0) {
      return false;
    }
  }
  return true;
}

point = (x,y,z) => {
    if (x instanceof Vector) return point(x.x,x.y,x.z);
    let [x1,y1] = toScreen.apply(null,Cfpv(new Vector(x,y,z)));

    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x1,y1);
    ctx.stroke();
    ctx.closePath();  
}
numberPoint = (number,x,y,z) => {
    if (x instanceof Vector) return numberPoint(number,x.x,x.y,x.z);
    let [x1,y1] = toScreen.apply(null,Cfpv(new Vector(x,y,z)));

    var tm = ctx.measureText(number),
      top = tm.actualBoundingBoxAscent,
      bottom = tm.actualBoundingBoxDescent;
    ctx.fillText(number,x1-tm.width/2,y1+(top-bottom)/2);
}

toScreen = (x,y) => {
  let wsize = min(window.innerWidth,window.innerHeight) / 2;
  return vector(
    window.innerWidth/2 + x * wsize,
    window.innerHeight/2 - y * wsize
  );
}

C = (x,y,z) => y > 0 ? new Vector(x/y,z/y) : null;

function Cf(x,y,z) {
  var x0 = x - camera.x,
      y0 = y - camera.y,
      z0 = z - camera.z,
      xy = x0*sin_t - y0*cos_t;
  return [
    x0*cos_t + y0*sin_t,
    z0*sin_p - xy*cos_p,
    z0*cos_p + xy*sin_p
  ];
}

Cfpv = vector => C(...Cf(...vector));

function TAv(v1,v2) {
  var [x1,y1,z1] = v1,
      [x2,y2,z2] = v2,

      ss = sin_t*sin_p,
      sc = sin_t*cos_p,
      cc = cos_t*cos_p,
      cs = cos_t*sin_p,

      x10 = x1-camera.x,
      y10 = y1-camera.y,
      z10 = z1-camera.z,

      x21 = x2-x1,
      y21 = y2-y1,
      z21 = z2-z1,

      f = (a,b,c) => 
        -(x10*a + y10*b + z10*c)/
         (x21*a + y21*b + z21*c);

  return [
    f(cos_t+sc, sin_t-cc, -sin_p),
    f(cos_t-sc, sin_t+cc, +sin_p),
    f(ss+sc, -cs-cc, cos_p-sin_p),
    f(ss-sc, -cs+cc, cos_p+sin_p)]
}




L0to1 = list => list.filter(i => 0 <= i && i <= 1);

VinBounds = vec => vec !== null && max(abs(vec[0]),abs(vec[1])) < 1.00001;

class Edge {
  constructor(vertex1, vertex2) {
    this.v1 = vertex1;
    this.v2 = vertex2;
  }
  draw() {
    let v1 = this.v1,
      v2 = this.v2,
      ta = [0,1,...L0to1(TAv(v1,v2))]
        .filter(t => 
        VinBounds(Cfpv(v1.add(v2.sub(v1).mul(t))))
        );

    let nv1 = v1.add(v2.sub(v1).mul(ta[0]));
    let nv2 = v1.add(v2.sub(v1).mul(ta[1]));

    let [x1,y1] = toScreen.apply(null,Cfpv(nv1));
    let [x2,y2] = toScreen.apply(null,Cfpv(nv2));

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath();  
  }
}

class Face {
  constructor(...vertices) {
    this.vertices = vertices.map(v => v instanceof Vector ? v : new Vector(v));
  }

  draw() {
    ctx.beginPath();
    let [x, y] = this.projected[0];
    ctx.moveTo(x, y);

    for (var i = 1; i < this.projected.length; i++) {
      let [x, y] = this.projected[i];
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    if (hovering[1] === this) {
      ctx.fillStyle = 'cyan';
    } else {
      ctx.fillStyle = `hsl(0 0% ${this.lighting * 100}%)`;
    }
    ctx.fill();
  }

  stroke() {
    ctx.beginPath();
    let [x, y] = this.projected[0];
    ctx.moveTo(x, y);

    for (var i = 1; i < this.projected.length; i++) {
      let [x, y] = this.projected[i];
      ctx.lineTo(x, y);
    }

    ctx.closePath();
    if (hovering[1] === this) {
      ctx.strokeStyle = 'cyan';
    } else {
      ctx.strokeStyle = `hsl(0 0% ${this.lighting * 100}%)`;
    }
    ctx.stroke();
  }
}

class Polyhedra {
  static all = [];
  constructor(vertices,edges,faces) {
    this.vertices = vertices.map(v => v instanceof Vector ? v : new Vector(v));
    this.edges = edges.map(i => new Edge(...i.map(i => this.vertices[i])));
    this.faces = faces.map(i => new Face(...i.map(i => this.vertices[i])));
    Polyhedra.all.push(this);
  }
  drawFaces() {
    this.faces.forEach(face => face.draw());
  }
  drawEdges() {
    this.edges.forEach(edge => face.draw());
  }
  remove() {
    Polyhedra.all.splice(Polyhedra.all.indexOf(this),1);
  }
}

class PolyRect extends Polyhedra {
  constructor(corner1,corner2) {
    var [x1,y1,z1] = corner1,
        [x2,y2,z2] = corner2;
    super(
      [[x1, y1, z1],
       [x1, y1, z2],
       [x1, y2, z1],
       [x1, y2, z2],
       [x2, y1, z1],
       [x2, y1, z2],
       [x2, y2, z1],
       [x2, y2, z2]],
      [[1,3],[3,7],[7,5],[5,1],[4,6],[6,2],[2,0],[0,4],[4,5],[7,6],[1,0],[2,3]],
      [[1,3,7,5],[5,7,6,4],[4,6,2,0],[0,2,3,1],[3,2,6,7],[0,1,5,4]]
    );
  }
}