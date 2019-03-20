import QtQuick 2.9
import QtQuick.Controls 2.9
import QtQuick.Layouts 1.9
import QtQuick.Controls.Material 2.4

Item {
    id: root

    ScrollView {
        anchors.fill: parent
        anchors.margins: 10
        contentWidth: -1

        ColumnLayout {
            anchors.fill: parent

            CheckBox {
                text: qsTr('--fake-internet')
            }
            CheckBox {
                text: qsTr('--broadcast')
            }
            TextField {
                Layout.fillWidth: true
                placeholderText: qsTr('代理服务器(留空为不使用代理)')
                background.width: width
            }
        }

    }
}
