var canvas, ctx, pen, mouse, keys;

function loop() {
    requestAnimationFrame(loop);
    mouse.update();
    keys.update();
    update();
    draw();
}

function init0() {
    keys.onUpdate = function(wasd,arrows,space) {
        if (wasd) {
            player.x += player.speed * (
              wasd.x * cos(player.theta)
            - wasd.y * sin(player.theta)
            );
            player.y += player.speed * (
              wasd.x * sin(player.theta)
            + wasd.y * cos(player.theta)
            );
        }
        if (space) player.z += player.speed * space;
        if (arrows) {
            player.theta -= player.sensitivity * arrows.x;
            player.phi += player.sensitivity * arrows.y;
        };
    };
    mouse.onUpdate = function(down,delta) {
        if (down && delta.abs() > 0) {
            player.theta += 5 * delta.x/canvas.width;
            player.phi +=  5 * delta.y/canvas.width;
        }
    };
}

class Mouse extends Vector {
    constructor() {
        super();
    }
    onUpdate(){}
    update() {
        (md => {
            if (mouse.md == '00') mouse.state = 'up';
            if (mouse.md == '01') mouse.state = 'pressed';
            if (mouse.md == '11') mouse.state = 'down';
            if (mouse.md == '10') mouse.state = 'released';
        })(mouse.md = mouse.md[1] + +mouse.down);

        mouse.d = mouse.l.sub(mouse);
        mouse.l = mouse.copy();

        this.onUpdate(this.down,this.d);
    }
    state = 'up';
    down = false;
    md = '00';
    d = new Vector;
    l = new Vector;
}

window.onload = () => {
    canvas = document.querySelector('canvas');
    ctx = canvas.getContext('2d');
    mouse = new Mouse;
    pen = new Pen(ctx);
    (window.onresize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    })();
    keys = {
        w: false,
        a: false,
        s: false,
        d: false,
        up: false,
        down: false,
        left: false,
        right: false,
        space: false,
        shift: false,
        wasd() {
            return (this.w || this.s || this.a || this.d)
            && Vector.unit0([this.d - this.a, this.w - this.s]);
        },
        arrows() {
            return (this.up || this.down || this.left || this.right)
            && Vector.unit0([this.right - this.left, this.up - this.down]);
        },
        onUpdate() {},
        update() {
            this.onUpdate(
                this.wasd(),
                this.arrows(),
                this.space- 2 * this.shift
            );
        }
    };
    (update => {
        window.onkeydown = update(true);
        window.onkeyup = update(false);
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
    window.onpointermove = function(event) {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    }
    window.onpointerdown = function(event) {
        if (event.button == 0) mouse.down = true;
    }
    window.onpointerup = function(event) {
        if (event.button == 0) mouse.down = false;
    }
    init0();
    init();
    loop();
}