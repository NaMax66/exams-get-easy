{
    let responseCode = 1;

    const submitFormScript = function () {
        let isPhoneValid = false;
        let isNameValid = false;
        let isTextAreaValid = true;

        let formResponse = '';

        const sendInfo = function () {
            //проверяем валидность
            if (!isNameValid || !isPhoneValid || !isTextAreaValid) {
                alert('Имя должно содержать минимум 2 символа. \nТелефон минимум 10 цифр. \nКомментарий не длиннее 1000 символов.');
                event.preventDefault();
                return;
            }

            document.getElementById("submit-btn").disabled = true; //отключаем кнопку

            function onLoad() {
                formResponse = JSON.parse(this.responseText);

                //todo add animation
                if (formResponse.message === 'ok') {
                    document.getElementById("success__msg").classList.toggle("hidden__element");
                    document.getElementById("input__fields").classList.toggle("hidden__element");
                } else {
                    document.getElementById("error__msg").classList.toggle("hidden__element");
                    document.getElementById("input__fields").classList.toggle("hidden__element");
                    console.log(formResponse.message);
                }

            }

            function onError() {
                // handle error here, print message perhaps
                console.log("error receiving async AJAX call");
            }


            let clientName = document.getElementById("name").value;
            let clientPhone = document.getElementById("phone").value;
            let clientComment = document.getElementById("comments").value;


            if (clientName && clientPhone) {
                event.preventDefault();

                let data = {
                    responseCode: responseCode,
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

                xhr.send(JSON.stringify(data));

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

            //count only numbers. regexp /\d/
            let numberAmount = phoneInput.value.toString().match(/\d/g).length;

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

    //if scroll - hide menu
    const navbarBtn = document.querySelector('.navbar-toggler');

    window.addEventListener('scroll', () => {
        //choose menu btn
        const ariaExpanded = navbarBtn.attributes.getNamedItem('aria-expanded');
        if (!ariaExpanded)
            return;

        if (ariaExpanded.value !== "false") {
            ariaExpanded.value = "false";
            navbarBtn.click();
        }

    });

    const xhrToken = new XMLHttpRequest();
    xhrToken.open('POST', '/checkToken', true);
    xhrToken.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhrToken.addEventListener("load", res => {
        const responseObject = JSON.parse(res.currentTarget.responseText);
        responseCode = responseObject.responseCode;
    });
    xhrToken.addEventListener("error", err => {
        console.log(err);
    });

    new Promise((resolve) => {

        let i = setInterval(() => {
            let token = document.getElementById("g-recaptcha-response").value;
            if (token) {
                resolve(token);
                clearInterval(i);
            }
        }, 200)

    }).then((token) => {
        xhrToken.send(JSON.stringify({secret: token}));
    }).catch(err => console.log(err));

}
