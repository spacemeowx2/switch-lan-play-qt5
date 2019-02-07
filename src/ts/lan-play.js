"use strict";
function _parseNetIf(content) {
    var out = [];
    var re = /(\d+)\.\s*([0-9a-zA-Z\-_{}]+)\s*\((.*)\)(\r?\n\s*IP:\s*\[(.*)\])?/g;
    while (1) {
        var r = re.exec(content);
        if (r === null) {
            break;
        }
        out.push({
            no: r[1],
            name: r[2],
            description: r[3],
            ip: r[5].split(',').filter(function (s) {
                return s.length > 0;
            }).map(function (s) {
                return s.trim();
            })
        });
    }
    return out;
}
function _interfaceIpScore(ip) {
    var IP_PREFIX_SCORE = {
        '192.168.56.': 1,
        '192.168.': 3,
        '169.254.': 1,
        '127.0.0.1': 1
    };
    var keys = Object.keys(IP_PREFIX_SCORE);
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (key === ip.substr(0, key.length)) {
            return IP_PREFIX_SCORE[key];
        }
    }
    return 2;
}
function _reduceMax(a, b) {
    return a > b ? a : b;
}
function _interfaceSort(a, b) {
    var DESC_BLACK_RANK = 1000;
    var IP_RANK = 100;
    var DESC_BLACK_LIST = ['Oracle', 'Microsoft Corporation'];
    var ascore = 0;
    var bscore = 0;
    ascore += (DESC_BLACK_LIST.indexOf(a.description) === -1 ? 1 : 0) * DESC_BLACK_RANK;
    bscore += (DESC_BLACK_LIST.indexOf(b.description) === -1 ? 1 : 0) * DESC_BLACK_RANK;
    ascore += (a.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK;
    bscore += (b.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK;
    if (ascore - bscore === 0) {
        return a.no - b.no;
    }
    else {
        return bscore - ascore;
    }
}
function _paramToArray(param, preventSetBuf) {
    var keys = Object.keys(param);
    var out = [];
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var value = param[key];
        if (value === true) {
            out.push(key);
        }
        else {
            out.push(key, value);
        }
    }
    if (!preventSetBuf) {
        out.push('--set-ionbf');
    }
    return out;
}
function listInterface(callback) {
    var bin = _LanPlay.getLanPlay();
    var process = _LanPlay.createProcess();
    if (bin === '') {
        callback(new Error('lan-play executable not found'));
    }
    console.log('lan-play path: ', bin);
    process.finished.connect(function () {
        console.log('finished');
        var content = process.readAll();
        callback(null, _parseNetIf(content).sort(_interfaceSort));
    });
    process.errorOccurred.connect(function (err) {
        callback(err);
    });
    process.start(bin, ['--list-if']);
}
var _currentLanPlay = null;
function runLanPlay(param, onData, callback) {
    if (_currentLanPlay) {
        _currentLanPlay.kill();
        _currentLanPlay = null;
    }
    var bin = _LanPlay.getLanPlay();
    var process = _LanPlay.createProcess();
    _currentLanPlay = process;
    process.setProcessChannelModeMerged();
    process.finished.connect(function () {
        callback(null);
    });
    process.errorOccurred.connect(function (err) {
        callback(err);
    });
    process.readyRead.connect(function () {
        onData(process.readAll());
    });
    process.start(bin, _paramToArray(param));
    return function (text) {
        process.write(text);
    };
}
function emptyFunction() {
    // do nothing
}
function LanPlay() {
    this.args = {
        netif: '',
        relayServerAddr: '',
        socks5ServerAddr: '',
        broadcast: false,
        fakeInternet: false
    };
    this.process = null;
}
LanPlay.prototype.onData = emptyFunction;
LanPlay.prototype.onFinished = emptyFunction;
LanPlay.prototype.onError = emptyFunction;
LanPlay.prototype._start = function _start() {
    var self = this;
    if (this.process) {
        this.process.kill();
        this.process = null;
    }
    var process = _LanPlay.createProcess();
    this.process = process;
    process.setProcessChannelModeMerged();
    process.finished.connect(function () {
        self.onFinished();
    });
    process.errorOccurred.connect(function (err) {
        self.onError(err);
    });
    process.readyRead.connect(function () {
        self.onData(process.readAll());
    });
    process.start(_LanPlay.getLanPlay(), _paramToArray(param));
};
LanPlay.prototype.setNetif = function setNetif(netif) {
    if (this.args.netif === netif)
        return;
    this.args.netif = netif;
    this._start();
};
LanPlay.prototype.setRelayServerAddr = function setRelayServerAddr(addr) {
    if (this.args.relayServerAddr === addr)
        return;
    this.args.relayServerAddr = addr;
    this._start();
};
LanPlay.prototype.setSocks5ServerAddr = function setSocks5ServerAddr(addr) {
    if (this.args.socks5ServerAddr === addr)
        return;
    this.args.socks5ServerAddr = addr;
    this._start();
};
LanPlay.prototype.setBroadcast = function setSocks5ServerAddr(addr) {
    if (this.args.socks5ServerAddr === addr)
        return;
    this.args.socks5ServerAddr = addr;
    this._start();
};
