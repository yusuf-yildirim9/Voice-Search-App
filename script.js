// DOM Elements
const noteInput = document.getElementById('noteInput');
const micBtn = document.getElementById('micBtn');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');

// Web Speech API Support Check
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!window.SpeechRecognition) {
    alert("Your browser does not support the Web Speech API. Please use Google Chrome or Microsoft Edge.");
    micBtn.style.display = 'none';
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Set to English 
    recognition.interimResults = true; // Show words on the screen in real-time as you speak
    recognition.continuous = true; // Keep listening until stopped

    let isListening = false;

    // When the Microphone Button is Clicked
    micBtn.addEventListener('click', () => {
        if (!isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }
    });

    // When speech recognition starts
    recognition.onstart = () => {
        isListening = true;
        micBtn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> <span>Listening...</span>`;
        micBtn.style.backgroundColor = '#ef4444';
        micBtn.style.boxShadow = '0 0 15px rgba(239, 68, 68, 0.6)';
    };

    // When speech is translated to text
    recognition.onresult = (event) => {
        let transcript = '';
        
        for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        
        noteInput.value = transcript; 
    };

    // On error
    recognition.onerror = (event) => {
        console.error("Speech recognition error: ", event.error);
        stopRecognitionUI();
    };

    // When recording ends
    recognition.onend = () => {
        isListening = false;
        stopRecognitionUI();
    };

    function stopRecognitionUI() {
        micBtn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> <span>Listen</span>`;
        micBtn.style.backgroundColor = '';
        micBtn.style.boxShadow = 'none';
    }
}

// Copy Button Functionality
copyBtn.addEventListener('click', () => {
    if (!noteInput.value.trim()) {
        alert("There is no text to copy!");
        return;
    }
    
    navigator.clipboard.writeText(noteInput.value)
        .then(() => {
            const originalText = copyBtn.innerHTML;
            copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> <span>Copied</span>`;
            setTimeout(() => {
                copyBtn.innerHTML = originalText;
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
        });
});

//  Download Button Functionality (Save as .txt)
downloadBtn.addEventListener('click', () => {
    const text = noteInput.value.trim();
    if (!text) {
        alert("There is no note to download!");
        return;
    }

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `voice-note-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

//  Clear Button Functionality
clearBtn.addEventListener('click', () => {
    if (confirm("Are you sure you want to clear the note?")) {
        noteInput.value = '';
    }
});