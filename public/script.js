{
    let submitFormScript = function () {
        let isPhoneValid = false;
        let isNameValid = false;
        let isTextAreaValid = true;


        let sendInfo = function () {
            //проверяем валидность
            if (!isNameValid || !isPhoneValid || !isTextAreaValid) {
                alert('Имя должно содержать минимум 2 символа. \nТелефон минимум 10 цифр. \nКомментарий не длиннее 1000 символов.');
                event.preventDefault();
                return;
            }

            document.getElementById("submit-btn").disabled = true; //отключаем кнопку

            function onLoad() {
                let response = this.responseText;

                let parsedResponse = "";

                try {
                    parsedResponse = JSON.parse(response);
                } catch (e) {
                    console.log(e.message);
                }

                if (parsedResponse.responseCode === 0) {
                    document.getElementById("success__msg").classList.toggle("hidden__element");
                    document.getElementById("input__fields").classList.toggle("hidden__element");
                } else {
                    document.getElementById("error__msg").classList.toggle("hidden__element");
                    document.getElementById("input__fields").classList.toggle("hidden__element");
                }
            }

            function onError() {
                // handle error here, print message perhaps
                console.log("error receiving async AJAX call");
            }


            let clientName = document.getElementById("name").value;
            let clientPhone = document.getElementById("phone").value;
            let clientComment = document.getElementById("comments").value;
            let token = document.getElementById("g-recaptcha-response").value;

            if (clientName && clientPhone) {
                event.preventDefault();

                let data = {
                    secret: token,
                    name: clientName,
                    phone: clientPhone,
                    comment: clientComment
                };

                const xhr = new XMLHttpRequest();

                xhr.open("POST", "/userData", true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.addEventListener("load", onLoad);
                xhr.addEventListener("error", onError);

                //add bootstrap spinner
                const submitBtn = document.getElementById("submit-btn");
                submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>\n' +
                    '  Loading...';

                setTimeout(function () {
                    try {
                        xhr.send(JSON.stringify(data));
                    } catch (e) {
                        console.log(e.message);
                    }
                }, 1500);



            } else {
                //if form not valid - try again
                document.getElementById("submit-btn").disabled = false;
            }
        };
        document.getElementById("submit-btn").addEventListener("click", sendInfo);

        //Form validation. Name >= 2 chars. Phone >= 10 numbers. Comments <= 1000 chars
        const nameInput = document.getElementById("name");
        const phoneInput = document.getElementById("phone");
        const commentInput = document.getElementById("comments");
        nameInput.addEventListener("input", () => {

            //if field is empty just keep it without colour

            if (nameInput.value.length >= 2) {
                nameInput.classList.add("is-valid");
                nameInput.classList.remove("is-invalid");
                isNameValid = true;
            } else {
                nameInput.classList.add("is-invalid");
                nameInput.classList.remove("is-valid");
                isNameValid = false;
            }

        });
        phoneInput.addEventListener("input", () => {

            let numberAmount = phoneInput.value.replace(/[^0-9]/g,"").length;

            if (numberAmount >= 10) {
                phoneInput.classList.add("is-valid");
                phoneInput.classList.remove("is-invalid");
                isPhoneValid = true;

            } else {
                phoneInput.classList.add("is-invalid");
                phoneInput.classList.remove("is-valid");
                isPhoneValid = false;
            }
        });
        commentInput.addEventListener("input", () => {
            if (commentInput.value.length <= 1000) {
                commentInput.classList.add("is-valid");
                commentInput.classList.remove("is-invalid");
                isTextAreaValid = true;
            } else {
                commentInput.classList.add("is-invalid");
                commentInput.classList.remove("is-valid");
                isTextAreaValid = false;
            }
        })

    };
    document.getElementById("header--btn").addEventListener("click", submitFormScript);
    document.getElementById("try--btn").addEventListener("click", submitFormScript);
    document.getElementById("nav--btn").addEventListener("click", submitFormScript);

}
