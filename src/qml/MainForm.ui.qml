import QtQuick 2.9
import QtQuick.Controls 2.9

Item {
    id: element
    width: 400
    height: 400
    property alias button: button
    property alias devices: devices

    ListView {
        id: devices
        x: 0
        y: 0
        width: parent.width
        height: parent.height
        clip: true

        model: ListModel {
            ListElement {
                no: "1"
                name: "{01B18F79-D26D-4BE3-88D1-DD179CD65BD6}"
                description: "Microsoft Corporation"
                ip: '192.168.1.1'
            }
        }
        delegate: Item {
            width: parent.width
            height: 40

            Column {
                anchors.fill: parent
                anchors.margins: 5
                Row {
                    width: parent.width
                    height: number.height
                    Text {
                        id: number
                        text: no + '.'
                    }
                    Text {
                        anchors.margins: 5
                        anchors.left: number.right
                        anchors.right: desc.left
                        text: name
                        clip: true
                    }
                    Text {
                        anchors.right: parent.right
                        id: desc
                        text: '(' + description + ')'
                    }
                }

                spacing: 5
                Text {
                    x: 20
                    text: 'IP: ' + ip
                }
            }
            MouseArea {
                anchors.fill: parent
                onClicked: devices.currentIndex = index
            }
        }
        highlight: Rectangle {
            color: "lightsteelblue"
            radius: 5
        }
        focus: true
    }

    Button {
        id: button
        x: 214
        y: 209
        text: qsTr("Button")
    }
}
