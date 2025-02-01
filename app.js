// Initialize Tone.js synth with a more piano-like sound
const synth = new Tone.Sampler({
    urls: {
        C4: "https://tonejs.github.io/audio/salamander/C4.mp3",
        D4: "https://tonejs.github.io/audio/salamander/D4.mp3",
        E4: "https://tonejs.github.io/audio/salamander/E4.mp3",
        F4: "https://tonejs.github.io/audio/salamander/F4.mp3",
        G4: "https://tonejs.github.io/audio/salamander/G4.mp3",
        A4: "https://tonejs.github.io/audio/salamander/A4.mp3",
        B4: "https://tonejs.github.io/audio/salamander/B4.mp3",
    },
    release: 1,
}).toDestination();

// Create a single large touch plane for the entire piano
const pianoKeysEntity = document.querySelector('#pianoKeys');
const touchPlane = document.createElement('a-plane');
touchPlane.setAttribute('width', '1');
touchPlane.setAttribute('height', '0.3');
touchPlane.setAttribute('position', '0 0 0');
touchPlane.setAttribute('material', 'opacity: 0.0; transparent: true');

// Add touch interaction to the plane
touchPlane.addEventListener('mousedown', handleTouch);
touchPlane.addEventListener('touchstart', handleTouch);
pianoKeysEntity.appendChild(touchPlane);

// Key positions and widths
const keyWidth = 1/7; // Since we have 7 keys
const keyPositions = [
    { note: 'C4', start: -0.5, end: -0.5 + keyWidth },
    { note: 'D4', start: -0.5 + keyWidth, end: -0.5 + 2 * keyWidth },
    { note: 'E4', start: -0.5 + 2 * keyWidth, end: -0.5 + 3 * keyWidth },
    { note: 'F4', start: -0.5 + 3 * keyWidth, end: -0.5 + 4 * keyWidth },
    { note: 'G4', start: -0.5 + 4 * keyWidth, end: -0.5 + 5 * keyWidth },
    { note: 'A4', start: -0.5 + 5 * keyWidth, end: -0.5 + 6 * keyWidth },
    { note: 'B4', start: -0.5 + 6 * keyWidth, end: -0.5 + 7 * keyWidth },
];

// Create visual key overlays (semi-transparent)
keyPositions.forEach(key => {
    const keyOverlay = document.createElement('a-plane');
    keyOverlay.setAttribute('width', keyWidth);
    keyOverlay.setAttribute('height', '0.3');
    keyOverlay.setAttribute('position', `${(key.start + key.end) / 2} 0 0.001`);
    keyOverlay.setAttribute('material', 'color: #2196F3; opacity: 0.2; transparent: true');
    keyOverlay.setAttribute('data-note', key.note);
    pianoKeysEntity.appendChild(keyOverlay);
});

// Handle touch/click events
function handleTouch(event) {
    event.preventDefault();
    
    // Start audio context if needed
    if (Tone.context.state !== 'running') {
        Tone.start();
    }
    
    // Get touch position relative to the piano plane
    const touch = event.detail.intersection;
    if (!touch) return;
    
    const x = touch.point.x;
    
    // Find which key was pressed
    const keyPressed = keyPositions.find(key => x >= key.start && x < key.end);
    if (keyPressed) {
        playNote(keyPressed.note);
        
        // Visual feedback
        const keyOverlay = pianoKeysEntity.querySelector(`[data-note="${keyPressed.note}"]`);
        if (keyOverlay) {
            keyOverlay.setAttribute('material', 'opacity: 0.4');
            setTimeout(() => {
                keyOverlay.setAttribute('material', 'opacity: 0.2');
            }, 200);
        }
    }
}

// Function to play a note
function playNote(note) {
    synth.triggerAttackRelease(note, '2n');
}

// Handle AR.js events
document.addEventListener('arjs-nft-loaded', () => {
    const loadingMessage = document.querySelector('#loadingMessage');
    const instructions = document.querySelector('#instructions');
    loadingMessage.style.display = 'none';
    instructions.style.display = 'block';
    
    // Hide instructions after 5 seconds
    setTimeout(() => {
        instructions.style.display = 'none';
    }, 5000);
});

// Error handling
window.addEventListener('camera-error', () => {
    const loadingMessage = document.querySelector('#loadingMessage');
    loadingMessage.innerHTML = 'Camera error. Please ensure you have given camera permissions and are using a compatible device/browser.';
}); 