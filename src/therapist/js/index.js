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
    function createAccountClick() {asjdhasjdhaks
        $("#modal").modal({backdrop: 'static', keyboard: true});
        $("#modal").modal("show");
    };

    // Submits the new user info to the server to register the user.
    function signupButtonClick() {
        var email = $("#signupEmail").val();
        var password = $("#signupPassword").val();

        var signup = {email : email, password : password};

        // TODO: Send info to server to register user
        console.log(signup);

        $("#signupButton").prop("disabled", true);

        onSignupFailure();
        return false;
    };

    // Submits the user's info to the server for authentication
    function loginButtonClick() {
        var email = $("#inputEmail").val();
        var password = $("#inputPassword").val();

        var login = {email : email, password : password};

        // TODO: Authenticate user
        console.log(login);

        $("#loginButton").prop("disabled", true);

        onLoginFailure();
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
