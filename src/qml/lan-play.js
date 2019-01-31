function _parseNetIf(content) {
    var out = []
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

function _interfaceIpScore(ip) {
    const IP_PREFIX_SCORE = {
        '192.168.56.': 1,
        '192.168.': 3,
        '169.254.': 1,
        '127.0.0.1': 1
    }
    for (let [key, value] of Object.entries(IP_PREFIX_SCORE)) {
        if (key === ip.substr(0, key.length)) {
            return value
        }
    }
    return 2
}

function _reduceMax(a, b) {
    return a > b ? a : b
}

function _interfaceSort(a, b) {
    const DESC_BLACK_RANK = 1000
    const IP_RANK = 100
    const DESC_BLACK_LIST = ['Oracle', 'Microsoft Corporation']

    var ascore = 0
    var bscore = 0

    ascore += (DESC_BLACK_LIST.indexOf(a.description) === -1 ? 1 : 0) * DESC_BLACK_RANK
    bscore += (DESC_BLACK_LIST.indexOf(b.description) === -1 ? 1 : 0) * DESC_BLACK_RANK

    ascore += (a.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK
    bscore += (b.ip.map(_interfaceIpScore).reduce(_reduceMax, 0)) * IP_RANK

    if (ascore - bscore === 0) {
        return a.no - b.no
    } else {
        return bscore - ascore
    }
}

function listInterface(callback) {
    var process = _LanPlay.createProcess()
    process.finished.connect(function () {
        console.log('finished')
        const content = process.readAll()

        callback(null, _parseNetIf(content).sort(_interfaceSort))
    })
    process.errorOccurred.connect(function (err) {
        callback(err)
    })
    process.start('lan-play.exe', ['--list-if'])
}
