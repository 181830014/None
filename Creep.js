const SQUARE = 1;
const TRIANGLE = 2;
const PENTAGON = 3;

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
            strokeStyle: this.getColor(),
            x: this.x,
            y: this.y,
            radius: this.radius,
            sides: this.shape
        });
    }
    
}