#include <core/lan-play.hpp>
#include <native/process.hpp>
#include <QCoreApplication>
#include <QDir>
#include <QStandardPaths>

LanPlay::LanPlay(QObject *parent) : QObject(parent) {
    //
}

QObject* LanPlay::createProcess() {
    return new Process();
}

QString LanPlay::findFile(QString name) {
#if defined(Q_OS_MAC) || defined(Q_OS_LINUX)
    auto bin = name;
#elif defined(Q_OS_WIN)
    auto bin = name + ".exe";
#else
    return "";
#endif
    auto curDir = QDir(QCoreApplication::applicationDirPath());
    do {
        auto curFile = QFileInfo(curDir.absoluteFilePath(bin));
        if (curFile.exists() && QFileInfo(curFile).isFile()) {
            auto path = curFile.absoluteFilePath();
            if (!curFile.isExecutable()) {
                QFile file(path);
                file.setPermissions(file.permissions() | QFile::ExeOwner | QFile::ExeOther | QFile::ExeGroup);
            }
            return path;
        }
    } while (curDir.cdUp() && curDir.exists());
    return "";
}

QString LanPlay::findLanPlay() {
    return this->findFile("lan-play");
}

QString LanPlay::getConfig() {
    QFile file(this->getConfigPath());
    file.open(QIODevice::ReadOnly);
    return file.readAll();
}

void LanPlay::setConfig(QJSValue config) {
    QFile file(this->getConfigPath());
    file.open(QIODevice::WriteOnly);
    file.write(config.toString().toUtf8());
}

QString LanPlay::getConfigPath() {
    return QStandardPaths::writableLocation(QStandardPaths::AppDataLocation);
}
