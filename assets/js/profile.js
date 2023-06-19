// var user_id = document.getElementById('user_id').innerHTML;
// console.log(user_id);
var url = window.location.href;
var index = url.indexOf("profile/");
const user_id = url.substring(index+8, url.length);
console.log(user_id);
localStorage.setItem("user_id", user_id);

var logout = document.getElementById('logout');
logout.addEventListener('click', async function() {
    var user_id = localStorage.getItem('user_id');
    localStorage.removeItem(user_id);
    var data = await fetch(`http://localhost:8000/users/auth/logout/${user_id}`);
});

var mobile_verify = document.getElementById('mobile_verify');
mobile_verify.addEventListener('click', function(e) {
    window.location.href = `http://localhost:8000/users/auth/mobile-verify/${user_id}`
})