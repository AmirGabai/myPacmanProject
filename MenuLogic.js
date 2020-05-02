

let users; //will store all the users. has p user at first.
let loggedUser;





// $("#about").bind('clickoutside', function () 
// {
//     ("#about").dialog('close');
// });




$(document).ready(function () {
    //welcome screen is shown when document is ready
    var welcomeScreen = $("#welcome");
    welcomeScreen.css("display", "block");

    //enter p user to the users array
    let user = { username: "p", password: "p", fullname: "p user", email: "p@email", day: 1, month: 1, year: 2000 };
    users = new Array();
    users[0] = user;


    //validate the regiseration forn
    jQuery.validator.addMethod("passwordCheck", function (value) {
        return /[a-z].*[0-9]|[0-9].*[a-z]/i.test(value);
    }, 'Your input must contain at least 1 letter and 1 number');

    jQuery.validator.addMethod("notContainNumber", function (value) {
        return /^([^0-9]*)$/i.test(value);
    }, 'Your input must not contain a number');

    $('#registerForm').validate({ // initialize the plugin
        rules: {
            registerUserName:
            {
                required: true
            },

            registerPassword:
            {
                required: true,
                minlength: 6,
                passwordCheck: true
            },

            registerFullName:
            {
                required: true,
                notContainNumber: true
            },

            registerEmail:
            {
                required: true,
                email: true
            },

            registerationDay:
            {
                required: true
            },

            registerationMonth:
            {
                required: true
            },

            registerationYear:
            {
                required: true
            }
        }
    });


    $("#registerForm").validate();



    //bind the dialog of about to clicking outside event
    // $('body').click(closeAboutDialog());
    // document.getElementById("about").addEventListener('click', function (e) {
    //     if(e.target != document.getElementById("about"))
    //     {
    //         closeAboutDialog();
    //     }


    // });

    $('#about').click(function (e) {
        if(e.target == this)
        {
            document.getElementById("about").close();
        }
        

    });
});

function menuWelcomeClicked() {
    stopGame();
    $("#container > div").css("display", "none");
    $("#welcome").css("display", "block");
}

function menuRegisterClicked() {
    stopGame();
    $("#container > div").css("display", "none");
    $("#register").css("display", "block");
}

function menuLoginClicked() {
    stopGame();
    $("#container > div").css("display", "none");
    $("#login").css("display", "block");
}

function menuAboutClicked() {
    document.getElementById("about").showModal();
}

function closeAboutDialog() {
    document.getElementById("about").close();
}


function submitRegisteration() {
    if ($("#registerForm").valid() == true) {//the form is valid
        let newUser = { username: $("#registerUserName").val(), password: $("#registerPassword").val(), fullname: $("#registerFullName").val(), email: $("#registerEmail").val(), day: $("#registerDay").val(), month: $("#registerMonth").val(), year: $("#registerYear").val() };
        users[users.length] = newUser;
        alert("Registeration Succeeded");

        //clear all texts
        let elements = document.getElementsByTagName("input");
        for (let i = 0; i < elements.length; i++) {
            if (elements[i].type == "text") {
                elements[i].value = "";
            }
        }

        menuWelcomeClicked();
    }
    else {//the form is not valid
        alert("Can not be submitted - some fields are not filled right");
    }

}

function startGameClicked() {
    if ($("#keyUp").val() == "" || $("#keyDown").val() == "" || $("#keyRight").val() == "" || $("#keyLeft").val() == "" ||
        $("#candyNum").val() == "" || $("#gameTime").val() == "" || $("#monstersNum").val() == "" ||
        $("#candyNum").val() > 90 || $("#candyNum").val() < 50 || $("#gameTime").val() < 60 || $("#monstersNum").val() < 1 || $("#monstersNum").val() > 4) {
        alert("At least one of the settings is wrong or empty");
        return;
    }
    else {
        startGame();
    }

}


function login() {
    let username = $("#loginUserName").val();
    let password = $("#loginPassword").val();

    loggedUser = getUser(username, password);

    if (loggedUser != null) {
        //show gameScreen
        $("#gameScreen").css("display", "block");
        $("#gameScreen > #gameInformation").css("display", "none");
        lblPlayerName.value = loggedUser.fullname;
        //hide login panel
        $("#login").css("display", "none");
    }
    else {
        alert("User does not exist. Please check your password or register to our system")
    }
}

function getUser(username, password) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username) {
            if (users[i].password == password) {
                return users[i];
            }
        }
    }
}

function keySelectionDown(event, textBox) {
    $(textBox).val("");
    $(textBox).val(event.keyCode);
}

function randomSettings() {
    //keys
    $("#keyUp").val(38);
    $("#keyDown").val(40);
    $("#keyRight").val(39);
    $("#keyLeft").val(37);
    //candies
    let rndNum50to90 = Math.floor(Math.random() * 40) + 50;
    $("#candyNum").val(rndNum50to90);
    //game time
    let rndNum60to120 = Math.floor(Math.random() * 60) + 60;
    $("#gameTime").val(rndNum60to120);
    //monsters number
    let rndNum1to4 = Math.floor(Math.random() * 3) + 1;
    $("#monstersNum").val(rndNum1to4);

}