function copyCode() {
    let code = document.getElementById('specialCode').innerHTML;
    navigator.clipboard.writeText(code); // Only works in secure contexts
}

function loadCode() {
    let path = window.location.pathname;
    let page = path.split("/").pop().split('.')[0];
    document.getElementById('specialCode').innerHTML = page;
}
