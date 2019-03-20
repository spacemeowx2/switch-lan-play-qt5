interface NetInterface {
  no: string
  name: string
  description: string
  ip: string[]
}

function _parseNetIf(content: string) {
  let out: NetInterface[] = []
  let re = /(\d+)\.\s*([0-9a-zA-Z\-_{}]+)\s*\((.*)\)(\r?\n\s*IP:\s*\[(.*)\])?/g

  while (1) {
    var r = re.exec(content)
    if (r === null) {
      break
    }
    out.push({
      no: r[1],
      name: r[2],
      description: r[3],
      ip: r[5].split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0)
    })
  }

  return out
}


function _interfaceSort(a: NetInterface, b: NetInterface) {
  const DESC_BLACK_RANK = 1000
  const IP_RANK = 100
  const DESC_BLACK_LIST = ['Oracle', 'Microsoft Corporation']

  let ascore = 0
  let bscore = 0

  ascore += (DESC_BLACK_LIST.indexOf(a.description) === -1 ? 1 : 0) * DESC_BLACK_RANK
  bscore += (DESC_BLACK_LIST.indexOf(b.description) === -1 ? 1 : 0) * DESC_BLACK_RANK
  
  const interfaceIpScore = (ip: string) => {
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
  const reduceMax = (a: number, b: number) => a > b ? a : b
  ascore += (a.ip.map(interfaceIpScore).reduce(reduceMax, 0)) * IP_RANK
  bscore += (b.ip.map(interfaceIpScore).reduce(reduceMax, 0)) * IP_RANK

  if (ascore - bscore === 0) {
    return parseInt(a.no) - parseInt(b.no)
  } else {
    return bscore - ascore
  }
}

function _paramToArray(param: Record<string, any>, preventSetBuf?: boolean) {
  const keys = Object.keys(param)
  let out = []

  for (const key of keys) {
    const value = param[key]

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

class ProcessWrap {
  private process: QProcess | null = null
  private _args: string[] = []
  private _bin: string = ''
  constructor (bin?: string, args?: string[]) {
    if (bin) {
      this._bin = bin
    }
    if (args) {
      this._args = args
    }
    this._start()
  }
  onData (data: string) {}
  onFinished () {}
  onError (err: Error) {}
  private _start () {
    if (!this._bin) {
      return
    }
    if (this.process) {
      this.process.kill()
      this.process = null
    }
    const process = _LanPlay.createProcess()

    this.process = process

    process.setProcessChannelModeMerged()
    process.finished.connect(() => this.onFinished())
    process.errorOccurred.connect((err: number) => this.onError(new Error(`Process error: ${err}`)))
    process.readyRead.connect(() => this.onData(process.readAll()))
    process.start(this._bin, this._args)
  }
  set bin (v: string) {
    if (this._bin === v) {
      return
    }
    this._bin = v
    this._start()
  }
  get bin () {
    return this._bin
  }
  set args (a: string[]) {
    const b = this._args
    if (a.length === b.length && a.every((v, i) => v === b[i])) {
      return
    }
    this._args = a
    this._start()
  }
}
interface LanPlayArgs {
  netif: string
  relayServerAddr: string
  socks5ServerAddr: string
  broadcast: boolean
  fakeInternet: boolean
}
class LanPlay {
  args: LanPlayArgs
  process = new ProcessWrap()
  static self = new LanPlay()
  static getInstance() {
    return this.self
  }
  private constructor () {
    this.args = {
      netif: '',
      relayServerAddr: '',
      socks5ServerAddr: '',
      broadcast: false,
      fakeInternet: false
    }
    this.process.onData = d => this.onData(d)
    this.process.onFinished = () => this.onFinished()
    this.process.onError = e => this.onError(e)
  }
  onData (data: string) {}
  onFinished () {}
  onError (err: Error) {}
  private _start () {
    this.process.args = _paramToArray(this.args)
    this.process.bin = _LanPlay.findLanPlay()
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
  listInterface(callback: (err: Error | null, netif?: NetInterface[]) => void) {
    const bin = _LanPlay.findLanPlay()
  
    if (bin === '') {
      callback(new Error('lan-play executable not found'))
    }
    const p = new ProcessWrap(bin, ['--list-if'])
    let content = ''
    p.onData = d => {
      content += d
    }
    p.onFinished = () => {
      callback(null, _parseNetIf(content).sort(_interfaceSort))
    }
    p.onError = e => {
      callback(e)
    }
  }
}
const lanPlay = LanPlay.getInstance()
