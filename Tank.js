const MAX_PLAYER_NUMBER = 30;
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
    constructor(id, name, radius, x, y, type, grade, healthPoint, regenerationRate,
        moveSpeed, bodyDamage, reloadRate, maxBulletDistance, bullet) {
        this.id = id            // key
        this.name = name
        this.x = x
        this.y = y
        this.radius = radius
        this.type = type
    
        // 可升级属性
        this.grade = grade
        this.healthPoint = healthPoint
        this.regenerationRate = regenerationRate
        this.moveSpeed = moveSpeed
        this.bodyDamage = bodyDamage
        this.reloadRate = reloadRate
        this.maxBulletDistance = maxBulletDistance
        this.bullet = bullet
    }

    drawOnMap() {
        $(document).ready(function(){
            $('canvas').drawArc({
                fillStyle: 'black',
                x: 100, y: 100,
                radius: 50
            })
        })
    }

    upgrade(attribute) {
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

var tank = new Tank(generate_id(), name='TODO', raidus=30, x=Math.random(), y=Math.random(),
    type=1, grade=1, healthPoint=100, regenerationRate=1, moveSpeed=1, bodyDamage=1, 
    reloadRate=1, maxBulletDistance=1, bullet=new Bullet());