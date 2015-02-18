$(function () {
    // Register listeners
    setup();

    function setup() {
        $('#tabs').tab();
        $("#addChildButton").click(addChild);
        refreshChildren();
        getUserInfo();

        $.get('/api/user', {}, function(data) {

        });

    };

    function getUserInfo() {
        $.get('/api/user', {}, function(data) {
            console.log(data);

            if (data.success) {
                $("#therapistName").text(data.user.email);
            } else if (data.notAuth) {
                reAuth();
            }
        });
    };

    function toArrayBuffer(buffer) {
        var ab = new ArrayBuffer(buffer.length);
        var view = new Uint8Array(ab);
        for (var i = 0; i < buffer.length; ++i) {
            view[i] = buffer[i];
        }
        return ab;
    };

    function downloadRecording(recording) {
        var view = new DataView(toArrayBuffer(recording.raw));

        var blob = new Blob([view], { type : 'audio/wav' });

        // let's save it locally (trick browser into download)
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = 'output.wav';
        var click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    }

    function refreshChildren() {
        $.get('/api/child', {}, function(data) {
            console.log(data);

            if (data.success) {
                //TODO: REMOVE LATER (get first child's rabbit map's first element)
                if (data.recordingMap[0] && data.recordingMap[0]['RABBIT'].length) {
                    downloadRecording(data.recordingMap[0]['RABBIT'][1]);
                }

                var addStudentTab =  $("#addStudentTab").detach();
                var addStudentBody = $("#addStudent").detach();
                $("#tabs").empty().append(addStudentTab);
                $("#studentTabs").empty().append(addStudentBody);
                for (var i = 0; i < data.children.length; i++) {
                    // TODO: Add array of words (each word is an array of links) to child object
                    var child = data.children[i];
                    addChildToDOM(child);
                }
            } else if (data.notAuth) {
                reAuth();
            }
        });
    };

    function addChild() {
        child = {name : $("#childNameInput").val()};
        $.post("/api/child/add", child, function(data) {
            console.log(data);

            if (data.success) {
                addChildToDOM(data.child);
                $("#studentId").text(data.child.token);
                $("#studentIdAlert").show();
            } else if (data.notAuth) {
                reAuth();
            }
        });
    };

    function addChildToDOM(child) {
        // Add the tab header
        $('<li>', {
        }).append($('<a>', {
            href: '#' + child._id,
            "data-toggle": "tab",
            text: child.name
        })).prependTo('#tabs');

        // Add the content of the tab
        $('<div>', {
            class: "tab-pane",
            id: child._id
        }).append($('<h1>', {
            text: child.name
        })).append($('<h4>', {
            text: "Token: " + child.token
        })).prependTo('#studentTabs');
    }

    function reAuth() {
        window.location = "index.html";
    };
});
