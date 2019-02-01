import "lan-play.js" as LanPlay
import QtQuick 2.9
import QtQuick.Layouts 1.12
import QtQuick.Controls 2.9
import "components"

ApplicationWindow {
    id: window
    visible: true
    width: 640
    height: 480
    title: qsTr("Switch Lan Play")

    header: ToolBar {
        RowLayout {
            anchors.fill: parent
            Label {
                text: "Title"
                elide: Label.ElideRight
                horizontalAlignment: Qt.AlignHCenter
                verticalAlignment: Qt.AlignVCenter
                Layout.fillWidth: true
            }
        }
        ToolButton {
            text: qsTr("")
            onClicked: menu.open()
        }
    }

    StackView {
        id: stack
        anchors.fill: parent
        property var write

        DeviceList {
            onSelected: {
                var param = {
                    '--netif': name,
                    '--relay-server-addr': 'localhost:11451'
                }
                stack.write = LanPlay.runLanPlay(param, function (out) {
                    output.text += out
                }, function (err) {
                    output.text += err
                }, function (err) {
                    console.log('run end', err)
                })
            }
        }

        Text {
            id: output
            text: "test"
        }
        TextInput {
            y: 100
            width: 100
            height: 40
            id: input
            Keys.onEnterPressed: stack.write(input.text)
        }
    }
}
