async function sendDataToServer() {
    const url = 'http://localhost:5000/api'; // Update with your API URL

    // Load data from chrome.storage.local
    chrome.storage.local.get("listingData", function (result) {
        console.log(result)
        console.log(result)
        console.log(result)
        const data = result.listingData;
        console.log(data);
        if (data) { // Check if data is not undefined
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.status === 200) {
                        return response.json();
                    }
                })
                .then(data => {
                    if (data['status']) {
                        console.log(data)
                        console.log(data)
                        console.log(data)
                        document.querySelectorAll('[data-testid="button"]')[1].click()
                        document.querySelector("#mrp").focus()
                        document.querySelector("#mrp").focus()
                        function sendExtractedData() {
                            // Delay for 1 second
                            setTimeout(() => {
                                const extractedData = document.querySelector("#mrp").parentElement.parentElement.parentElement.parentElement.outerText;
                                // Fetch the data after 1 second
                                fetch('http://localhost:5000/price', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ data: extractedData }),
                                })
                                    .then(response => {
                                        if (response.status === 200) {
                                            return response.json();
                                        }
                                    })
                                    .then(data => {
                                        if (data['status']) {
                                            console.log(data)
                                            console.log(data)
                                            console.log(data)
                                            document.querySelectorAll('[data-testid="button"]')[1].click()
                                        }
                                    })
                                    .catch(error => {
                                        console.error('An error occurred:', error);
                                    });
                            }, 1000); // 1000 milliseconds (1 second)
                        }

                        sendExtractedData();

                    }


                })
                .catch(error => {
                    console.error(error);
                });
        }
    });
}

document.addEventListener('keydown', async function (event) {
    if (event.key === 'ArrowDown' || event.code === 'ArrowDown') {
        document.getElementById("sku_id").focus()
        try {
            await sendDataToServer();

        } catch (e) {
            console.log(e)
        }
    }
});


