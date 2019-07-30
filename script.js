(function() {
    "use strict";

    let submitFormScript = function() {
        let sendInfo = function() {
            console.log('отправляем инфо...');

        }
        document.getElementById('submit-form').addEventListener('keypress', function(e) {
            if (e.keyCode === 13 || e.keyCode === 13) {
                sendInfo();
            }
        });
        document.getElementById('submit-btn').addEventListener('click', sendInfo);
    }

    document.getElementById('header--btn').addEventListener('click', submitFormScript);



}())