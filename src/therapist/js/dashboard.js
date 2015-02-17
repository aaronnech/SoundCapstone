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
            var addStudentTab =  $("#addStudentTab").detach();
            var addStudentBody = $("#addStudent").detach();
            $("#tabs").empty().append(addStudentTab);
            $("#studentTabs").empty().append(addStudentBody);
            for (var i = 0; i < data.children.length; i++) {
                // TODO: Add array of words (each word is an array of links) to child object
                var child = data.children[i];
                addChildToDOM(child);
            }
        });
    };

    function addChild() {
        child = {name : $("#childNameInput").val()};
        $.post("/api/child/add", child, function(data) {
            console.log(data);
            addChildToDOM(data);
            $("#studentId").text(data.token);
            $("#studentIdAlert").show();
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
        }).append( $('<h1>', {
            text: child.name
        })).prependTo('#studentTabs');
    }
});
