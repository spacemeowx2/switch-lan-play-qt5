TARGET = switch-lan-play-qt5

build_ts.commands = npx -p typescript@3 tsc -p $$PWD/ts
build_ts.CONFIG = recursive
QMAKE_EXTRA_TARGETS += build_ts
PRE_TARGETDEPS += build_ts

QT += quick
CONFIG += c++14

INCLUDEPATH += include
SOURCES += \
    main.cpp \
    core/lan-play.cpp

RESOURCES += \
    qml/qml.qrc

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

DISTFILES += \
    qml/qtquickcontrols2.conf

HEADERS += \
    include/core/lan-play.hpp \
    include/native/process.hpp
