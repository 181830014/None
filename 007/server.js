
var ws = require('ws').Server;
var Buffer = require('buffer').Buffer;
var childProc = require('child_process');
var IDPool = require('./idpool.js');
var fs = require('fs');

// ==================
// var publicfile = fs.readFileSync('ws/public.js').toString();
// eval(publicfile.toString());
// ==================

diepEnv = 'server';

// ======== syncNode =============
var syncNode = childProc.fork('./ws/syncnode.js');
syncNode.on('message', function (data) {
    // TODO: format ...
    syncNodeEventHandler(data);
});
function syncNodeEventHandler (data) {
    // TODO: add event handler
}

// ======== connections =============
var connects = [
    {},
    {}
];
for (let i = 0 ; i < connects.length; i++) {
    let user = childProc.fork('./ws/client.js');
    user.on('message', function (data) {
        // TODO: format ...
        userEventHandler(data);
    });
    user.send(['setID', i]);
    user.send(['createServer', connects[i].port]);
    connects[i].user = user; 
}

function userEventHandler (data) {
    // TODO: add event handler
}

function addUser(cid, data) {
    let nid = tankIdPool.register();
    noticeConn(cid, 5, [data[0], nid]);
    let tk = Tank.add({
        id: nid,
        x: 100,
        y: 100,
        name: data[1].substr(1) || ''
    });
    tk.updTankNearby();
    multicast([tk.id] + tk.tanksNearby, ['c', tk.serialization()]);
}

// ======== webserver && network =============
var wserver = require('http').createServer(function (req, rsp) {
    rsp.writeHead(200, {'Content-Type': 'text/plain'});
    rsp.end('Hello!\n');
});
var server = new ws({server: wserver});
server.on("connection", function(socket) {
    socket.on('message', function (data) {
        // TODO:
    });
    let port = 0, minn = Math.pow(2,53);
    for (let i = 0 ; i < connects.length; i++) {
        if(connects[i].usernum < minn) 
            port = connects[i].port, minn = connects[i].usernum;
    }
    socket.send(Buffer.from('z' + port)); // redirect
});
wserver.listen(8008);

var tankIdPool = new IDPool('tank', 64);
var creepIdPool = new IDPool('creep', 256);

function unicast (id, data) {
    for(let i = 0; i < connects.length; i++)
        connects[i].node.send([0, id, data]);
}
function multicast (ids, data) {
    for(let i = 0; i < connects.length; i++)
        connects[i].node.send([1, ids, data]);
    syncNode.send([data]);
}
function broadcast (data) {
    for(let i = 0; i < connects.length; i++)
        connects[i].node.send([2, undefined, data]);
    syncNode.send([data]);
}
function noticeNode (cid, title, data) {
    connects[cid].node.send([3, title, data]);
}
function noticeAllnode (title, data) {
    for(let i = 0; i < connects.length; i++)
        connects[i].node.send([4, title, data]);
}