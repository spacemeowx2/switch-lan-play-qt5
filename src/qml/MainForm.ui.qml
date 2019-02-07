import QtQuick 2.9
import QtQuick.Controls 2.9
import "components"

Item {
    id: root
    width: 400
    height: 400
    opacity: 0.8
    property alias refresh: refresh
    property alias devices: devices
    signal selected(String name)

    DeviceList {
        anchors.fill: parent
    }

    Button {
        anchors.horizontalCenter: parent.horizontalCenter
        anchors.bottom: parent.bottom
        anchors.bottomMargin: 5
        id: refresh
        x: 214
        y: 209
        text: qsTr("刷新")
    }
}
