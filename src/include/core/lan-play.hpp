#ifndef LANPLAY_HPP
#define LANPLAY_HPP

#include <QObject>
#include <QJSValue>

class LanPlay : public QObject {
    Q_OBJECT
public:
    explicit LanPlay(QObject *parent = nullptr);

    Q_INVOKABLE QStringList listInterface(QJSValue jsCallback);
    Q_INVOKABLE QObject* createProcess();

};

#endif // LANPLAY_HPP
