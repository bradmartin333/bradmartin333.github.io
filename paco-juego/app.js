function loadCode() {
    let path = window.location.pathname;
    let page = path.split("/").pop().split('.')[0];
    document.getElementById('specialCode').innerHTML = page;
}

function checkCode() {
    let inp = document.getElementsByTagName('input');
    let code = '';
    for (let i in inp) {
        if (inp[i].type == 'text') {
            code += inp[i].value;
        }
    }
    if (code == "") {
        window.location.href = 'index.html';
    } else {
        window.location.href = ['/pages/', String(code), '.html'].join('');
    }
}