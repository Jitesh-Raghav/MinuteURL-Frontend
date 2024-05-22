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
        fetch('http://localhost:8080/generate', {
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
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    } else {
        alert('Please enter a URL.');
    }
});



function displayShortenedUrl(shortLink) {
    const shortUrlContainer = document.getElementById('shortUrlContainer');
    shortUrlContainer.style.display = 'flex'; // Show the container
    shortUrlContainer.innerHTML = `
        <p>Shortened URL <br/> Click to visit site: <a href="http://localhost:8080/${shortLink}" target="_blank">http://localhost:8080/${shortLink}</a></p>
        <button id="copyButton">Copy</button>
        <button id="qrCodeButton">QR</button>
    `;

    document.getElementById('copyButton').addEventListener('click', function() {
        copyToClipboard(`http://localhost:8080/${shortLink}`);
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


// Rest of your JavaScript code...




