$(function () {
    // Register listeners
    setup();

    function setup() {
        $('#tabs').tab();
        $("#addChildButton").click(addChild);
        refreshChildren();
        getUserInfo();
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

        // let's save it locally (create data url and trick browser into download)
        var url = (window.URL || window.webkitURL).createObjectURL(blob);
        var link = window.document.createElement('a');
        link.href = url;
        link.download = recording.word + '.wav';
        var click = document.createEvent("Event");
        click.initEvent("click", true, true);
        link.dispatchEvent(click);
    }

    function playRecording(recording, audioElement) {
        var view = new DataView(toArrayBuffer(recording.raw));
        var blob = new Blob([view], { type : 'audio/wav' });
        var url = (window.URL || window.webkitURL).createObjectURL(blob);

        audioElement.src = url;
        audioElement.play();
    }

    function refreshChildren() {
        $.get('/api/child', {}, function(data) {
            console.log(data);

            if (data.success) {
                // I added a audio tag on the dashboard.html page with id=audio-player
                // playRecording(data.children[0].recordings[4], $("#audio-player").get()[0]);

                var addStudentTab =  $("#addStudentTab").detach();
                var addStudentBody = $("#addStudent").detach();
                $("#tabs").empty().append(addStudentTab);
                $("#studentTabs").empty().append(addStudentBody);
                for (var i = 0; i < data.children.length; i++) {
                    var child = data.children[i];
                    addChildToDOM(child);

                    // Add the recordings into a list group
                    var recordings = data.recordingMap[i];
                    var $panels = $("<div>", {class: "panel-group"});
                    for (var word in recordings) {
                        var $wordGroup = $("<div>", {class: "panel panel-default"});
                        var $panelBody = $("<div>", {class: "panel-collapse collapse", id: word});
                        var $panelContent = $("<div>", {class: "panel-body"});
                        for (var j = 0; j < recordings[word].length; j++) {
                            var $recordingEntry = $("<a>", {class: "list-group-item", href: "#", text: recordings[word][j].added});
                            $recordingEntry.prependTo($panelContent);
                        }

                        $("<a>", {
                            class: "list-group-item",
                            "data-toggle": "collapse",
                            href: "#" + word,
                            text: word
                        }).append($("<span>", {class: "badge", text: recordings[word].length})).prependTo($wordGroup);

                        $panelContent.prependTo($panelBody);
                        $panelBody.appendTo($wordGroup);
                        $wordGroup.appendTo($panels);
                    }
                    $panels.appendTo($("#" + child._id));
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
        $("<li>", {
        }).append($("<a>", {
            href: "#" + child._id,
            "data-toggle": "tab",
            text: child.name
        })).prependTo("#tabs");

        // Add the content of the tab
        $("<div>", {
            class: "tab-pane",
            id: child._id
        }).append($("<h1>", {
            text: child.name
        })).append($("<h4>", {
            text: "Token: " + child.token
        })).prependTo("#studentTabs");
    }

    function reAuth() {
        window.location = "index.html";
    };
});
