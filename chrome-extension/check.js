
fetch('http://localhost:5000/test', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
})
    .then(response => {
        if (response.status === 200) {
            return response.json();
        }
    })
    .then(data => {
        if (data['status']) {
            document.querySelector(".workingicon").src = "reception-4.svg";
            console.log(data)
            console.log(data)
            console.log(data)
        }

    })
    .catch(error => {
        console.error('An error occurred:', error);
    });