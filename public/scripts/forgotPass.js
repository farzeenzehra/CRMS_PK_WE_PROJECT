$('document').ready(function () {

    $('#forgotPassBtn').on('click', '.forgotPassLink', function () {

        if ($('#username').val() != "" && $('#username').val() != null) {
            document.getElementById('userNF').innerHTML =
                `<div id="errorAlert" class="alert alert-info d-flex justify-content-between py-2" role="alert">
            <span id="msg">Sending Email....</span>
            <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
            </div>`
            $.ajax({
                url: '/forgotPassword',
                type: 'POST',
                dataType: 'json',
                xhrFields: {
                    withCredentials: true
                },
                data: { "username": $('#username').val() },
                success: function (data) {
                    if (data == true) {
                        $('#errorAlert').remove();
                        $('#forgotPassModal').modal('show');
                    }
                    else {
                        document.getElementById('userNF').innerHTML =
                            `<div id="errorAlert" class="alert alert-danger d-flex justify-content-between py-2" role="alert">
                                <span id="msg">User Not Found</span>
                                <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
                            </div>`
                    }
                },
                error: function (xhr, status, error) {
                    document.getElementById('userNF').innerHTML =
                        `<div id="errorAlert" class="alert alert-danger d-flex justify-content-between py-2" role="alert">
                            <span id="msg">Email Could Not Be Sent</span>
                            <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
                        </div>`
                },
            });
        }
        else {
            document.getElementById('userNF').innerHTML =
                `<div id="errorAlert" class="alert alert-danger d-flex justify-content-between py-2" role="alert">
                                <span id="msg">Please Enter Username First</span>
                                <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
                            </div>`
        }
    });
    document.getElementById('forgotPassModal').onshow=function () {
        document.getElementById('changePasswordForm').reset();
        document.getElementById('npValMsg').innerHTML = '';
        document.getElementById('cnpValMsg').innerHTML = '';
        document.getElementById('codeValMsg').innerHTML = '';
        $('#notifAlert').removeClass('alert-info');
        $('#notifAlert').addClass('alert-success');
        document.getElementById('notifAlert').innerText = "A code has been sent to your email! Hurry Up! You have 10 minutes."
    }
    function validateForm() {
        let newPass = $('#newPass').val();
        let CnewPass = $('#CnewPass').val();
        let code = $('#code').val();
        if (/^([0-9]{6,6})$/.test(code) == false) {
            $('#codeValMsg').removeClass('text-success');
            $('#codeValMsg').addClass('text-danger');
            document.getElementById('codeValMsg').innerHTML = '<i class="fas fa-times-circle"></i> <span>Code must be 6 digits long!!</span>'
        }
        else {
            $('#codeValMsg').removeClass('text-danger');
            $('#codeValMsg').addClass('text-success');
            document.getElementById('codeValMsg').innerHTML = '<i class="fas fa-check-circle"></i> <span>You are good to go!!</span>'
        }
        if (/^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,})$/.test(newPass) == false) {
            $('#npValMsg').removeClass('text-success');
            $('#npValMsg').addClass('text-danger');
            document.getElementById('npValMsg').innerHTML = '<i class="fas fa-times-circle"></i> <span>Password must have one capital letter, one small letter, one special character [@,#,$,&,*,!], and one digit!!</span>'
        }
        else {
            $('#npValMsg').removeClass('text-danger');
            $('#npValMsg').addClass('text-success');
            document.getElementById('npValMsg').innerHTML = '<i class="fas fa-check-circle"></i> <span>You are good to go!!</span>'
        }
        if (newPass != CnewPass || !/^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,})$/.test(newPass)) {
            $('#cnpValMsg').addClass('text-success');
            $('#cnpValMsg').addClass('text-danger');
            document.getElementById('cnpValMsg').innerHTML = '<i class="far fa-times-circle"></i> <span>Passwords do not match!!</span>'
        }
        else {
            $('#cnpValMsg').removeClass('text-danger');
            $('#cnpValMsg').addClass('text-success');
            document.getElementById('cnpValMsg').innerHTML = '<i class="fas fa-check-circle"></i> <span>You are good to go!!</span>'
        }
        if (newPass == CnewPass && /^((?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{5,})$/.test(newPass) && /^([0-9]{6,6})$/.test(code)) {
            $('#changePassword').removeAttr('disabled');
        }
         else
        {
            $('#changePassword').attr('disabled',true);
        }
    }
    $('#changePasswordForm').on('change keypress textInput input', validateForm);
    $('#changePassword').on('click', function () {
        $('#notifAlert').removeClass('alert-success');
        $('#notifAlert').addClass('alert-info');
        document.getElementById('notifAlert').innerText = "Wait.....";
        $.ajax({
            url: '/changePassword',
            type: 'POST',
            dataType: 'json',
            xhrFields: {
                withCredentials: true
            },
            data: {
                "username": $('#username').val(),
                "code": $('#code').val(),
                "newPass": $('#newPass').val(),
                "CnewPass": $('#CnewPass').val()
            },
            success: function (data) {
                $('#forgotPassModal').modal('hide');
                document.getElementById('userNF').innerHTML =
                    `<div id="errorAlert" class="alert alert-danger d-flex justify-content-between py-2" role="alert">
                                <span id="msg">${data}</span>
                                <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
                            </div>`

                if (data == "Password has been changed!") {
                    $('#errorAlert').addClass('alert-success');
                    $('#errorAlert').removeClass('alert-danger');
                }

            },
            error: function (xhr, status, error) {
                $('#forgotPassModal').modal('hide');
                document.getElementById('userNF').innerHTML =
                    `<div id="errorAlert" class="alert alert-danger d-flex justify-content-between py-2" role="alert">
                            <span id="msg">Couldn't Change Password</span>
                            <span class="fa fa-times" style="line-height: inherit;cursor: pointer;" onclick="$('#errorAlert').remove();"></span>
                        </div>`
            },
            complete: function () {
                document.getElementById('changePasswordForm').reset();
                document.getElementById('npValMsg').innerHTML = '';
                document.getElementById('cnpValMsg').innerHTML = '';
                document.getElementById('codeValMsg').innerHTML = '';
                $('#notifAlert').removeClass('alert-info');
                $('#notifAlert').addClass('alert-success');
                document.getElementById('notifAlert').innerText = "A code has been sent to your email! Hurry Up! You have 10 minutes."
            }
        });

    });
});
