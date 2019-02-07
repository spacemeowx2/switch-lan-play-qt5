#ifndef PROCESS_HPP
#define PROCESS_HPP

#include <QProcess>
#include <QVariant>

class Process : public QProcess {
    Q_OBJECT

public:
    Process(QObject *parent = nullptr) : QProcess(parent) { }

    Q_INVOKABLE void start(const QString &program, const QVariantList &arguments) {
        QStringList args;

        for (int i = 0; i < arguments.length(); i++)
            args << arguments[i].toString();

        QProcess::start(program, args, QProcess::Unbuffered | QProcess::ReadWrite);
    }

    Q_INVOKABLE QByteArray readAll() {
        return QProcess::readAll();
    }

    Q_INVOKABLE QByteArray readAllStandardOutput() {
        return QProcess::readAllStandardOutput();
    }

    Q_INVOKABLE QByteArray readAllStandardError() {
        return QProcess::readAllStandardError();
    }

    Q_INVOKABLE void setProcessChannelModeMerged() {
        QProcess::setProcessChannelMode(QProcess::MergedChannels);
    }
};

#endif // PROCESS_HPP
