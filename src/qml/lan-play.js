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
            ip: r[5].split(',')
                .map(function (s) { return s.trim(); })
                .filter(function (s) { return s.length > 0; })
        });
    }
    return out;
}
function _interfaceSort(a, b) {
    var DESC_BLACK_RANK = 1000;
    var IP_RANK = 100;
    var DESC_BLACK_LIST = ['Oracle', 'Microsoft Corporation'];
    var ascore = 0;
    var bscore = 0;
    ascore += (DESC_BLACK_LIST.indexOf(a.description) === -1 ? 1 : 0) * DESC_BLACK_RANK;
    bscore += (DESC_BLACK_LIST.indexOf(b.description) === -1 ? 1 : 0) * DESC_BLACK_RANK;
    var interfaceIpScore = function (ip) {
        var IP_PREFIX_SCORE = {
            '192.168.56.': 1,
            '192.168.': 3,
            '169.254.': 1,
            '127.0.0.1': 1
        };
        for (var _i = 0, _a = Object.keys(IP_PREFIX_SCORE); _i < _a.length; _i++) {
            var key = _a[_i];
            if (key === ip.substr(0, key.length)) {
                return IP_PREFIX_SCORE[key];
            }
        }
        return 2;
    };
    var reduceMax = function (a, b) { return a > b ? a : b; };
    ascore += (a.ip.map(interfaceIpScore).reduce(reduceMax, 0)) * IP_RANK;
    bscore += (b.ip.map(interfaceIpScore).reduce(reduceMax, 0)) * IP_RANK;
    if (ascore - bscore === 0) {
        return parseInt(a.no) - parseInt(b.no);
    }
    else {
        return bscore - ascore;
    }
}
function _paramToArray(param, preventSetBuf) {
    var keys = Object.keys(param);
    var out = [];
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
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
var ProcessWrap = /** @class */ (function () {
    function ProcessWrap(bin, args) {
        this.process = null;
        this._args = [];
        this._bin = '';
        if (bin) {
            this._bin = bin;
        }
        if (args) {
            this._args = args;
        }
        this._start();
    }
    ProcessWrap.prototype.onData = function (data) { };
    ProcessWrap.prototype.onFinished = function () { };
    ProcessWrap.prototype.onError = function (err) { };
    ProcessWrap.prototype._start = function () {
        var _this = this;
        if (!this._bin) {
            return;
        }
        if (this.process) {
            this.process.kill();
            this.process = null;
        }
        var process = _LanPlay.createProcess();
        this.process = process;
        process.setProcessChannelModeMerged();
        process.finished.connect(function () { return _this.onFinished(); });
        process.errorOccurred.connect(function (err) { return _this.onError(new Error("Process error: " + err)); });
        process.readyRead.connect(function () { return _this.onData(process.readAll()); });
        process.start(this._bin, this._args);
    };
    Object.defineProperty(ProcessWrap.prototype, "bin", {
        get: function () {
            return this._bin;
        },
        set: function (v) {
            if (this._bin === v) {
                return;
            }
            this._bin = v;
            this._start();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProcessWrap.prototype, "args", {
        set: function (a) {
            var b = this._args;
            if (a.length === b.length && a.every(function (v, i) { return v === b[i]; })) {
                return;
            }
            this._args = a;
            this._start();
        },
        enumerable: true,
        configurable: true
    });
    return ProcessWrap;
}());
var LanPlay = /** @class */ (function () {
    function LanPlay() {
        var _this = this;
        this.process = new ProcessWrap();
        this.args = {
            netif: '',
            relayServerAddr: '',
            socks5ServerAddr: '',
            broadcast: false,
            fakeInternet: false
        };
        this.process.onData = function (d) { return _this.onData(d); };
        this.process.onFinished = function () { return _this.onFinished(); };
        this.process.onError = function (e) { return _this.onError(e); };
    }
    LanPlay.getInstance = function () {
        return this.self;
    };
    LanPlay.prototype.onData = function (data) { };
    LanPlay.prototype.onFinished = function () { };
    LanPlay.prototype.onError = function (err) { };
    LanPlay.prototype._start = function () {
        this.process.args = _paramToArray(this.args);
        this.process.bin = _LanPlay.getLanPlay();
    };
    LanPlay.prototype.setNetif = function (netif) {
        if (this.args.netif === netif)
            return;
        this.args.netif = netif;
        this._start();
    };
    LanPlay.prototype.setRelayServerAddr = function (addr) {
        if (this.args.relayServerAddr === addr)
            return;
        this.args.relayServerAddr = addr;
        this._start();
    };
    LanPlay.prototype.setSocks5ServerAddr = function (addr) {
        if (this.args.socks5ServerAddr === addr)
            return;
        this.args.socks5ServerAddr = addr;
        this._start();
    };
    LanPlay.prototype.listInterface = function (callback) {
        var bin = _LanPlay.getLanPlay();
        if (bin === '') {
            callback(new Error('lan-play executable not found'));
        }
        var p = new ProcessWrap(bin, ['--list-if']);
        var content = '';
        p.onData = function (d) {
            content += d;
        };
        p.onFinished = function () {
            callback(null, _parseNetIf(content).sort(_interfaceSort));
        };
        p.onError = function (e) {
            callback(e);
        };
    };
    LanPlay.self = new LanPlay();
    return LanPlay;
}());
var lanPlay = LanPlay.getInstance();
