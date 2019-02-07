interface QSignal<Callback extends Function = () => void> {
    connect(cb: Callback): void
}
interface QProcess {
    errorOccurred: QSignal<(err: number) => void>
    finished: QSignal
    readyRead: QSignal
    readAll(): string
    start(process: string, args: string[]): void
    kill(): void
    setProcessChannelModeMerged(): void
}
interface LanPlayCore {
    getLanPlay(): string
    createProcess(): QProcess
}
declare const _LanPlay: LanPlayCore
