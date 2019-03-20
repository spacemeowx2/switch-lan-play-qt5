#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <core/lan-play.hpp>
#include <QtQml>

int main(int argc, char *argv[]) {
    QGuiApplication app( argc, argv );
    QQmlApplicationEngine engine;

    QJSValue lp = engine.newQObject(new LanPlay());
    engine.globalObject().setProperty("_LanPlay", lp);
    qmlRegisterSingletonType(QUrl("qrc:/singleton/LanPlay.qml"), "cn.imspace.slp", 1, 0, "LanPlay");

    engine.load(QUrl(QStringLiteral("qrc:/Main.qml")));

    return app.exec();
}
