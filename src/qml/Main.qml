import QtQuick 2.9
import QtQuick.Controls 2.9
import "."
import "lan-play.js" as LanPlay

ApplicationWindow {
    id: window
    visible: true
    width: 640
    height: 480
    title: qsTr("Switch Lan Play")

    MainForm {
        button.onClicked: {
            devices.model.clear()
            LanPlay.listInterface(function (err, s) {
                if (err !== null) {
                    console.error('list interface', err)
                } else {
                    for (var i = 0; i < s.length; i++) {
                        s[i].ip = s[i].ip.join(',')
                        devices.model.append(s[i])
                    }
                }
            })
        }
        anchors.fill: parent
    }
}
