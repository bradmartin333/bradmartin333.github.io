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
        window.history.back() // Doesn't seem to work on mobile
    } else {
        window.location.href = ['pages/', String(code), '.html'].join('');
    }
}

function autoTab(current,to) // Doesn't seem to work on mobile
{
    if (current.getAttribute && current.value.length==current.getAttribute("maxlength")) {
        to.focus() 
    }
}

function handlePaste(e) {
    var clipboardData, pastedData;
  
    // Stop data actually being pasted
    e.stopPropagation();
    e.preventDefault();
  
    // Get pasted data via clipboard API
    clipboardData = e.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    // Do whatever with pasteddata
    while (pastedData.length < 5) {
        pastedData += " ";
    }
    
    document.getElementsByName('first')[0].value = pastedData.charAt(0);
    document.getElementsByName('second')[0].value = pastedData.charAt(1);
    document.getElementsByName('third')[0].value = pastedData.charAt(2);
    document.getElementsByName('fourth')[0].value = pastedData.charAt(3);
    document.getElementsByName('fifth')[0].value = pastedData.charAt(4);
  }