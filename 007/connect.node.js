
var wsocket = require('nodejs-wbsocket');
var Buffer = require('buffer').Buffer;

var main = {}
(function (_this) {
    process.on('message', function (data) {
        // format ...
        nodeEventHandler(data);
    });
    this.emit = function (title, data) {
        process.send([title, data]);
    }
    this.send = function (data) {
        process.send([data]);
    }
}).bind(main)(main);

function nodeEventHandler (data) {

}

var players = {};
var waitPlayers = {};
    // XXX:
});
var id = null;
var _idCount = 0;
function noticePlayer (id, data) {
    players[id].socket.send(data);
}
function noticePlayers (ids, data) {
    for(let i = 0; i < ids.length; i++) 
        players[ids[i]].socket.send(data);
}
function noticeAllPlayers (data) {
    for(let i in players)
        players[i].socket.send(data);
}
function noticeNode (data) {
    main.send([id, data]);
}

// 刷新在线玩家
setInterval(function () {
    let cnt = 0;
    for(let i in players) {
        if(players[i].active) cnt++;
        else {
            noticeNode(['rmplayer', i]);
            delete players[i];
        }
    }
    noticeNode(['updplayercnt', cnt]);
}, 1500);