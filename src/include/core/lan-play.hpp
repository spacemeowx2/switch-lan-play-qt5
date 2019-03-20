#ifndef LANPLAY_HPP
#define LANPLAY_HPP

#include <QObject>
#include <QJSValue>

class LanPlay : public QObject {
    Q_OBJECT
private:
    QString getConfigPath();
public:
    explicit LanPlay(QObject *parent = nullptr);

    Q_INVOKABLE QObject* createProcess();
    Q_INVOKABLE QString findFile(QString bin);
    Q_INVOKABLE QString findLanPlay();
    Q_INVOKABLE QString getConfig();
    Q_INVOKABLE void setConfig(QJSValue config);
};

#endif // LANPLAY_HPP
