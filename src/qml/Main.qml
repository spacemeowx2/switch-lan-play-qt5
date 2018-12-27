import QtQuick 2.9
import QtQuick.Controls 2.2
import "."

ApplicationWindow {
    id: window
    visible: true
    width: 640
    height: 480
    title: qsTr("Switch Lan Play")

    MainForm {
        anchors.fill: parent
    }
}
