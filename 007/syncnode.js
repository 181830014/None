
var fs = require('fs');

// ==================
// var publicfile = fs.readFileSync('ws/public.js').toString();
// eval(publicfile.toString());
// ==================

diepEnv = 'syncnode';

var main = {};
(function (_this) {
    process.on('message', function (data) {
        // format ...
        wsEventHandler(data);
    });
    this.emit = function (title, data) {
        process.send([title, data]);
    }
    this.send = function (data) {
        process.send([data]);
    }
}).bind(main)(main);

setInterval(function () {
    setSyncTick(new Date().getTime());
}, 16);

// 刷新野怪
var creepMaxCount = 256;
setInterval(function () {

}, 500);

// 刷新视野
setInterval(function () {

}, 1000);

// 刷新ranklist
setInterval(function () {

}, 3000);

main.send(['init']);


