localStorage.setItem("user_id", user_id);

var logout = document.getElementById('logout');
logout.addEventListener('click', async function() {
    var user_id = localStorage.getItem('user_id');
    localStorage.removeItem(user_id);
    var data = await fetch(`http://localhost:8000/users/auth/logout/${user_id}`);
});