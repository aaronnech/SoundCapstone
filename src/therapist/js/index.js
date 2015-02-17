$(function () {
    // Register listeners
    setup();

    // Register the buttons to fire when clicked or when the form has been submitted
    function setup() {
        $("#createAccount").click(createAccountClick);
        $("#formSignup").submit(signupButtonClick);
        $("#formSignin").submit(loginButtonClick);
    };

    // Drops down the modal for the user to register a new account
    function createAccountClick() {
        $("#modal").modal({backdrop: 'static', keyboard: true});
        $("#modal").modal("show");
    };

    // Submits the new user info to the server to register the user.
    function signupButtonClick() {
        var email = $("#signupEmail").val();
        var password = $("#signupPassword").val();

        var signup = {email : email, password : password};
        $.post("/api/user/register", signup, function(data) {
            if (data.success) {
                onLoginSuccess();
            } else {
                onSignupFailure();
            }
        });

        $("#signupButton").prop("disabled", true);
        return false;
    };

    // Submits the user's info to the server for authentication
    function loginButtonClick() {
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();

        var login = {email : email, password : password};
        $.post("/api/user/login", login, function(data) {
            if (data.success) {
                onLoginSuccess();
            } else {
                onLoginFailure();
            }
        });

        $("#loginButton").prop("disabled", true);
        return false; // Prevent redirect
    };

    // Called when the user is successfully logged in (or successfully registers)
    function onLoginSuccess() {
        window.location = "dashboard.html";
    };

    // Called when the user fails to login
    function onLoginFailure() {
        $("#loginError").show();
        $("#loginButton").prop("disabled", false);
    };

    // Called when the user fails to signup
    function onSignupFailure() {
        $("#signupError").show();
        $("#signupButton").prop("disabled", false);
    };
});
