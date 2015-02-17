$(function () {
    // Register listeners
    setup();

    function setup() {
        $('#tabs').tab();
        $("#therapistName").text("THERAPIST NAME");
        $("#addChildButton").click(addChild);
        refreshChildren();
    };

    function refreshChildren() {
        $.get('/api/child', {}, function(data) {
            console.log(data);

            if (data.success) {
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
