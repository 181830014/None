class Bullet {
    constructor(x, y, shape, radius, speed, damage, tankId)
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