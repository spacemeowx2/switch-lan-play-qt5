import QtQuick 2.9
import QtQuick.Controls 2.9
import QtQuick.Layouts 1.9

Item {
    ScrollView {
        anchors.fill: parent
        anchors.margins: 10

        ColumnLayout {
            CheckBox {
                text: qsTr('--fake-internet')
            }
            CheckBox {
                text: qsTr('--broadcast')
            }
            Label {
                text: qsTr('代理服务器(留空为不使用代理)')
            }
            TextInput {
                height: 20
            }
        }
    }
}
