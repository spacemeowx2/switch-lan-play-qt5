import "../lan-play.js" as LanPlay
import QtQuick 2.9
import QtQuick.Layouts 1.12
import QtQuick.Controls 2.9
import "../components"

DeviceList {
    id: deviceList
    property var lanPlay
    property string output

    Component.onCompleted: {
        lanPlay = {
            output: ''
        }
    }

    onSelected: {
        var param = {
            '--netif': deviceName,
            '--relay-server-addr': 'localhost:11451'
        }
        output = ''
        deviceList.lanPlay = LanPlay.runLanPlay(param, function (out) {
            output += out
        }, function (err) {
            console.log('run end', err)
        })
    }
}

