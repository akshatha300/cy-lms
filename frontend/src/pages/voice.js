// Voice Tutor Logic
let recognition;
let isListening = false;

// Debug function
function debugLog(message) {
    console.log('[Voice Tutor Debug]:', message);
    // Also show on page for debugging
    const debugDiv = document.getElementById('debug');
    if (debugDiv) {
        debugDiv.innerHTML += '<br>' + message;
    }
}

// Check if browser supports speech recognition
debugLog('Checking browser support...');
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    debugLog('Speech recognition supported!');
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    
    recognition.onstart = function() {
        debugLog('Voice recognition started');
        isListening = true;
        updateButtonState();
    };
    
    recognition.onresult = function(event) {
        debugLog('Speech result received');
        const transcript = event.results[0][0].transcript;
        debugLog('User said: ' + transcript);
        
        // Display the question
        document.getElementById('question').textContent = transcript;
        
        // Get AI response
        getAIResponse(transcript);
    };
    
    recognition.onerror = function(event) {
        debugLog('Speech recognition error: ' + event.error);
        isListening = false;
        updateButtonState();
        
        // Show error message
        document.getElementById('answer').textContent = 'Error: ' + event.error;
    };
    
    recognition.onend = function() {
        debugLog('Voice recognition ended');
        isListening = false;
        updateButtonState();
    };
} else {
    debugLog('Speech recognition NOT supported');
    console.error('Speech recognition not supported');
    document.getElementById('answer').textContent = 'Speech recognition is not supported in your browser. Please try Chrome or Edge.';
}

function startListening() {
    debugLog('Start listening called, isListening: ' + isListening);
    
    if (isListening) {
        debugLog('Stopping recognition...');
        recognition.stop();
        return;
    }
    
    if (recognition) {
        debugLog('Starting recognition...');
        recognition.start();
    } else {
        debugLog('Recognition not available!');
        document.getElementById('answer').textContent = 'Error: Speech recognition not initialized';
    }
}

function updateButtonState() {
    const button = document.querySelector('button');
    if (isListening) {
        button.textContent = '🛑 Stop Listening';
        button.style.backgroundColor = '#ef4444';
        button.style.color = 'white';
    } else {
        button.textContent = '🎤 Ask Question';
        button.style.backgroundColor = '#3b82f6';
        button.style.color = 'white';
    }
}

async function getAIResponse(question) {
    try {
        debugLog('Getting AI response for: ' + question);
        document.getElementById('answer').textContent = 'Thinking...';
        
        // Check if token exists
        const token = localStorage.getItem('token');
        if (!token) {
            debugLog('No auth token found');
            throw new Error('Please login to use the voice tutor');
        }
        debugLog('Token found: ' + token.substring(0, 20) + '...');
        
        // Call your backend API
        debugLog('Making API call to /api/enhanced-chat');
        const response = await fetch('/api/enhanced-chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify({
                message: question,
                context: 'voice_tutor'
            })
        });
        
        debugLog('API response status: ' + response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            debugLog('API error response: ' + errorText);
            throw new Error('Failed to get response: ' + response.status);
        }
        
        const data = await response.json();
        debugLog('API response data: ' + JSON.stringify(data));
        
        // Display AI response
        const aiResponse = data.response || data.message || 'No response received';
        document.getElementById('answer').textContent = aiResponse;
        debugLog('AI response displayed: ' + aiResponse);
        
        // Optional: Speak the response
        speakResponse(aiResponse);
        
    } catch (error) {
        debugLog('Error getting AI response: ' + error.message);
        console.error('Error getting AI response:', error);
        document.getElementById('answer').textContent = 'Error: ' + error.message;
    }
}

function speakResponse(text) {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        speechSynthesis.speak(utterance);
    } else {
        console.log('Speech synthesis not supported');
    }
}

// Initialize button state
updateButtonState();
debugLog('Voice tutor initialized successfully!');
