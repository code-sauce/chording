// Global variables
let currentDay = 1;
let totalDays = 30;
let completedDays = [];
let lessonData = [];
let metronomeIsPlaying = false;
let tempo = 80;
let audioContext;
let metronomeInterval;
let fretboardSketch;
let p5Ready = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initLessonData();
    initCalendar();
    updateDayDisplay();
    
    // We'll initialize p5 after everything else is ready
    checkP5Loaded();
});

// Check if p5 and p5.sound are loaded
function checkP5Loaded() {
    if (typeof p5 !== 'undefined') {
        console.log("p5.js loaded successfully");
        setupP5Instances();
        setupEventListeners();
        
        // Load the lesson content after a short delay to ensure p5 is fully initialized
        setTimeout(() => {
            loadCurrentLesson();
        }, 500);
    } else {
        console.log("Waiting for p5.js to load...");
        setTimeout(checkP5Loaded, 100);
    }
}

// Set up p5 instances
function setupP5Instances() {
    try {
        // Initialize fretboard visualization only (no p5.sound)
        fretboardSketch = new p5(fretboardSketchFunction, 'fretboard-canvas');
        console.log("Fretboard sketch initialized");
        
        p5Ready = true;
    } catch (e) {
        console.error("Error setting up p5 instances:", e);
    }
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('prev-day').addEventListener('click', () => {
        if (currentDay > 1) {
            currentDay--;
            updateDayDisplay();
            loadCurrentLesson();
        }
    });

    document.getElementById('next-day').addEventListener('click', () => {
        if (currentDay < totalDays) {
            currentDay++;
            updateDayDisplay();
            loadCurrentLesson();
        }
    });

    document.getElementById('metronome-toggle').addEventListener('click', toggleMetronome);
    
    document.getElementById('tempo').addEventListener('input', (e) => {
        tempo = parseInt(e.target.value);
        document.getElementById('tempo-value').textContent = tempo;
        if (metronomeIsPlaying) {
            stopMetronome();
            startMetronome();
        }
    });
}

// Initialize lesson data with 30 days of content
function initLessonData() {
    lessonData = [
        // Week 1: Foundation - Understanding Minor Scales
        {
            title: "Introduction to Natural Minor Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The natural minor scale (also called Aeolian mode) has the formula: 1-2-b3-4-5-b6-b7. It differs from the major scale with its flatted 3rd, 6th, and 7th degrees.</p>
                <p><strong>Practice (10 min):</strong> Learn the A minor scale in open position (first 5 frets). Play it ascending and descending slowly with the metronome at 60 BPM.</p>
                <p>A minor: A-B-C-D-E-F-G-A</p>
                <p>Use the Fretboard Visualizer tool below to see the scale pattern.</p>
            `
        },
        {
            title: "Natural Minor Scale Patterns - Position 1",
            description: `
                <p><strong>Theory (5 min):</strong> The CAGED system lets us play scales in 5 different positions across the fretboard. Today we'll learn Position 1 (based on the E shape).</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor scale in Position 1 (starting at the 5th fret). Focus on finger placement and timing.</p>
                <p>Try to identify the root notes (A) within the pattern.</p>
            `
        },
        {
            title: "Minor Scale Applications",
            description: `
                <p><strong>Theory (5 min):</strong> Minor scales create a more melancholic, emotional sound compared to major scales. They're commonly used in rock, blues, and many other genres.</p>
                <p><strong>Practice (10 min):</strong> Play simple melodies using just the A minor scale. Experiment with different rhythms while staying within the scale.</p>
                <p>Try this pattern: A-C-E-D-C-B-A. Repeat it with different rhythms.</p>
            `
        },
        {
            title: "Minor Scale Positions - Position 2",
            description: `
                <p><strong>Theory (5 min):</strong> Today we'll learn Position 2 of the minor scale (based on the D shape in CAGED).</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor scale in Position 2. Start slow (60 BPM) and gradually increase speed.</p>
                <p>Practice transitioning between Position 1 and Position 2 for a fluid connection across the fretboard.</p>
            `
        },
        {
            title: "Minor Pentatonic Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The minor pentatonic removes the 2nd and 6th degrees from the natural minor, creating a 5-note scale that's widely used in many genres, especially blues and rock.</p>
                <p><strong>Practice (10 min):</strong> Learn the A minor pentatonic scale in Position 1. Compare how it feels compared to the full minor scale.</p>
                <p>A minor pentatonic: A-C-D-E-G-A</p>
            `
        },
        {
            title: "Connecting Scales and Arpeggios",
            description: `
                <p><strong>Theory (5 min):</strong> An arpeggio is playing the notes of a chord individually. The minor arpeggio uses the 1st, b3rd, and 5th degrees of the minor scale.</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor arpeggio (A-C-E) across the fretboard. Try playing it within your scale positions.</p>
                <p>Challenge: Create a simple melody that alternates between scale runs and arpeggio patterns.</p>
            `
        },
        {
            title: "Week 1 Review and Creative Practice",
            description: `
                <p><strong>Theory (5 min):</strong> Review the natural minor scale formula, positions learned, and the minor pentatonic scale.</p>
                <p><strong>Practice (10 min):</strong> Creative exploration - improvise freely in A minor, mixing scale positions, arpeggios, and rhythmic variations.</p>
                <p>Use the backing track feature to play over a simple A minor progression.</p>
            `
        },
        // Week 2: Harmonic & Melodic Minor Scales
        {
            title: "Introduction to Harmonic Minor Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The harmonic minor scale raises the 7th degree of the natural minor scale, creating a unique sound with an augmented 2nd interval.</p>
                <p><strong>Practice (10 min):</strong> Learn the A harmonic minor scale (A-B-C-D-E-F-G#-A) in Position 1. Notice the distinct tension created by the raised 7th.</p>
                <p>Practice slowly at first, paying attention to the larger stretch between the 6th and 7th degrees.</p>
            `
        },
        {
            title: "Harmonic Minor Applications",
            description: `
                <p><strong>Theory (5 min):</strong> The harmonic minor creates a more "exotic" sound often used in classical, metal, and flamenco music. The raised 7th creates a stronger pull to the root.</p>
                <p><strong>Practice (10 min):</strong> Play simple phrases highlighting the unique sound of the harmonic minor scale.</p>
                <p>Focus on the tension between F and G# (the augmented 2nd interval).</p>
            `
        },
        {
            title: "Introduction to Melodic Minor Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The melodic minor scale raises both the 6th and 7th degrees when ascending, but reverts to natural minor when descending.</p>
                <p><strong>Practice (10 min):</strong> Learn the A melodic minor scale: Ascending (A-B-C-D-E-F#-G#-A) and Descending (A-G-F-E-D-C-B-A).</p>
                <p>Practice the scale both ascending and descending in Position 1.</p>
            `
        },
        {
            title: "Minor Scale Positions - Position 3",
            description: `
                <p><strong>Theory (5 min):</strong> Today we'll learn Position 3 of the minor scale (based on the C shape in CAGED).</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor scale in Position 3. Then apply the harmonic and melodic minor alterations to this position.</p>
                <p>Focus on smooth transitions between positions 1, 2, and 3.</p>
            `
        },
        {
            title: "Minor Scale Arpeggios - Extended",
            description: `
                <p><strong>Theory (5 min):</strong> Adding the 7th to a minor arpeggio creates a minor 7th arpeggio (1-b3-5-b7). This is commonly used in jazz and more complex music.</p>
                <p><strong>Practice (10 min):</strong> Learn the Am7 arpeggio (A-C-E-G) in Position 1. Compare it to the minor pentatonic scale.</p>
                <p>Try creating phrases that combine the arpeggio with scale runs.</p>
            `
        },
        {
            title: "Minor Scales in Different Keys",
            description: `
                <p><strong>Theory (5 min):</strong> The minor scale patterns are movable - the same shapes can be used for any root note.</p>
                <p><strong>Practice (10 min):</strong> Practice the natural minor scale in E minor (Position 1) and D minor (Position 1).</p>
                <p>Challenge: Try to identify which minor key would suit a particular mood or musical style.</p>
            `
        },
        {
            title: "Week 2 Review and Creative Practice",
            description: `
                <p><strong>Theory (5 min):</strong> Review the differences between natural, harmonic, and melodic minor scales.</p>
                <p><strong>Practice (10 min):</strong> Create short musical phrases that demonstrate the unique character of each type of minor scale.</p>
                <p>Record a simple progression and practice improvising over it using all three minor scale types.</p>
            `
        },
        // Week 3: Relative Scales and Mode Relationships
        {
            title: "Relative Major and Minor Scales",
            description: `
                <p><strong>Theory (5 min):</strong> Each minor scale has a relative major scale that shares the same notes but starts and ends on a different degree. For A minor, the relative major is C major.</p>
                <p><strong>Practice (10 min):</strong> Practice playing A minor and C major scales back-to-back, noticing how they share the same notes with different starting points.</p>
                <p>Try playing a melody in A minor, then play the same pattern of intervals starting from C to hear how the mood changes.</p>
            `
        },
        {
            title: "Minor Scale Positions - Position 4",
            description: `
                <p><strong>Theory (5 min):</strong> Today we'll learn Position 4 of the minor scale (based on the A shape in CAGED).</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor scale in Position 4. Focus on connecting this position with the previous ones.</p>
                <p>Try playing a continuous scale run that flows through positions 1, 2, 3, and 4.</p>
            `
        },
        {
            title: "Understanding Chord-Scale Relationships",
            description: `
                <p><strong>Theory (5 min):</strong> Each chord in a progression relates to specific scales. Minor chords can be paired with the minor scale, minor pentatonic, or blues scale.</p>
                <p><strong>Practice (10 min):</strong> Practice playing different scale options over an Am chord. Notice how each scale creates a different mood.</p>
                <p>Try: A minor, A minor pentatonic, A blues, A dorian over an Am chord.</p>
            `
        },
        {
            title: "Minor Scale Positions - Position 5",
            description: `
                <p><strong>Theory (5 min):</strong> Today we'll learn Position 5 of the minor scale (based on the G shape in CAGED), completing the 5 positions.</p>
                <p><strong>Practice (10 min):</strong> Practice the A minor scale in Position 5. Then try to play through all 5 positions in sequence.</p>
                <p>Start slow and focus on smooth transitions between positions.</p>
            `
        },
        {
            title: "Minor Blues Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The blues scale adds a "blue note" (b5) to the minor pentatonic scale, creating a distinctive sound used in blues, rock, and jazz.</p>
                <p><strong>Practice (10 min):</strong> Learn the A blues scale (A-C-D-Eb-E-G-A) in Position 1.</p>
                <p>Practice bending the "blue note" (Eb) up to E for an expressive blues feel.</p>
            `
        },
        {
            title: "Dorian Mode - The Minor Alternative",
            description: `
                <p><strong>Theory (5 min):</strong> The Dorian mode is a minor-type scale with a raised 6th degree compared to the natural minor. It has a jazzier, less dark sound.</p>
                <p><strong>Practice (10 min):</strong> Learn the A Dorian scale (A-B-C-D-E-F#-G-A). Compare it to A minor.</p>
                <p>The raised 6th (F#) gives Dorian its distinctive sound. Practice phrases that highlight this note.</p>
            `
        },
        {
            title: "Week 3 Review and Creative Practice",
            description: `
                <p><strong>Theory (5 min):</strong> Review all five positions of the minor scale and the relationships between scales (natural minor, harmonic minor, melodic minor, pentatonic, blues, Dorian).</p>
                <p><strong>Practice (10 min):</strong> Improvise using all the scale types we've learned, focusing on creating different moods and atmospheres.</p>
                <p>Record yourself to analyze your playing and identify areas for improvement.</p>
            `
        },
        // Week 4: Advanced Applications and Composition
        {
            title: "Minor Arpeggio Patterns Across the Neck",
            description: `
                <p><strong>Theory (5 min):</strong> Arpeggios can be played across the neck using patterns similar to scale positions.</p>
                <p><strong>Practice (10 min):</strong> Practice Am arpeggios in all five positions across the fretboard.</p>
                <p>Challenge: Create phrases that use arpeggios as their foundation, adding scale notes as embellishments.</p>
            `
        },
        {
            title: "Horizontal Scale Playing",
            description: `
                <p><strong>Theory (5 min):</strong> While we've learned vertical patterns (positions), horizontal playing involves playing scales along a single string or pair of strings.</p>
                <p><strong>Practice (10 min):</strong> Practice playing the A minor scale horizontally on the 2nd and 3rd strings. Notice how this changes your perspective of the fretboard.</p>
                <p>Try creating melodies that move horizontally rather than within a position.</p>
            `
        },
        {
            title: "Three-Note-Per-String Scale Patterns",
            description: `
                <p><strong>Theory (5 min):</strong> Three-note-per-string patterns are alternative scale fingerings that facilitate speed and legato playing.</p>
                <p><strong>Practice (10 min):</strong> Learn the A minor scale using three-note-per-string patterns. Start slow and focus on consistent finger placement.</p>
                <p>Once comfortable, try increasing speed gradually while maintaining clarity.</p>
            `
        },
        {
            title: "Minor Key Chord Progressions",
            description: `
                <p><strong>Theory (5 min):</strong> Minor key chord progressions commonly use chords built from the minor scale: i-iv-v or i-VI-VII.</p>
                <p><strong>Practice (10 min):</strong> Practice playing and identifying common chord progressions in A minor: Am-Dm-Em or Am-F-G.</p>
                <p>Try creating melodies over these progressions using the scales we've learned.</p>
            `
        },
        {
            title: "Mode Mixture and Borrowing",
            description: `
                <p><strong>Theory (5 min):</strong> Mode mixture involves borrowing notes or chords from parallel scales (same root, different mode).</p>
                <p><strong>Practice (10 min):</strong> Experiment with mixing elements from different A minor scales (natural, harmonic, melodic).</p>
                <p>Try playing phrases that switch between natural minor and harmonic minor, or that incorporate the raised 6th from melodic minor.</p>
            `
        },
        {
            title: "Creating Melodic Phrases",
            description: `
                <p><strong>Theory (5 min):</strong> Effective melodies use a combination of stepwise motion, leaps, rhythm variation, and resolution to create interest.</p>
                <p><strong>Practice (10 min):</strong> Create 4-bar melodic phrases in A minor using a mix of scales and arpeggios.</p>
                <p>Focus on musical phrasing - with a clear beginning, middle, and end to your musical ideas.</p>
            `
        },
        {
            title: "Introduction to Minor Key Composition",
            description: `
                <p><strong>Theory (5 min):</strong> Minor key composition often evokes emotions like sadness, tension, or mystery. The choice of scale variations contributes significantly to the mood.</p>
                <p><strong>Practice (10 min):</strong> Begin composing a short piece in A minor. Start with a chord progression, then add a melody using the scales we've learned.</p>
                <p>Focus on creating a specific mood or emotion through your choices of harmony and melody.</p>
            `
        },
        {
            title: "Scale Sequencing Techniques",
            description: `
                <p><strong>Theory (5 min):</strong> Sequencing involves repeating a pattern starting on different scale degrees, creating a sense of development and forward motion.</p>
                <p><strong>Practice (10 min):</strong> Practice scale sequences in A minor. Example: Play groups of 3 notes ascending, then start the pattern from the next scale degree.</p>
                <p>Try different sequence patterns, such as 3-note descending, 4-note ascending, etc.</p>
            `
        },
        {
            title: "Final Project: Personal Minor Scale Composition",
            description: `
                <p><strong>Theory (5 min):</strong> Review all concepts covered throughout the month: minor scales (natural, harmonic, melodic), positions, arpeggios, and composition techniques.</p>
                <p><strong>Practice (10 min):</strong> Complete your minor key composition, incorporating multiple scale types, positions, and arpeggios.</p>
                <p>Record your composition and reflect on what you've learned and how you've grown as a musician.</p>
            `
        },
        // Day 30: Final Review
        {
            title: "Complete Review and Next Steps",
            description: `
                <p><strong>Theory (5 min):</strong> Comprehensive review of all minor scales, positions, arpeggios, and creative applications.</p>
                <p><strong>Practice (10 min):</strong> Play through all five positions of the minor scale in multiple keys. Demonstrate your understanding of different minor scale types.</p>
                <p><strong>Next Steps:</strong> Consider exploring advanced techniques like modal interchange, diminished and altered scales, or focusing on genre-specific applications of what you've learned.</p>
                <p>Congratulations on completing the 30-day program! Continue practicing daily to reinforce what you've learned.</p>
            `
        }
    ];
}

// Initialize the calendar display
function initCalendar() {
    const calendarEl = document.querySelector('.calendar');
    calendarEl.innerHTML = '';
    
    for (let i = 1; i <= totalDays; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('calendar-day');
        if (i === currentDay) {
            dayEl.classList.add('current');
        }
        if (completedDays.includes(i)) {
            dayEl.classList.add('completed');
        }
        dayEl.textContent = i;
        dayEl.addEventListener('click', () => {
            currentDay = i;
            updateDayDisplay();
            loadCurrentLesson();
            updateCalendarHighlight();
        });
        calendarEl.appendChild(dayEl);
    }
}

// Update calendar day highlighting
function updateCalendarHighlight() {
    const days = document.querySelectorAll('.calendar-day');
    days.forEach((day, index) => {
        day.classList.remove('current');
        if (index + 1 === currentDay) {
            day.classList.add('current');
        }
    });
}

// Update the day display
function updateDayDisplay() {
    document.getElementById('current-day').textContent = `Day ${currentDay}`;
    updateCalendarHighlight();
}

// Load the current day's lesson
function loadCurrentLesson() {
    const lesson = lessonData[currentDay - 1];
    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-description').innerHTML = lesson.description;
    
    // Update the fretboard to match the current lesson
    if (p5Ready) {
        updateFretboardForCurrentLesson();
    } else {
        console.log("p5 not ready yet, will update fretboard soon");
        setTimeout(updateFretboardForCurrentLesson, 500);
    }
}

// Update fretboard visualization based on current lesson
function updateFretboardForCurrentLesson() {
    const dayNumber = currentDay;
    let scaleType = 'minor'; // default
    let rootNote = 'A'; // default
    
    // Logic to determine which scale to show based on the day
    if (dayNumber >= 8 && dayNumber <= 10) {
        scaleType = 'harmonic_minor';
    } else if (dayNumber >= 10 && dayNumber <= 12) {
        scaleType = 'melodic_minor';
    } else if (dayNumber === 5 || dayNumber === 19) {
        scaleType = 'pentatonic_minor';
    } else if (dayNumber === 20) {
        scaleType = 'blues';
    } else if (dayNumber === 21) {
        scaleType = 'dorian';
    }
    
    // Different keys for certain days
    if (dayNumber === 13) {
        rootNote = 'E';
    } else if (dayNumber === 14) {
        rootNote = 'D';
    }
    
    console.log(`Attempting to update fretboard to ${rootNote} ${scaleType}`);
    
    // Update the fretboard visualization
    if (fretboardSketch && typeof fretboardSketch.setScale === 'function') {
        try {
            fretboardSketch.setScale(rootNote, scaleType);
            console.log(`Updated fretboard to ${rootNote} ${scaleType}`);
        } catch (e) {
            console.error("Error updating fretboard:", e);
        }
    } else {
        console.log("Fretboard sketch or setScale function not available yet");
    }
}

// Toggle the metronome on/off
function toggleMetronome() {
    const button = document.getElementById('metronome-toggle');
    if (metronomeIsPlaying) {
        stopMetronome();
        button.textContent = 'Start';
    } else {
        startMetronome();
        button.textContent = 'Stop';
    }
    metronomeIsPlaying = !metronomeIsPlaying;
}

// Start the metronome
function startMetronome() {
    // Initialize AudioContext if it doesn't exist
    if (!audioContext) {
        try {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.error("Web Audio API is not supported in this browser:", e);
            return;
        }
    }
    
    const intervalMs = 60000 / tempo;
    
    // Play initial click
    playMetronomeClick();
    
    // Set up interval for subsequent clicks
    metronomeInterval = setInterval(playMetronomeClick, intervalMs);
}

// Play a single metronome click
function playMetronomeClick() {
    try {
        if (!audioContext) return;
        
        // Create oscillator
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configure oscillator
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        
        // Configure gain (volume)
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        // Connect nodes
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Play sound
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        console.error("Error playing metronome click:", e);
    }
}

// Stop the metronome
function stopMetronome() {
    clearInterval(metronomeInterval);
}

// Define the fretboard visualization
function fretboardSketchFunction(p) {
    let fretSpacing;
    let stringSpacing;
    let numFrets = 12;
    let numStrings = 6;
    let currentScale = [];
    let currentScaleType = 'minor';
    let currentRoot = 'A';
    
    p.setup = function() {
        console.log("Setting up fretboard sketch");
        let canvas = p.createCanvas(p.windowWidth * 0.8, 200);
        canvas.parent('fretboard-canvas'); // Ensure it's in the right container
        updateScaleNotes();
    };
    
    p.draw = function() {
        p.background(224, 251, 252);
        drawFretboard();
        drawNotes();
    };
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth * 0.8, 200);
    };
    
    function drawFretboard() {
        fretSpacing = p.width / (numFrets + 1);
        stringSpacing = p.height / (numStrings + 1);
        
        // Draw strings
        for (let i = 0; i < numStrings; i++) {
            p.stroke(41, 50, 65);
            p.strokeWeight(1 + (5 - i) * 0.4);
            p.line(0, (i + 1) * stringSpacing, p.width, (i + 1) * stringSpacing);
        }
        
        // Draw frets
        for (let i = 0; i <= numFrets; i++) {
            p.stroke(41, 50, 65);
            p.strokeWeight(i === 0 ? 4 : 2);
            p.line(i * fretSpacing, stringSpacing, i * fretSpacing, numStrings * stringSpacing);
        }
        
        // Draw fret markers
        p.noStroke();
        p.fill(150);
        [3, 5, 7, 9].forEach(fret => {
            p.ellipse(fret * fretSpacing - fretSpacing/2, (numStrings + 1) * stringSpacing / 2, 10, 10);
        });
        
        // Double dot at 12th fret
        p.ellipse(12 * fretSpacing - fretSpacing/2, 2 * stringSpacing, 10, 10);
        p.ellipse(12 * fretSpacing - fretSpacing/2, 4 * stringSpacing, 10, 10);
    }
    
    function drawNotes() {
        // Standard tuning: E A D G B E (from 6th string to 1st)
        const standardTuning = [4, 9, 2, 7, 11, 4]; // E(4), A(9), D(2), G(7), B(11), E(4)
        
        for (let string = 0; string < numStrings; string++) {
            for (let fret = 0; fret <= numFrets; fret++) {
                // Calculate the note at this position
                const noteValue = (standardTuning[string] + fret) % 12;
                
                // Check if this note is in our scale
                if (currentScale.includes(noteValue)) {
                    // Root note
                    if (noteValue === getNote(currentRoot)) {
                        p.fill(238, 108, 77); // Accent color for root
                    } else {
                        p.fill(152, 193, 217); // Secondary color for scale notes
                    }
                    
                    p.noStroke();
                    p.ellipse(fret * fretSpacing - fretSpacing/2, (string + 1) * stringSpacing, 20, 20);
                    
                    // Draw note name
                    p.fill(255);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(10);
                    p.text(getNoteNameFromValue(noteValue), fret * fretSpacing - fretSpacing/2, (string + 1) * stringSpacing);
                }
            }
        }
    }
    
    // Update scale notes based on root and type
    function updateScaleNotes() {
        const rootNote = getNote(currentRoot);
        
        // Define scale intervals (semitones from root)
        const scaleIntervals = {
            'major': [0, 2, 4, 5, 7, 9, 11],
            'minor': [0, 2, 3, 5, 7, 8, 10],
            'harmonic_minor': [0, 2, 3, 5, 7, 8, 11],
            'melodic_minor': [0, 2, 3, 5, 7, 9, 11],
            'pentatonic_major': [0, 2, 4, 7, 9],
            'pentatonic_minor': [0, 3, 5, 7, 10],
            'blues': [0, 3, 5, 6, 7, 10],
            'dorian': [0, 2, 3, 5, 7, 9, 10]
        };
        
        // Generate scale notes
        currentScale = scaleIntervals[currentScaleType].map(interval => (rootNote + interval) % 12);
    }
    
    // Get note value from name
    function getNote(noteName) {
        const notes = {
            'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 
            'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 
            'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
        };
        return notes[noteName];
    }
    
    // Get note name from value
    function getNoteNameFromValue(value) {
        const noteNames = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
        return noteNames[value];
    }
    
    // Expose setScale method to change the scale
    p.setScale = function(root, type) {
        console.log(`Setting scale: ${root} ${type}`);
        currentRoot = root;
        currentScaleType = type;
        updateScaleNotes();
    };
} 