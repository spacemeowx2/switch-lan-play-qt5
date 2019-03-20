pragma Singleton
import QtQuick 2.9
import "../lan-play.js" as SLP

QtObject {
    property var getLanPlay: function getLanPlay() {
        return SLP.lanPlay
    }
}
