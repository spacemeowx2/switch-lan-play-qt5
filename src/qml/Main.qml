import QtQuick 2.9
import QtQuick.Layouts 1.12
import QtQuick.Controls 2.9
import "components"
import "pages"

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
            text: stackView.depth > 1 ? "\u25C0" : "\u2630"
            font.pixelSize: Qt.application.font.pixelSize * 1.6
            onClicked: stackView.depth > 1 ? stackView.pop() : drawer.open()
        }
        ToolButton {
            anchors.right: parent.right
            text: "\u2631"
            font.pixelSize: Qt.application.font.pixelSize * 1.6
            onClicked: stackView.push('pages/Settings.qml')
        }
    }

    Drawer {
        id: drawer
        width: window.width * 0.33
        height: window.height

        Column {
            anchors.fill: parent

            ItemDelegate {
                text: qsTr("Page 1")
                width: parent.width
                onClicked: {
                    drawer.close()
                }
            }
            ItemDelegate {
                text: qsTr("Page 2")
                width: parent.width
                onClicked: {
                    drawer.close()
                }
            }
        }
    }

    StackView {
        id: stackView
        anchors.fill: parent
        initialItem: "pages/DeviceSelect.qml"
    }
}
