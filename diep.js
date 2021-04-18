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

function isCollided(object1, object2) {  // 判断两物块是否碰撞
    var dx = (object1.x - object2.x);
    var dx = (object1.y - object2.y);
    var dis = dx * dx + dy * dy;
    return dis <= (object1.raidus + object2.raidus) * (object1.raidus + object2.raidus);
}

function checkCollision(object1, object2) { // 碰撞后修改参数
    if(isCollided(object1, object2) == false)
        return;
    if(typeof(object1) == Tank || typeof(object1) == Creep)
        object1.healthPoint -= object2.damage;
    if(typeof(object2) == Tank || typeof(object2) == Creep)
        object2.healthPoint -= object1.damage;
    
    // TODO: 碰撞动画 & 其他参数修改
}

function globalCollision() {    // 枚举所有pair, 检测碰撞
    // Tank - Tank
    for(var i = 0; i < tankList.size(); i++)
        for(var j = i + 1; j < tankList.size(); j++)
            checkCollision(tankList[i], tankList[j]);
    // Tank - Bullet
    for(var i = 0; i < tankList.size(); i++)
        for(var j = 0; j < bulletList.size(); j++)
            if(tankList[i].name != bulletList[j].tankName)   // 自己的子弹不能打自己
                checkCollision(tankList[i], bulletList[j]);
    // Tank - Creep
    for(var i = 0; i < tankList.size(); i++)
        for(var j = 0; j < creepList.size(); j++)
            checkCollision(tankList[i], creepList[j]);
    // Bullet - Creep
    for(var i = 0; i < bulletList.size(); i++)
        for(var j = 0; j < creepList.size(); j++)
            checkCollision(bulletList[i], creepList[j]);
}

var testCreep = new Creep (x=CANVAS_WIDTH * Math.ceil(Math.random()),
    y=CANVAS_HEIGHT * Math.ceil(Math.random()), shape=TRIANGLE, radius=20,
    damage=1, healthPoint=1, experience=10);
creepList.push(testCreep);
testCreep.drawOnMap();