$(function () {
    // Register listeners
    setup();
    var cachedRecordings = {};

    function setup() {
        $('#tabs').tab();
        $("#addChildButton").click(addChild);
        $("#audio-player").bind('ended', function(){
            $(".playImage").remove();
        });
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
                    var words = {};
                    for (var word in child.recordingMap) {
                        words[word] = []
                        for (var j = 0; j < child.recordingMap[word].length; j++) {
                            var date = child.recordingMap[word][j].added;
                            var id = child.recordingMap[word][j]._id;
                            var recording = {date : date, id : id};
                            words[word].push(recording);
                        }
                    }

                    // Yay Hack
                    var panels = $("<div>", {class: "panel-group"});
                    for (var word in words) {
                        var recordings = words[word];
                        var panelId = child._id + "_" + word;

                        var panel = $("<div>", {
                            class: "panel panel-default"
                        });

                        var tag = $("<a>", {
                            class: "list-group-item",
                            "data-toggle": "collapse",
                            href: "#" + panelId,
                            text: word
                        });

                        var tagCount = $("<span>", {
                            class: "badge",
                            text: recordings.length
                        });

                        var recordingPanel = $("<div>", {
                            class: "panel-collapse collapse",
                            id: panelId
                        });

                        var recordingPanelBody = $("<div>", {
                            class: "panel-body"
                        });

                        for (var j = 0; j < recordings.length; j++) {
                            var datetime = new Date(recordings[j].date);
                            var recordingEntry = $("<a>", {
                                class: "list-group-item recording",
                                href: "#",
                                text: datetime.toLocaleString(),
                                id: recordings[j].id
                            });

                            // TODO: Delete button
                            // var deleteButton = $("<button>", {
                            //     class: "btn btn-danger btn-mini",
                            //     text: "Delete"
                            // });

                            // Add the entry to the body
                            recordingEntry.appendTo(recordingPanelBody);
                        }

                        // Tags first
                        tagCount.appendTo(tag);
                        tag.appendTo(panel);

                        // Then recordings
                        recordingPanelBody.appendTo(recordingPanel);
                        recordingPanel.appendTo(panel);

                        // Then attach to page
                        panel.appendTo(panels);
                    }

                    panels.appendTo($("#" + child._id));

                    // Set up the click to download the recording
                    $(".recording").unbind("click").click(function() {
                        // Loading GIF
                        var loadingGif = $("<img>", {
                            class: "loadingGif",
                            src: "/therapist/img/ajax-loader.gif",
                            alt: "Loading Icon"
                        });
                        loadingGif.appendTo($(this));
                        if (cachedRecordings[this.id]) {
                            console.log("Loading " + this.id + " from cache");
                            onReceiveRecording(cachedRecordings[this.id]);
                        } else {
                            var params = {id: this.id};
                            console.log(params);


                            $.get("/api/recording", params, onReceiveRecording);
                        }

                        return false;
                    });
                }
            } else if (data.notAuth) {
                reAuth();
            }
        });
    };

    function addChild() {
        var child = {name : $("#childNameInput").val(), token : $("#childTokenInput").val()};
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
    };

    function playRecording(recording, audioElement) {
        var blob = new Blob([toArrayBuffer(recording.raw)], { type : 'audio/wav' });
        var url = (window.URL || window.webkitURL).createObjectURL(blob);

        audioElement.src = url;
        audioElement.play();
    };

    function onReceiveRecording(data) {
        var loadingGif = $(".loadingGif");
        if (data.success) {
            cachedRecordings[data.recording._id] = data;
            playRecording(data.recording, $("#audio-player").get()[0]);

            var playImage = $("<img>", {
                class: "playImage",
                src: "/therapist/img/play.png",
                alt: "Play Icon"
            });
            playImage.appendTo(loadingGif.parent());
        } else if (data.notAuth) {
            reAuth();
        }

        loadingGif.remove();
    };
});
