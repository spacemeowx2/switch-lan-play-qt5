#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <core/lan-play.hpp>

int main(int argc, char *argv[]) {
    QGuiApplication app( argc, argv );
    QQmlApplicationEngine engine;

    QJSValue lp = engine.newQObject(new LanPlay());
    engine.globalObject().setProperty("_LanPlay", lp);
    engine.load(QUrl(QStringLiteral("qrc:/Main.qml")));

    return app.exec();
}
