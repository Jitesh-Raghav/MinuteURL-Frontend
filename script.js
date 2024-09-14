// document.getElementById('urlForm').addEventListener('submit', function(event) {
//     event.preventDefault(); // Prevent the default form submission

//     const urlInput = document.getElementById('urlInput').value;

//     if (urlInput) {
//         console.log('URL:', urlInput); // Log the URL to the console
//         // Here, you can also send the URL to the backend if needed
//     } else {
//         alert('Please enter your miserable URL');
//     }
// });

document.getElementById('urlForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const urlInput = document.getElementById('urlInput').value;

    if (urlInput) {
        fetch('https://minuteurl-backend-production.up.railway.app/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: urlInput }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Shortened URL:', data); // Log the shortened URL
            // alert('Shortened URL: ' + data); // Display the shortened URL
            displayShortenedUrl(data.shortLink);
            hideErrorMessage(); // Hide error message if present
        })
        .catch((error) => {
            console.error('Error:', error);
            showErrorMessage(); // Show error message on error
        });
    } else {
        alert('Please enter a URL.');
    }
});

// Function to fetch all shortened URLs from the backend
function fetchPastUrls() {
    fetch('https://minuteurl-backend-production.up.railway.app/getall')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(urls => {
            const pastUrlsContainer = document.getElementById('pastUrlsContainer');
            pastUrlsContainer.innerHTML = ''; // Clear the container

            // Create table element
            const table = document.createElement('table');
            table.classList.add('url-table');

            // Create table header row
            const headerRow = document.createElement('tr');
            const headers = [ 'Created At', 'Expiration Date', 'Original Link', 'Short Link'];
            headers.forEach(headerText => {
                const th = document.createElement('th');
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            table.appendChild(headerRow);

            // Create table rows for each URL
            urls.forEach(url => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${url.creationDate}</td>
                    <td>${url.expirationDate}</td>
                    <td><a href="${url.originalUrl}" target="_blank">${url.originalUrl}</a></td>
                    <td><a href="https://minuteurl-backend-production.up.railway.app/${url.shortLink}" target="_blank">${url.shortLink}</a></td>
                `;
                table.appendChild(row);
            });

            // Append the table to the container
            pastUrlsContainer.appendChild(table);
        })
        .catch(error => {
            console.error('Error fetching past URLs:', error);
            showErrorMessage(); // Show an error message
        });
}


// Call the fetchPastUrls function when the page loads
document.addEventListener('DOMContentLoaded', fetchPastUrls);


function showErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000); // Hide after 3 seconds
}

function hideErrorMessage() {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.style.display = 'none';
}

function displayShortenedUrl(shortLink) {
    const shortUrlContainer = document.getElementById('shortUrlContainer');
    shortUrlContainer.style.display = 'flex'; // Show the container
    shortUrlContainer.innerHTML = `
        <p><span>Shortened URL <span/><br/> Click to visit site: <a href="https://minuteurl-backend-production.up.railway.app/${shortLink}" target="_blank">minute-url./${shortLink}</a></p>
        <button id="copyButton">Copy</button>
        <button id="qrCodeButton">QR</button>
    `;

    document.getElementById('copyButton').addEventListener('click', function() {
        copyToClipboard(`https://minuteurl-backend-production.up.railway.app/${shortLink}`);
    });

    document.getElementById('qrCodeButton').addEventListener('click', function() {
        event.stopPropagation();
        const url = document.getElementById('urlInput').value;
        if (url) {
            generateQRCode(url);
        } else {
            alert('Please enter a URL.');
        }
    });

    setTimeout(() => {
        shortUrlContainer.classList.add('show');
    }, 10); // Slight delay to ensure the initial styles are applied
    
}



function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const copyMessage = document.getElementById('copyMessage');
        copyMessage.style.display = 'inline';
        setTimeout(() => {
            copyMessage.style.display = 'none';
        }, 2300);
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
}



function generateQRCode(url) {

    // Remove any existing QR code container
    const existingQrCodeContainer = document.getElementById('qrCodeContainer');
    if (existingQrCodeContainer) {
        existingQrCodeContainer.remove();
    }
    const qrCodeContainer = document.createElement('div');
    qrCodeContainer.id = 'qrCodeContainer';
    qrCodeContainer.style.position = 'fixed';
    qrCodeContainer.style.top = '50%';
    qrCodeContainer.style.left = '50%';
    qrCodeContainer.style.transform = 'translate(-50%, -50%)';
    qrCodeContainer.style.backgroundColor = 'rgba(92, 160, 255, 0.338)';
    qrCodeContainer.style.padding = '50px';
    qrCodeContainer.style.border = '1px solid rgba(0, 94, 255, 0.568)';
    qrCodeContainer.style.zIndex = '9999';
    qrCodeContainer.style.borderRadius = '20px';


    document.body.appendChild(qrCodeContainer);
    
    //   // Insert the QR code container between the short URL container and the form
    //   const shortUrlContainer = document.getElementById('shortUrlContainer');
    //   const formContainer = document.getElementById('urlForm');
    //   shortUrlContainer.parentNode.insertBefore(qrCodeContainer, formContainer.nextSibling);

  const qrCode= new QRCode(qrCodeContainer, {
        text: url,
        width: 280,
        height: 280,
    });

     // Add event listener to remove the QR code container on click outside
     document.addEventListener('click', function removeQrCode(event) {
        if (!qrCodeContainer.contains(event.target)) {
            qrCodeContainer.remove();
            document.removeEventListener('click', removeQrCode);
        }
    });
}

// // Fetch past URLs on page load
// document.addEventListener('DOMContentLoaded', fetchPastUrls);

// Rest of your JavaScript code...




