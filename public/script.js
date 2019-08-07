(function() {


    let submitFormScript = function() {

        function pressEnter(e) {
            if (e.keyCode === 13 || e.keyCode === 13) {
                sendInfo();
            }
        }

        let sendInfo = function() {

            function onLoad() {
                let response = this.responseText;

                let parsedResponse =  '';

                try{
                    parsedResponse = JSON.parse(response);
                }catch (e) {
                    console.log(e.message);
                }

                if (parsedResponse.responseCode === 0){
                    document.getElementById('success__msg').classList.toggle('hidden__element');
                    document.getElementById('input__fields').classList.toggle('hidden__element');
                }else {
                    document.getElementById('error__msg').classList.toggle('hidden__element');
                    document.getElementById('input__fields').classList.toggle('hidden__element');
                }
            }

            function onError() {
                // handle error here, print message perhaps
                console.log('error receiving async AJAX call');
            }

            let clientName = document.getElementById('name').value;
            let clientPhone = document.getElementById('phone').value;
            let clientComment = document.getElementById('comments').value;
            let token = document.getElementById('g-recaptcha-response').value;

            if(clientName && clientPhone){
                event.preventDefault();

                let data = {
                    secret: token,
                    name: clientName,
                    phone: clientPhone,
                    comment: clientComment
                };
                console.log('data sent');

                const xhr = new XMLHttpRequest();

                xhr.open('POST', '/index.html', true);
                xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                xhr.addEventListener('load', onLoad);
                xhr.addEventListener('error', onError);
                let jData = JSON.stringify(data);

                try {
                    xhr.send(jData);
                }catch (e) {
                    console.log(e.message);
                }

                document.getElementById('submit-btn').disabled = true; //отключаем кнопку
                document.getElementById('submit-form').removeEventListener('keypress', pressEnter);//отключаем enter
            }
            else{
                console.log('введите имя и телефон');
            }

        };
        document.getElementById('submit-form').addEventListener('keypress', pressEnter);
        document.getElementById('submit-btn').addEventListener('click', sendInfo);
    };

    document.getElementById('header--btn').addEventListener('click', submitFormScript);
    document.getElementById('try--btn').addEventListener('click', submitFormScript);
    document.getElementById('nav--btn').addEventListener('click', submitFormScript);


})();