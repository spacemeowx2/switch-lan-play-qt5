interface NetInterface {
    no: string
    name: string
    description: string
    ip: string[]
}

function _parseNetIf(content: string) {
    var out: NetInterface[] = []
    var re = /(\d+)\.\s*([0-9a-zA-Z\-_{}]+)\s*\((.*)\)(\r?\n\s*IP:\s*\[(.*)\])?/g

    while (1) {
        var r = re.exec(content)
        if (r === null) {
            break
        }
        out.push({
            no: r[1],
            name: r[2],
            description: r[3],
            ip: r[5].split(',').filter(function (s) {
                return s.length > 0
            }).map(function (s) {
                return s.trim()
            })
        })
    }

    return out
}

function _interfaceIpScore(ip: string): number {
    const IP_PREFIX_SCORE: { [key: string]: number } = {
        '192.168.56.': 1,
        '192.168.': 3,
        '169.254.': 1,
        '127.0.0.1': 1
    }
    for (let key of Object.keys(IP_PREFIX_SCORE)) {
        if (key === ip.substr(0, key.length)) {
            return IP_PREFIX_SCORE[key]
        }
    }
    return 2
}

function _reduceMax(a: number, b: number) {
    return a > b ? a : b
}

function _interfaceSort(a: NetInterface, b: NetInterface) {
    var DESC_BLACK_RANK = 1000
    var IP_RANK = 100
    var DESC_BLACK_LIST = ['Oracle', 'Microsoft Corporation']

    var ascore = 0
    var bscore = 0

    ascore += (DESC_BLACK_LIST.indexOf(a.description) === -1 ? 1 : 0) * DESC_BLACK_RANK
    bscore += (DESC_BLACK_LIST.indexOf(b.description) === -1 ? 1 : 0) * DESC_BLACK_RANK

    ascore += (a.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK
    bscore += (b.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK

    if (ascore - bscore === 0) {
        return parseInt(a.no) - parseInt(b.no)
    } else {
        return bscore - ascore
    }
}

function _paramToArray(param: Record<string, string | boolean>, preventSetBuf?: boolean) {
    var keys = Object.keys(param)
    var out = []

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i]
        var value = param[key]

        if (value === true) {
            out.push(key)
        } else {
            out.push(key, value)
        }
    }

    if (!preventSetBuf) {
        out.push('--set-ionbf')
    }

    return out
}

function listInterface(callback) {
    var bin = _LanPlay.getLanPlay()
    var process = _LanPlay.createProcess()

    if (bin === '') {
        callback(new Error('lan-play executable not found'))
    }

    console.log('lan-play path: ', bin)
    process.finished.connect(function () {
        console.log('finished')
        var content = process.readAll()

        callback(null, _parseNetIf(content).sort(_interfaceSort))
    })
    process.errorOccurred.connect(function (err) {
        callback(err)
    })
    process.start(bin, ['--list-if'])
}

var _currentLanPlay = null
function runLanPlay(param, onData, callback) {
    if (_currentLanPlay) {
        _currentLanPlay.kill()
        _currentLanPlay = null
    }
    var bin = _LanPlay.getLanPlay()
    var process = _LanPlay.createProcess()

    _currentLanPlay = process

    process.setProcessChannelModeMerged()
    process.finished.connect(function () {
        callback(null)
    })
    process.errorOccurred.connect(function (err) {
        callback(err)
    })
    process.readyRead.connect(function () {
        onData(process.readAll())
    })
    process.start(bin, _paramToArray(param))

    return function (text) {
        process.write(text)
    }
}

interface LanPlayArgs {
    netif: string
    relayServerAddr: string
    socks5ServerAddr: string
    broadcast: boolean
    fakeInternet: boolean
}
interface QProcess {}
class LanPlay {
    args: LanPlayArgs
    process: QProcess | null
    constructor () {
        this.args = {
            netif: '',
            relayServerAddr: '',
            socks5ServerAddr: '',
            broadcast: false,
            fakeInternet: false
        }
        this.process = null
    }
    onData (data: string) {}
    onFinished () {}
    onError (err: any) {}
    _start () {
        if (this.process) {
            this.process.kill()
            this.process = null
        }
        var process = _LanPlay.createProcess()
    
        this.process = process
    
        process.setProcessChannelModeMerged()
        process.finished.connect(() => {
            this.onFinished()
        })
        process.errorOccurred.connect((err: any) => {
            this.onError(err)
        })
        process.readyRead.connect(() => {
            this.onData(process.readAll())
        })
        process.start(_LanPlay.getLanPlay(), _paramToArray(this.args))
    }
    setNetif(netif: string) {
        if (this.args.netif === netif) return
        this.args.netif = netif
        this._start()
    }
    setRelayServerAddr(addr: string) {
        if (this.args.relayServerAddr === addr) return
        this.args.relayServerAddr = addr
        this._start()
    }
    setSocks5ServerAddr(addr: string) {
        if (this.args.socks5ServerAddr === addr) return
        this.args.socks5ServerAddr = addr
        this._start()
    }
}
