

var socket = io();
$(() => {
    if (!localStorage.getItem('name')) {
        $('#userNameModal').modal('show');
    }

    $('#start-chat-btn').on('click', function (e) {
        e.preventDefault();
        var name = $('#name-input').val();
        if (name === '') {
            $('#name-input').siblings('.invalid-err').removeClass('display-none');
        } else {
            localStorage.setItem('name', name);
            $('#userNameModal').modal('hide');
            $('#name-input').siblings('.invalid-err').addClass('display-none');
        }
    });


    $("#send").click(() => {
        sendMessage({
            name: localStorage.getItem('name'),
            message: $("#message").val()
        });
        $("#message").val('')
    })
    getMessages();

});
socket.on('message', addMessages)
function addMessages(message) {
    var template = ``;
    if (message.name === localStorage.getItem('name')) {
        template = ` <p class="my-message">${message.message}</p>`;
    } else {
        template = `<p>${message.name}: ${message.message}</p>`;
    }
    $("#messages").append(template);
    $(".chat-message").scrollTop($(".chat-message")[0].scrollHeight);
}

function getMessages() {
    $.get('http://my-chat-app00.herokuapp.com/messages', (data) => {
        data.forEach(addMessages);
    });
}

function sendMessage(message) {
    $.post('http://my-chat-app00.herokuapp.com/messages', message);
}
