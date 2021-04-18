// importScripts("Tank.js");
// importScripts("Creep.js");
// importScripts("Bullet.js");

const SQUARE = 1;
const TRIANGLE = 2;
const PENTAGON = 3;
const CANVAS_WIDTH = 200;   // TODO
const CANVAS_HEIGHT = 200;  // TODO
// const UPGRADE_THRESHOLD_ARRAY = []

/* tmp start*/
class Creep {
    constructor(x, y, shape, radius, damage, healthPoint, experience)
    {
        this.x = x
        this.y = y
        this.shape = shape
        this.radius = radius
        this.damage = damage
        this.healthPoint = healthPoint
        this.experience = experience    // 经验值
    }

    drawOnMap() {
        switch(this.shape) {
            case TRIANGLE: 
                $('canvas').drawPolygon({
                    strokeStyle: 'red',
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                    sides: 3
                }); break;
            case SQUARE:
                $('canvas').drawPolygon({
                    strokeStyle: 'yellow',
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                    sides: 4
                }); break;
            case PENTAGON:
                $('canvas').drawPolygon({
                    strokeStyle: 'purple',
                    x: this.x,
                    y: this.y,
                    radius: this.radius,
                    sides: 4
                }); break; 
            default: return -1;
        }
        return 0;
    }
}
/* tmp end*/

var tankList = [];
var bulletList = [];
var creepList = [];

function isCollide(object1, object2) {  // 判断两物块是否碰撞
    // TODO
}

var testCreep = new Creep (x=CANVAS_WIDTH * Math.ceil(Math.random()),
    y=CANVAS_HEIGHT * Math.ceil(Math.random()), shape=TRIANGLE, radius=30,
    damage=1, healthPoint=1, experience=10);
creepList.push(testCreep);
testCreep.drawOnMap();