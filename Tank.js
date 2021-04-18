const CANVAS_LEFT = 0;   // TODO
const CANVAS_RIGHT = 300;
const CANVAS_BOTTOM = 0;
const CANVAS_TOP = 300;  // TODO
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const MAX_PLAYER_NUMBER = 30;
const MAX_TANK_GRADE = 30;
const SPEED_UP_RATE = 10;
const SPEED_DOWN_RATE = 2;
const TANK_RADIUS = 30;

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

class Tank {
    constructor(id, name, radius, rotate, xMoveSpeed, yMoveSpeed, type, grade, healthPoint, 
        regenerationRate, bodyDamage, reloadRate, maxBulletDistance, bullet) {
        this.id = id            // key
        this.name = name
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
        this.bodyDamage = bodyDamage
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
        this.radius = TANK_RADIUS;
        this.x = CANVAS_LEFT + Math.ceil(Math.random() * CANVAS_WIDTH);
        this.y = CANVAS_BOTTOM + Math.ceil(Math.random() * CANVAS_HEIGHT);
        this.radius = 30;
        this.rotate = Math.ceil(360 * Math.random());
        this.type = 1;
        this.grade = 1;
        this.healthPoint = 100;
        this.regenerationRate = 1;
        this.bodyDamage = 10;
        this.reloadRate = 1;
        this.maxBulletDistance = 100;
        this.drawOnMap();
    }

    drawOnMap() {
        $(document).ready(function(){
            $('canvas').drawArc({
                fillStyle: 'black',
                x: this.x, y: this.y,
                radius: this.radius,
                rotate: this.rotate
            })
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

    modifySpeed(xDirection, yDirection) {
        /*
        input: xDirection(1/-1/0), yDirection(1/-1/0), 1/-1/0 分别表示正/反/无
        function: modify xMoveSpeed and yMoveSpeed
        */
        this.xMoveSpeed += xDirection * SPEED_UP_RATE - SPEED_DOWN_RATE;
        this.yMoveSpeed += yDirection * SPEED_UP_RATE - SPEED_DOWN_RATE;       
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
        var curx = this.x;
        var cury = this.y;
        this.x += this.xMoveSpeed;
        this.y += this.yMoveSpeed;
        this.justifyPosition()
        // TODO: jCanvas [Maybe $().Animate?]
    }
}


var id_pool = [];   // id
function generateId() {
    id_pool.sort();
    var len = id_pool.length();
    if(len == MAX_PLAYER_NUMBER)
        return -1;
    for(var i=1; i<=len; i++)
        if(id_pool[i-1] != i)
        {
            id_pool.push(i);
            return i;
        }
    id_pool.push(len+1);
    return len+1;
}

var tank = new Tank();
tank.initialize('panda');