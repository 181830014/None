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

    beDamaged() {
        
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