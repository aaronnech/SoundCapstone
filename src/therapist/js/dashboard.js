$(function () {

    // Register listeners
    setup();
    $('#tabs').tab();

    function setup() {
        $("#therapistName").text("THERAPIST NAME");
        $("#addChildButton").click(addChild);
    };

    function addChild() {
        child = {name : $("#childNameInput").val()};
        console.log(child);
        $.post("/api/child/add", child, function(data) {
            console.log(data);
        });
    };
});
