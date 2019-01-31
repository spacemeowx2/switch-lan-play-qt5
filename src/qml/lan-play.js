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

function listInterface(callback) {
    var process = _LanPlay.createProcess()
    process.finished.connect(function () {
        console.log('finished')
        const content = process.readAll()

        callback(null, _parseNetIf(content))
    })
    process.errorOccurred.connect(function (err) {
        callback(err)
    })
    process.start('lan-play.exe', ['--list-if'])
}
