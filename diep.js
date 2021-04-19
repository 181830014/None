const CANVAS_LEFT = 30;
const CANVAS_RIGHT = 270;
const CANVAS_BOTTOM = 30;
const CANVAS_TOP = 270;
const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 240;

const MAX_PLAYER_NUMBER = 30;
const MAX_TANK_GRADE = 30;
const SPEED_UP_RATE = 10; 
const SPEED_DOWN_RATE = 2;      // 地图的水平&垂直阻力

const TIME_GAP = 50;
const KEYBOARD_UP = 87;
const KEYBOARD_DOWN = 83;
const KEYBOARD_LEFT = 65;
const KEYBOARD_RIGHT = 68;

const HEALTH_POINT = 1;
const REGENERATION_RATE = 2;
const MOVE_SPEED = 3;
const BODY_DAMAGE = 4;
const RELOAD_RATE = 5;
const MAX_BULLET_DISTANCE = 6;

const TRIANGLE = 3;
const SQUARE = 4;
const PENTAGON = 5;
const CIRCLE = 0;

var KEYBOARD_CONDITION = 0;   // 0000 UP DOWN LEFT RIGHT

class Tank {
    constructor(name, x, y, radius, rotate, xMoveSpeed, yMoveSpeed, type, grade, 
        healthPoint, regenerationRate, damage, reloadRate, maxBulletDistance, bullet) {
        this.name = name        // key
        this.x = x
        this.y = y
        this.radius = radius
        this.rotate = rotate
        this.type = type
    
        // 可升级属性
        this.grade = grade
        this.healthPoint = healthPoint
        this.regenerationRate = regenerationRate
        this.xMoveSpeed = xMoveSpeed
        this.yMoveSpeed = yMoveSpeed
        this.damage = damage
        this.reloadRate = reloadRate
        this.maxBulletDistance = maxBulletDistance
        this.bullet = bullet
    }

    initialize(name) {
        /*
        input: Tank Name
        function: Initialize attributes of tank & Draw it on map.
        */
        this.name = name;
        this.x = CANVAS_LEFT + Math.ceil(Math.random() * CANVAS_WIDTH);
        this.y = CANVAS_BOTTOM + Math.ceil(Math.random() * CANVAS_HEIGHT);
        this.radius = 25;
        this.rotate = Math.ceil(360 * Math.random());
        this.xMoveSpeed = 0;
        this.yMoveSpeed = 0;
        this.type = 1;
        this.grade = 1;
        this.healthPoint = 100;
        this.regenerationRate = 1;
        this.damage = 10;
        this.reloadRate = 1;
        this.maxBulletDistance = 100;
        this.pointer = document.createElement(this.name)
        this.drawOnMap();
    }

    drawOnMap() {
        $('canvas').drawArc({
            layer: true,
            name: this.name,
            fillStyle: '#589',
            x: this.x, y: this.y,
            radius: this.radius,
            rotate: this.rotate
        })
    }

    upgrade(attribute) {
        /*
        input: 要加点的属性
        function: 加点
        */
        if(this.grade == MAX_TANK_GRADE)
            return 0;
        this.grade = this.grade + 1;
        switch(attribute) {
            case HEALTH_POINT: this.healthPoint += 1; break;
            case REGENERATION_RATE: this.regenerationRate += 1; break;
            case MOVE_SPEED: this.moveSpeed += 1; break;
            case BODY_DAMAGE: this.bodyDamage += 1; break;
            case RELOAD_RATE: this.reloadRate += 1; break;
            case MAX_BULLET_DISTANCE: this.maxBulletDistance += 1; break;
            // case BULLET: break;
            default: return -1;
        }
        return 0;
    }

    modifySpeed() {
        /*
        function: modify xMoveSpeed and yMoveSpeed
        */
        var xDirection = 0, yDirection = 0;
        if(KEYBOARD_CONDITION & 8) yDirection -= 1;
        if(KEYBOARD_CONDITION & 4) yDirection += 1;
        if(KEYBOARD_CONDITION & 2) xDirection -= 1;
        if(KEYBOARD_CONDITION & 1) xDirection += 1;

        this.xMoveSpeed += xDirection * SPEED_UP_RATE;
        this.yMoveSpeed += yDirection * SPEED_UP_RATE;
        if(this.xMoveSpeed > SPEED_DOWN_RATE)
            this.xMoveSpeed -= SPEED_DOWN_RATE;
        if(this.xMoveSpeed < -SPEED_DOWN_RATE)
            this.xMoveSpeed += SPEED_DOWN_RATE;  
        if(this.yMoveSpeed > SPEED_DOWN_RATE)
            this.yMoveSpeed -= SPEED_DOWN_RATE;
        if(this.yMoveSpeed < -SPEED_DOWN_RATE)
            this.yMoveSpeed += SPEED_DOWN_RATE;  
    }

    justifyPosition() {
        /*
        function: 使图像不超出画布
        */
        this.x = Math.max(this.x, CANVAS_LEFT);
        this.x = Math.min(this.x, CANVAS_RIGHT);
        this.y = Math.max(this.y, CANVAS_BOTTOM);
        this.y = Math.min(this.y, CANVAS_TOP);
    }

    moveOnMap() {
        /*
        function: 每个时间片坦克进行一次移动, x+=delta(x), y+=delta(y)
        */
        // var curx = this.x;
        // var cury = this.y;
        this.x += this.xMoveSpeed;
        this.y += this.yMoveSpeed;
        this.justifyPosition()
        $('canvas').animateLayer(this.name, {
            x: this.x, y: this.y
        }, TIME_GAP);
    }

    beDamaged() {
        
    }

    fireBullet() {
        /*
        function: Fire a bullet & draw the bullet on the map
        */
    }
}

class Creep {
    constructor(id, x, y, shape, radius, damage, healthPoint, experience)
    {
        this.id = id        // key
        this.x = x
        this.y = y
        this.shape = shape
        this.radius = radius
        this.damage = damage
        this.healthPoint = healthPoint
        this.experience = experience    // 经验值
    }

    initialize(id) {
        this.id = id
        this.x = CANVAS_LEFT + Math.ceil(Math.random() * CANVAS_WIDTH);
        this.y = CANVAS_BOTTOM + Math.ceil(Math.random() * CANVAS_HEIGHT);
        this.shape = SQUARE;
        this.radius = 20;
        this.damage = 10;
        this.healthPoint = 30;
        this.experience = 100;
        this.pointer = document.createElement('creep' + String(this.id))
        this.drawOnMap();
    }

    getColor() {
        switch(this.shape) {
            case TRIANGLE: return 'red'
            case SQUARE: return 'yellow';
            case PENTAGON: return 'purple';
        }
    }

    drawOnMap() {
        $('canvas').drawPolygon({
            layer: true,
            name: 'creep' + String(this.id),
            fillStyle: this.getColor(),
            strokeStyle: this.getColor(),
            strokeWidth: 4,
            x: this.x, y: this.y,
            radius: this.radius,
            sides: this.shape
        });
    }
    
    beDamaged() {

    }
}

class Bullet {
    constructor(x, y, shape, radius, speed, damage, tankName)
    {
        this.x = x
        this.y = y
        this.shape = shape
        this.radius = radius
        this.speed = speed
        this.damage = damage
        this.tankName = tankName
    }

    drawOnMap() {
        $('canvas').drawArc({
            fillStyle: 'red',
            x: this.x,
            y: this.y,
            radius: this.radius
        });
    }
}

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

document.onkeydown = function(ev) {
    var kEvent = ev || window.event;
    if(kEvent.keyCode == KEYBOARD_UP)
        KEYBOARD_CONDITION |= 8;
    else if(kEvent.keyCode == KEYBOARD_DOWN)
        KEYBOARD_CONDITION |= 4;
    else if(kEvent.keyCode == KEYBOARD_LEFT)
        KEYBOARD_CONDITION |= 2;
    else if(kEvent.keyCode == KEYBOARD_RIGHT)
        KEYBOARD_CONDITION |= 1;
}

document.onkeyup = function(ev) {
    var kEvent = ev || window.event;
    if(kEvent.keyCode == KEYBOARD_UP)
        KEYBOARD_CONDITION &= 7;
    else if(kEvent.keyCode == KEYBOARD_DOWN)
        KEYBOARD_CONDITION &= 11;
    else if(kEvent.keyCode == KEYBOARD_LEFT)
        KEYBOARD_CONDITION &= 13;
    else if(kEvent.keyCode == KEYBOARD_RIGHT)
        KEYBOARD_CONDITION &= 14;
}

function main() {
    
    var tank1 = new Tank();
    tank1.initialize('tank1');
    tankList.push(tank1);

    var creep1 = new Creep();
    creep1.initialize(id=1);
    creepList.push(creep1);

    var timer = setInterval(function() {
        tank1.modifySpeed();
        tank1.moveOnMap();
    }, TIME_GAP);
}

main();