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
            code += inp[i].value.toUpperCase();
        }
    }
    if (code == "") {
        window.history.back()
    } else {
        window.location.href = ['pages/', String(code), '.html'].join('');
    }
}

function autoTab(current,to)
{
    if (current.getAttribute && current.value.length==current.getAttribute("maxlength")) {
        to.focus() 
    }
}