var sendOtp = document.getElementById('sendOtp');
var mobile_number = document.getElementById('mobile_number');
sendOtp.addEventListener('click', async (e) => {
    e.preventDefault();
    const options = {
        method: 'POST',
        url: 'https://textapis.p.rapidapi.com/text',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({"mobileNumber": mobile_number.value}),
    };
    var data = await fetch('http://localhost:8000/users/auth/mobile/sendotp', options);
    console.log(data);
});