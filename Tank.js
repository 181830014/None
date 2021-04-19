const CANVAS_LEFT = 30;
const CANVAS_RIGHT = 270;
const CANVAS_BOTTOM = 30;
const CANVAS_TOP = 270;
const CANVAS_WIDTH = 300;
const CANVAS_HEIGHT = 300;

const MAX_PLAYER_NUMBER = 30;
const MAX_TANK_GRADE = 30;
const SPEED_UP_RATE = 10; 
const SPEED_DOWN_RATE = 2;      // 地图的水平&垂直阻力

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
        this.pointer
    }

    initialize(name) {
        /*
        input: Tank Name
        function: Initialize attributes of tank & Draw it on map.
        */
        this.name = name;
        this.x = CANVAS_LEFT + Math.ceil(Math.random() * CANVAS_WIDTH);
        this.y = CANVAS_BOTTOM + Math.ceil(Math.random() * CANVAS_HEIGHT);
        this.radius = 30;
        this.rotate = Math.ceil(360 * Math.random());
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
        var curx = this.x;
        var cury = this.y;
        this.x += this.xMoveSpeed;
        this.y += this.yMoveSpeed;
        this.justifyPosition()
        // TODO: jCanvas [Maybe $().Animate?]
    }

    fireBullet() {
        /*
        function: Fire a bullet & draw the bullet on the map
        */
    }
}

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

    getColor() {
        switch(this.shape) {
            case TRIANGLE: return 'red'
            case SQUARE: return 'yellow';
            case PENTAGON: return 'purple';
        }
    }

    drawOnMap() {
        $('canvas').drawPolygon({
            strokeStyle: 'yellow',
            x: this.x,
            y: this.y,
            radius: this.radius,
            sides: this.shape
        });
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

var name_pool = [];   // name

var tank = new Tank();
tank.initialize('panda');