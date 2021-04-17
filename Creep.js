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