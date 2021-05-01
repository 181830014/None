
var idCount = 0;
function IDPool(name, maxCount) {

    ++idCount;
    this.freeIds = Array(maxCount).fill().map((_,i)=>i);
    this.allocatedIds = [];
    this.name = name;
    this.maxCount = maxCount;
    this.used = 0;
}
IDPool.prototype.register = function () {
    this.used++;
    let id = this.freeIds.shift();
    this.allocatedIds.push(id);
    return id;
}
IDPool.prototype.remove = function (id) {
    if(this.allocatedIds.indexOf(id) < 0) return;
    this.used--;
    this.freeIds.push(id);
    this.allocatedIds.splice(this.allocatedIds.indexOf(id), 1);
}

module.exports = IDPool;