#include <core/lan-play.hpp>
#include <native/process.hpp>

LanPlay::LanPlay(QObject *parent) : QObject(parent) {
    //
}

QStringList LanPlay::listInterface(QJSValue jsCallback) {
    QStringList list;
    QProcess lp;
    lp.start("./lan-play", QStringList("--list-if"));
    return list;
}

Q_INVOKABLE QObject* LanPlay::createProcess() {
    return new Process();
}
