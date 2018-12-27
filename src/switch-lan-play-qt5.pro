TARGET = switch-lan-play-qt5

QT += quick
CONFIG += c++14

SOURCES += \
    main.cpp

RESOURCES += \
    ui/qml.qrc

unix {
    isEmpty(PREFIX) {
        PREFIX = /usr/local
    }

    icon_file = ../deploy/icon.png
    desktop_file = ../deploy/switch-lan-play-qt5.desktop

    share_applications.path = $$PREFIX/share/applications
    share_applications.files = $$desktop_file
    
    target.path = $$PREFIX/bin
    INSTALLS += target share_applications

    !isEmpty(APPIMAGE) {
        appimage_root.path = /
        appimage_root.files = $$icon_file $$desktop_file

        INSTALLS += appimage_root
        DEFINES += APPIMAGE
    }
}
