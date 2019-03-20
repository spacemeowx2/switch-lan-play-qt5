import "../lan-play.js" as SLP
import QtQuick 2.9
import QtQuick.Controls 2.9

ListView {
    id: deviceList
    clip: true
    signal selected(string deviceName)
    property var lanPlay: SLP.lanPlay

    Component.onCompleted: loadDevices()
    function loadDevices() {
        deviceList.model.clear()
        lanPlay.listInterface(function (err, s) {
            if (err !== null) {
                console.error('list interface', err)
            } else {
                for (var i = 0; i < s.length; i++) {
                    s[i].ip = s[i].ip.join(',')
                    deviceList.model.append(s[i])
                }
            }
        })
    }
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
        height: netif.height + 10

        Column {
            id: netif
            x: 5
            y: 5
            width: parent.width - 10
            height: childrenRect.height
            Item {
                width: parent.width
                height: childrenRect.height
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
                text: (ip.length > 0) ? ('IP: ' + ip) : ''
            }
        }
        MouseArea {
            anchors.fill: parent
            onClicked: deviceList.currentIndex = index
            onDoubleClicked: deviceList.selected(name)
        }
    }
    highlight: Rectangle {
        color: "lightsteelblue"
        radius: 5
    }
    focus: true
}
