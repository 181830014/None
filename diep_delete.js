const CANVAS_LEFT = 50;
const CANVAS_RIGHT = 950;
const CANVAS_BOTTOM = 50;
const CANVAS_TOP = 650;
const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 600;

const MAX_PLAYER_NUMBER = 30;
const MAX_TANK_GRADE = 30;
const SPEED_UP_RATE = 3; 
const SPEED_DOWN_RATE = 2;      // 地图的水平&垂直阻力

const TIME_GAP = 150;
const ANIMATE_TIME_GAP = 70;
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
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.fillStyle = 'grey';
ctx.fillRect(0, 0, 1300, 1000);
ctx.globalAlpha = 0.2;

var tankList = [];
var bulletList = [];
var creepList = [];


function drawBottomBar() {
    // experience Bar
    $('canvas').drawRect({      
        layer: true,
        name: 'expBar',
        fillStyle: '#3e3e3e',
        x: (CANVAS_LEFT + CANVAS_RIGHT) / 2, 
        y: CANVAS_TOP,
        width: 350,
        height: 20,
        cornerRadius: 10,
        opacity: 0.5,
    }).drawText({
        x: (CANVAS_LEFT + CANVAS_RIGHT) / 2, 
        y: CANVAS_TOP,
        layer: true,
        fillStyle: '#ffffff',
        fontSize: 15,
        fontStyle: 'bold',
        fontFamily: 'Ubuntu, sans-serif',
        text: 'level n',
        align: 'center',
        mask: true
    });
    // health Bar
    $('canvas').drawRect({
        layer: true,
        name: 'healthBar',
        fillStyle: '#3e3e3e',
        x: (CANVAS_LEFT + CANVAS_RIGHT) / 2, 
        y: CANVAS_TOP - 25,
        width: 260,
        height: 20,
        cornerRadius: 10,
        opacity: 0.5
    }).drawText({
        x: (CANVAS_LEFT + CANVAS_RIGHT) / 2, 
        y: CANVAS_TOP - 25,
        layer: true,
        fillStyle: '#ffffff',
        fontSize: 12,
        fontStyle: 'bold',
        fontFamily: 'Ubuntu, sans-serif',
        text: 'Score: 0',
        align: 'center',
        mask: true
    });
    // tankName Text
    $('canvas').drawText({
        layer: true,
        name: 'tankNameText',
        fillStyle: '#ffffff',
        strokeStyle: '#000',
        strokeWidth: 1,
        fontSize: 30,
        fontStyle: 'bold',
        fontFamily: 'Ubuntu, sans-serif',
        text: 'hsini',
        x: (CANVAS_LEFT + CANVAS_RIGHT) / 2, 
        y: CANVAS_TOP - 50
    });
}

function drawScoreBoard() {
    $('canvas').drawText({
        layer: true,
        name: 'scoreboardText',
        strokeStyle: '#000',
        strokeWidth: 1,
        fillStyle: '#ffffff',
        fontSize: 25,
        fontStyle: 'bold',
        fontFamily: 'Ubuntu, sans-serif',
        text: 'Scoreboard',
        x: CANVAS_RIGHT,
        y: CANVAS_BOTTOM
    });
}


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
        this.bulletNum = 0;
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
        this.bulletDamage = 30;
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
        if(this.x > CANVAS_RIGHT || this.x < CANVAS_LEFT)
            this.xMoveSpeed = 0;
        if(this.y > CANVAS_TOP || this.y < CANVAS_BOTTOM)
            this.yMoveSpeed = 0;
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
        }, TIME_GAP - 10);
    }

    healthPointDrop(drop) {
        this.healthPoint -= drop;
        if(this.healthPoint <= 0) {
            $('canvas').removeLayer(this.name);
            for(var i = 0; i < tankList.length; i++)
                if(tankList[i] == this) {
                    tankList.splice(i, 1);
                    return;
                }
        }
    }

    fireBullet(x, y) {
        /*
        function: Fire a bullet & draw the bullet on the map
        */
        var bullet = new Bullet();
        this.bulletNum ++;
        bullet.initialize(this, this.bulletNum, x - this.x, y - this.y);
        bulletList.push(bullet);
    }
}

class Creep {
    constructor(name, id, x, y, shape, radius, rotate, damage, healthPoint, experience)
    {
        this.name = name
        this.id = id        // key
        this.x = x
        this.y = y
        this.shape = shape
        this.radius = radius
        this.rotate = rotate
        this.damage = damage
        this.healthPoint = healthPoint
        this.experience = experience    // 经验值
    }

    initialize(id) {
        this.id = id
        this.name = 'creep' + String(this.id)
        this.x = CANVAS_LEFT + Math.ceil(Math.random() * CANVAS_WIDTH);
        this.y = CANVAS_BOTTOM + Math.ceil(Math.random() * CANVAS_HEIGHT);
        this.shape = SQUARE;
        this.radius = 14;
        this.rotate = Math.ceil(360 * Math.random());
        this.xMoveSpeed = 0;
        this.yMoveSpeed = 0;
        this.damage = 10;
        this.healthPoint = 30;
        this.experience = 100;
        this.pointer = document.createElement(this.name)
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
            name: this.name,
            fillStyle: this.getColor(),
            x: this.x, y: this.y,
            radius: this.radius * 2,
            sides: this.shape
        });
    }
    
    healthPointDrop(drop) {
        this.healthPoint -= drop;
        console.log(this.healthPoint);
        if(this.healthPoint <= 0) {
            $('canvas').removeLayer(this.name);
            for(var i = 0; i < creepList.length; i++)
                if(creepList[i] == this) {
                    creepList.splice(i, 1);
                    return;
                }
        }
    }
}

class Bullet {
    constructor(name, id, x, y, shape, radius, xMoveSpeed, yMoveSpeed, damage, tankName)
    {
        this.name = name
        this.id = id
        this.x = x
        this.y = y
        this.shape = shape
        this.radius = radius
        this.xMoveSpeed = xMoveSpeed
        this.yMoveSpeed = yMoveSpeed
        this.damage = damage
        this.tankName = tankName
    }

    initialize(tank, id, dx, dy) {
        this.id = id;
        this.healthPoint = 1;
        this.name = this.tankName + 'bullet' + String(this.id);
        var line = Math.sqrt(dx * dx + dy * dy);
        this.shape = CIRCLE;
        this.radius = 10;
        this.x = tank.x + Math.ceil(tank.radius * dx / line) + this.radius;
        this.y = tank.y + Math.ceil(tank.radius * dy / line) + this.radius;
        this.xMoveSpeed = 6.0 * dx / line;
        this.yMoveSpeed = 6.0 * dy / line;
        this.damage = tank.bulletDamage;
        this.tankName = tank.name;
        this.pointer = document.createElement(this.name)
        this.justifyPosition();
        this.drawOnMap();
        this.moveOnMap();
    }

    drawOnMap() {
        var THIS = this;
        $('canvas').drawArc({
            layer: true,
            name: this.name,
            fillStyle: 'red',
            x: this.x,
            y: this.y,
            radius: this.radius,
            animate: function() {
                for(var i = 0; i < tankList.length; i++)
                    if(tankList[i].name != THIS.tankName)
                        checkCollision(tankList[i], THIS);
                for(var i = 0; i < creepList.length; i++)
                    checkCollision(creepList[i], THIS);
            },
            animateend: function() {
                $('canvas').removeLayer(THIS.name);
            }
        });
    }

    justifyPosition() {
        if(this.x > CANVAS_RIGHT || this.x < CANVAS_LEFT)
            this.xMoveSpeed = 0;
        if(this.y > CANVAS_TOP || this.y < CANVAS_BOTTOM)
            this.yMoveSpeed = 0;
        this.x = Math.max(this.x, CANVAS_LEFT);
        this.x = Math.min(this.x, CANVAS_RIGHT);
        this.y = Math.max(this.y, CANVAS_BOTTOM);
        this.y = Math.min(this.y, CANVAS_TOP);
    }

    moveOnMap() {
        var xTime, yTime, time;
        if(this.xMoveSpeed > 0) xTime = (CANVAS_RIGHT - this.x) / this.xMoveSpeed;
        else if(this.xMoveSpeed < 0) xTime = (CANVAS_LEFT - this.x) / this.xMoveSpeed;
        if(this.yMoveSpeed > 0) yTime = (CANVAS_TOP - this.y) / this.yMoveSpeed;
        else if(this.yMoveSpeed < 0) yTime = (CANVAS_BOTTOM - this.y) / this.yMoveSpeed;
        time = Math.min(xTime, yTime);       

        $('canvas').animateLayer(this.name, {
            x: this.x + this.xMoveSpeed * time, 
            y: this.y + this.yMoveSpeed * time
        }, time * 30);
    }    

    healthPointDrop(drop) {
        this.healthPoint -= drop;
        if(this.healthPoint <= 0) {
            $('canvas').removeLayer(this.name);
            for(var i = 0; i < bulletList.length; i++)
                if(bulletList[i] == this) {
                    bulletList.splice(i, 1);
                    return;
                }
        }
    }
}

function isCollided(object1, object2) {  // 判断两物块是否碰撞
    var x1 = $('canvas').getLayer(object1.name).x
    var x2 = $('canvas').getLayer(object2.name).x
    var y1 = $('canvas').getLayer(object1.name).y
    var y2 = $('canvas').getLayer(object2.name).y
    // console.log(object1);
    // console.log(object2);
    var dx = (x2 - x1), dy = (y2 - y1);
    // var dx = (object1.x - object2.x);
    // var dy = (object1.y - object2.y);
    var dis = dx * dx + dy * dy;
    return dis <= (object1.radius + object2.radius) * (object1.radius + object2.radius);
}

function checkCollision(object1, object2) { // 碰撞后修改参数
    if(isCollided(object1, object2) == false)
        return;
    object1.healthPointDrop(object2.damage);
    object2.healthPointDrop(object1.damage);
    // object1.experienceUp(object2.experience);
    // object2.experienceUp(object1.experience);
    // TODO: 碰撞动画 & 其他参数修改
    // object1.xMoveSpeed = -object1.xMoveSpeed * 2;
    // object1.yMoveSpeed = -object1.yMoveSpeed * 2;
    // object2.xMoveSpeed = -object2.xMoveSpeed * 2;
    // object2.yMoveSpeed = -object2.yMoveSpeed * 2;
}

function globalCollision() {    // 枚举所有pair, 检测碰撞
    // Tank - Tank
    for(var i = 0; i < tankList.length; i++)
        for(var j = i + 1; j < tankList.length; j++)
            checkCollision(tankList[i], tankList[j]);
    /*
    // Tank - Bullet
    for(var i = 0; i < tankList.length; i++)
        for(var j = 0; j < bulletList.length; j++)
            if(tankList[i].name != bulletList[j].tankName)   // 自己的子弹不能打自己
                checkCollision(tankList[i], bulletList[j]);
    */
    // Tank - Creep
    for(var i = 0; i < tankList.length; i++)
        for(var j = 0; j < creepList.length; j++)
            checkCollision(tankList[i], creepList[j]);
    /*
    // Bullet - Creep
    for(var i = 0; i < bulletList.length; i++)
        for(var j = 0; j < creepList.length; j++)
            checkCollision(bulletList[i], creepList[j]);
    */
}

function globalMove() {
    tank.modifySpeed();
    tank.moveOnMap();
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

document.onmousedown = function(ev) {
    var mEvent = ev || window.event;
    var cvsBox = canvas.getBoundingClientRect();
    var x = Math.round(mEvent.clientX - cvsBox.left);
    var y = Math.round(mEvent.clientY - cvsBox.top);
    tank.fireBullet(x, y);
}


// test part start.
var tank = new Tank();
tank.initialize('tank');
tankList.push(tank);

for(var i = 0 ; i < 10 ; i++) {
    var creep = new Creep();
    creep.initialize(id=i);
    creepList.push(creep);
}
// test part end.

function main() {
    drawBottomBar();
    drawScoreBoard();
    var timer = setInterval(function() {
        globalMove();
    }, TIME_GAP);
    
}

main();