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
let circleOfFifthsSketch;
let p5Ready = false;
let theoryContent = {};
let practiceContent = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initLessonData();
    initTheoryContent();
    initPracticeContent();
    initCalendar();
    updateDayDisplay();
    
    // We'll initialize p5 after everything else is ready
    checkP5Loaded();
});

// Initialize lesson data with 30 days of content
function initLessonData() {
    lessonData = [
        // Week 1: Foundation - Understanding Minor Scales
        {
            title: "Introduction to Natural Minor Scale",
            description: `
                <p><strong>Theory (5 min):</strong> The natural minor scale (also called Aeolian mode) has the formula: 1-2-♭3-4-5-♭6-♭7. It differs from the major scale with its flatted 3rd, 6th, and 7th degrees.</p>
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
                <p><strong>Theory (5 min):</strong> An arpeggio is playing the notes of a chord individually. The minor arpeggio uses the 1st, ♭3rd, and 5th degrees of the minor scale.</p>
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
                <p><strong>Theory (5 min):</strong> Adding the 7th to a minor arpeggio creates a minor 7th arpeggio (1-♭3-5-♭7). This is commonly used in jazz and more complex music.</p>
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
                <p><strong>Theory (5 min):</strong> The blues scale adds a "blue note" (♭5) to the minor pentatonic scale, creating a distinctive sound used in blues, rock, and jazz.</p>
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
        // Initialize fretboard visualization
        fretboardSketch = new p5(fretboardSketchFunction, 'fretboard-canvas');
        console.log("Fretboard sketch initialized");
        
        // Initialize circle of fifths visualization
        circleOfFifthsSketch = new p5(circleOfFifthsSketchFunction, 'circle-canvas');
        console.log("Circle of fifths sketch initialized");
        
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
    
    // Update theory and practice content
    updateTheoryContent();
    updatePracticeContent();
    
    // Update the fretboard to match the current lesson
    if (p5Ready) {
        updateFretboardForCurrentLesson();
        updateCircleOfFifths();
    } else {
        console.log("p5 not ready yet, will update visualizations soon");
        setTimeout(() => {
            updateFretboardForCurrentLesson();
            updateCircleOfFifths();
        }, 500);
    }
}

// Update theory content based on current day
function updateTheoryContent() {
    const theoryDiv = document.getElementById('theory-content');
    if (theoryContent[currentDay]) {
        theoryDiv.innerHTML = theoryContent[currentDay];
    } else {
        theoryDiv.innerHTML = '<p>No detailed theory content available for this day.</p>';
    }
}

// Update practice content based on current day
function updatePracticeContent() {
    const practiceDiv = document.getElementById('practice-content');
    if (practiceContent[currentDay]) {
        practiceDiv.innerHTML = practiceContent[currentDay];
    } else {
        practiceDiv.innerHTML = '<p>No detailed practice content available for this day.</p>';
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

// Update circle of fifths based on current lesson
function updateCircleOfFifths() {
    const dayNumber = currentDay;
    let scaleType = 'minor'; // default
    let rootNote = 'A'; // default
    
    // Logic to determine which scale to show based on the day (same as fretboard)
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
    
    // Update the circle of fifths visualization
    if (circleOfFifthsSketch && typeof circleOfFifthsSketch.setActiveKey === 'function') {
        try {
            circleOfFifthsSketch.setActiveKey(rootNote, scaleType);
        } catch (e) {
            console.error("Error updating circle of fifths:", e);
        }
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
    let hoveredNote = null;
    
    p.setup = function() {
        console.log("Setting up fretboard sketch");
        let canvas = p.createCanvas(p.windowWidth * 0.9, 300); // Larger canvas
        canvas.parent('fretboard-canvas'); // Ensure it's in the right container
        updateScaleNotes();
    };
    
    p.draw = function() {
        p.background(224, 251, 252);
        drawFretboard();
        drawNotes();
        
        // Update note info tooltip if hovering over a note
        if (hoveredNote) {
            updateNoteInfo(hoveredNote);
        }
    };
    
    p.mouseMoved = function() {
        // Check if mouse is over any note
        hoveredNote = null;
        
        // Standard tuning E A D G B E
        const standardTuning = [4, 9, 2, 7, 11, 4]; 
        
        for (let string = 0; string < numStrings; string++) {
            for (let fret = 0; fret <= numFrets; fret++) {
                // Calculate the note at this position
                const noteValue = (standardTuning[string] + fret) % 12;
                
                // Check if this note is in our scale
                if (currentScale.includes(noteValue)) {
                    // Calculate position
                    const x = fret * fretSpacing - fretSpacing/2;
                    const y = (string + 1) * stringSpacing;
                    
                    // Check if mouse is over this note
                    const distance = p.dist(x, y, p.mouseX, p.mouseY);
                    if (distance < 15) {
                        hoveredNote = {
                            value: noteValue,
                            string: string + 1,
                            fret: fret,
                            x: x,
                            y: y
                        };
                    }
                }
            }
        }
    };
    
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth * 0.9, 300);
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
        
        // Draw fret numbers
        p.fill(100);
        p.textSize(10);
        p.textAlign(p.CENTER, p.CENTER);
        for (let i = 0; i <= numFrets; i++) {
            p.text(i, i * fretSpacing, stringSpacing / 2);
        }
        
        // Draw string names
        const stringNames = ['E', 'A', 'D', 'G', 'B', 'E'];
        for (let i = 0; i < numStrings; i++) {
            p.text(stringNames[i], fretSpacing / 4, (i + 1) * stringSpacing);
        }
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
                    
                    // Check if this is the hovered note
                    const x = fret * fretSpacing - fretSpacing/2;
                    const y = (string + 1) * stringSpacing;
                    
                    if (hoveredNote && hoveredNote.value === noteValue && 
                        hoveredNote.string === string + 1 && hoveredNote.fret === fret) {
                        // Highlight hovered note
                        p.fill(255, 165, 0); // Orange highlight
                        p.ellipse(x, y, 24, 24);
                    } else {
                        p.ellipse(x, y, 20, 20);
                    }
                    
                    // Draw note name
                    p.fill(255);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.textSize(10);
                    p.text(getNoteNameFromValue(noteValue), x, y);
                }
            }
        }
    }
    
    function updateNoteInfo(note) {
        const noteInfo = document.getElementById('note-info');
        const noteName = getNoteNameFromValue(note.value);
        const interval = getIntervalName(note.value, getNote(currentRoot));
        const position = `String ${note.string}, Fret ${note.fret}`;
        
        // Add scale degree (Roman numeral)
        const degree = getScaleDegree(note.value, getNote(currentRoot), currentScaleType);
        
        // Set the tooltip content
        noteInfo.innerHTML = `
            <strong>${noteName}</strong><br>
            ${interval} from ${currentRoot}<br>
            ${degree}<br>
            ${position}
        `;
    }
    
    // Get scale degree as Roman numeral
    function getScaleDegree(noteValue, rootValue, scaleType) {
        // Define scale intervals based on scale type
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
        
        // Create normalized scale degrees
        const intervals = scaleIntervals[scaleType];
        const normalizedNoteValue = (noteValue - rootValue + 12) % 12;
        
        // Find the degree index
        const degreeIndex = intervals.indexOf(normalizedNoteValue);
        
        if (degreeIndex === -1) {
            return "Non-scale tone";
        }
        
        // Convert to Roman numerals
        const majorRomanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
        const minorRomanNumerals = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii'];
        
        // Use lowercase for minor scales, uppercase for major
        const isMinorType = scaleType.includes('minor') || scaleType === 'dorian' || scaleType === 'blues';
        const numerals = isMinorType ? minorRomanNumerals : majorRomanNumerals;
        
        return `Scale Degree: ${numerals[degreeIndex]}`;
    }
    
    // Get interval name between two notes
    function getIntervalName(noteValue, rootValue) {
        // Normalize the interval (0-11 semitones)
        const semitones = (noteValue - rootValue + 12) % 12;
        
        // Define interval names
        const intervalNames = {
            0: 'Root/Octave',
            1: 'Minor 2nd',
            2: 'Major 2nd',
            3: 'Minor 3rd',
            4: 'Major 3rd',
            5: 'Perfect 4th',
            6: 'Tritone',
            7: 'Perfect 5th',
            8: 'Minor 6th',
            9: 'Major 6th',
            10: 'Minor 7th',
            11: 'Major 7th'
        };
        
        return intervalNames[semitones];
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

// Define the circle of fifths visualization
function circleOfFifthsSketchFunction(p) {
    // Constants for the circle layout
    const CIRCLE_RADIUS = 120;
    const NOTE_RADIUS = 25;
    let centerX, centerY;
    let activeKey = 'A';
    let activeType = 'minor';
    let isHovering = false;
    let hoveredKey = null;
    
    // The 12 notes in circle of fifths order
    const noteOrder = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
    const noteValues = {
        'C': 0, 'G': 7, 'D': 2, 'A': 9, 'E': 4, 'B': 11, 
        'F#': 6, 'Db': 1, 'Ab': 8, 'Eb': 3, 'Bb': 10, 'F': 5
    };
    const relativeMinors = {
        'C': 'A', 'G': 'E', 'D': 'B', 'A': 'F#', 'E': 'C#', 'B': 'G#', 
        'F#': 'Eb', 'Db': 'Bb', 'Ab': 'F', 'Eb': 'C', 'Bb': 'G', 'F': 'D'
    };
    
    p.setup = function() {
        let canvas = p.createCanvas(300, 300);
        canvas.parent('circle-canvas');
        p.textAlign(p.CENTER, p.CENTER);
        centerX = p.width / 2;
        centerY = p.height / 2;
    };
    
    p.draw = function() {
        p.background(224, 251, 252);
        drawCircleOfFifths();
        
        // Draw title and instructions
        p.textSize(14);
        p.fill(41, 50, 65);
        p.text("Circle of Fifths", centerX, 20);
        p.textSize(10);
        p.text("Hover for key relationships", centerX, p.height - 20);
        
        // Draw key relationship info if hovering
        if (isHovering && hoveredKey) {
            drawKeyRelationships(hoveredKey);
        }
    };
    
    p.mouseMoved = function() {
        // Check if mouse is over any note circle
        isHovering = false;
        hoveredKey = null;
        
        for (let i = 0; i < noteOrder.length; i++) {
            const angle = p.map(i, 0, 12, -p.PI/2, 3*p.PI/2);
            const x = centerX + CIRCLE_RADIUS * p.cos(angle);
            const y = centerY + CIRCLE_RADIUS * p.sin(angle);
            
            // Check if mouse is over this circle
            const d = p.dist(p.mouseX, p.mouseY, x, y);
            if (d < NOTE_RADIUS) {
                isHovering = true;
                hoveredKey = noteOrder[i];
                break;
            }
        }
    };
    
    function drawCircleOfFifths() {
        // Draw the outer circle
        p.noFill();
        p.stroke(41, 50, 65);
        p.strokeWeight(2);
        p.ellipse(centerX, centerY, CIRCLE_RADIUS * 2 + NOTE_RADIUS);
        
        // Draw the note circles
        for (let i = 0; i < noteOrder.length; i++) {
            const note = noteOrder[i];
            const angle = p.map(i, 0, 12, -p.PI/2, 3*p.PI/2);
            const x = centerX + CIRCLE_RADIUS * p.cos(angle);
            const y = centerY + CIRCLE_RADIUS * p.sin(angle);
            
            // Check if this is the active key or its relative
            const isActive = (note === activeKey) || 
                             (activeType === 'minor' && relativeMinors[note] === activeKey) ||
                             (activeType === 'major' && relativeMinors[activeKey] === note);
            
            // Fill color based on active state
            if (isActive) {
                p.fill(238, 108, 77); // Accent color for active key
            } else if (isHovering && note === hoveredKey) {
                p.fill(255, 165, 0); // Orange for hovered key
            } else {
                p.fill(152, 193, 217); // Default color
            }
            
            p.stroke(41, 50, 65);
            p.strokeWeight(1);
            p.ellipse(x, y, NOTE_RADIUS * 2);
            
            // Draw note name
            p.noStroke();
            p.fill(255);
            p.textSize(14);
            p.text(note, x, y);
            
            // Draw the relative minor
            p.textSize(10);
            p.fill(41, 50, 65);
            p.text(relativeMinors[note], x, y + 15);
        }
        
        // Draw inner circle connecting relative minors
        p.noFill();
        p.stroke(41, 50, 65, 100);
        p.strokeWeight(1);
        p.ellipse(centerX, centerY, CIRCLE_RADIUS);
    }
    
    function drawKeyRelationships(key) {
        p.noStroke();
        p.fill(41, 50, 65);
        p.textSize(12);
        
        // Show the key and its relative
        const relativeKey = relativeMinors[key];
        const text = `${key} major = ${relativeKey} minor`;
        p.text(text, centerX, centerY);
        
        // Show the dominant and subdominant
        const dominantIdx = (noteOrder.indexOf(key) + 1) % 12;
        const subdominantIdx = (noteOrder.indexOf(key) - 1 + 12) % 12;
        
        const dominant = noteOrder[dominantIdx];
        const subdominant = noteOrder[subdominantIdx];
        
        p.textSize(10);
        p.text(`Dominant: ${dominant}`, centerX, centerY + 20);
        p.text(`Subdominant: ${subdominant}`, centerX, centerY + 35);
    }
    
    // Public method to set the active key
    p.setActiveKey = function(root, type) {
        activeKey = root;
        activeType = type;
    };
}

// Initialize expanded theory content
function initTheoryContent() {
    theoryContent = {
        1: `
            <h3>Natural Minor Scale Theory</h3>
            <p>The natural minor scale (also called Aeolian mode) has the formula: 1-2-♭3-4-5-♭6-♭7.</p>
            <p>The defining characteristic of minor scales is the flattened 3rd degree, which gives them their melancholic sound. Unlike major scales, which have a bright and happy quality, minor scales tend to sound more somber or thoughtful.</p>
            <p>In the key of A minor:</p>
            <ul>
                <li>A (1): Root/Tonic</li>
                <li>B (2): Major 2nd</li>
                <li>C (♭3): Minor 3rd</li>
                <li>D (4): Perfect 4th</li>
                <li>E (5): Perfect 5th</li>
                <li>F (♭6): Minor 6th</li>
                <li>G (♭7): Minor 7th</li>
            </ul>
            <p>The natural minor scale is derived from the 6th degree of the major scale. A minor is the relative minor of C major, sharing the same key signature (no sharps or flats).</p>
        `,
        2: `
            <h3>The CAGED System</h3>
            <p>The CAGED system is an approach to visualizing the guitar fretboard using five basic chord shapes: C, A, G, E, and D. These shapes can be moved up and down the neck to play in different keys.</p>
            <p>For scales, each CAGED position corresponds to a different pattern or "box" on the fretboard. Position 1 for minor scales is based on the E shape.</p>
            <p>Benefits of the CAGED system include:</p>
            <ul>
                <li>Organized approach to learning the entire fretboard</li>
                <li>Connects chord shapes to scale patterns</li>
                <li>Provides reference points for improvisation</li>
                <li>Facilitates transposition to different keys</li>
            </ul>
            <p>Each position overlaps with adjacent positions, allowing for smooth transitions across the neck.</p>
        `,
        5: `
            <h3>Minor Pentatonic Scale</h3>
            <p>The minor pentatonic scale is a five-note scale derived from the natural minor scale. It removes the 2nd and 6th degrees, resulting in: 1-♭3-4-5-♭7.</p>
            <p>For A minor pentatonic: A-C-D-E-G</p>
            <p>The minor pentatonic scale is incredibly versatile and widely used in many genres of music, especially blues, rock, and pop. Its simplicity makes it easier to play and less likely to produce dissonant notes when improvising.</p>
            <p>The scale's versatility comes from its ability to work over both minor and major progressions with slight adjustments in phrasing.</p>
            <p>Position 1 of the minor pentatonic scale is often called the "blues box" and is typically the first scale pattern guitarists learn for improvisation.</p>
        `,
        8: `
            <h3>Harmonic Minor Scale</h3>
            <p>The harmonic minor scale modifies the natural minor by raising the 7th degree by a half step. This creates the formula: 1-2-♭3-4-5-♭6-7.</p>
            <p>For A harmonic minor: A-B-C-D-E-F-G#</p>
            <p>The raised 7th creates a stronger pull toward the tonic, giving the scale its distinctive sound. This comes from the creation of a leading tone that's only a half-step away from the root.</p>
            <p>The distance between the ♭6 (F) and the 7 (G#) creates an augmented 2nd interval (3 half steps), which gives harmonic minor its exotic, Eastern European or Middle Eastern quality.</p>
            <p>In classical music, the harmonic minor scale resolves the "problem" of the natural minor scale lacking a strong cadence by providing the V-i resolution that was considered crucial in Western harmony.</p>
        `,
        10: `
            <h3>Melodic Minor Scale</h3>
            <p>The melodic minor scale traditionally has different ascending and descending forms:</p>
            <p><strong>Ascending</strong>: 1-2-♭3-4-5-6-7 (A-B-C-D-E-F#-G#)</p>
            <p><strong>Descending</strong>: 8-♭7-♭6-5-4-♭3-2-1 (A-G-F-E-D-C-B-A, same as natural minor)</p>
            <p>This scale was developed to address both melodic and harmonic concerns in classical music:</p>
            <ul>
                <li>The raised 6th and 7th when ascending provide smoother voice leading and a stronger pull to the tonic</li>
                <li>The natural minor form when descending was considered more melodically pleasing</li>
            </ul>
            <p>In jazz and modern music, the ascending form is often used both ascending and descending, known as the "jazz melodic minor" scale.</p>
            <p>The melodic minor scale is rich with possibilities for creating tension and resolution in improvisation.</p>
        `,
        14: `
            <h3>Relative Major and Minor Scales</h3>
            <p>Every major scale has a relative minor scale, and vice versa. These relative scales share the exact same notes but start from different degrees:</p>
            <ul>
                <li>A minor is the relative minor of C major (A is the 6th degree of C major)</li>
                <li>C major is the relative major of A minor (C is the 3rd degree of A minor)</li>
            </ul>
            <p>The relative minor always starts from the 6th degree of the major scale. To find the relative minor of any major key, count down three half steps (or up 9 half steps).</p>
            <p>Despite sharing the same notes, the different starting points create entirely different tonal centers and emotional qualities. This is due to the different relationships between scale degrees and the tonic.</p>
            <p>Understanding relative keys is essential for:</p>
            <ul>
                <li>Modulation between keys</li>
                <li>Understanding song structure</li>
                <li>Analyzing chord progressions</li>
                <li>Creating harmonic variety in composition</li>
            </ul>
        `,
        21: `
            <h3>Dorian Mode</h3>
            <p>The Dorian mode is the second mode of the major scale, built from the 2nd scale degree. It can also be thought of as a modified natural minor scale with a raised 6th degree.</p>
            <p>Formula: 1-2-♭3-4-5-6-♭7</p>
            <p>For A Dorian: A-B-C-D-E-F#-G</p>
            <p>The defining characteristic of Dorian is the raised 6th compared to the natural minor. This single note change creates a brighter, more hopeful sound while still maintaining the minor quality through the ♭3.</p>
            <p>Dorian is widely used in:</p>
            <ul>
                <li>Jazz: for minor 7th chord improvisation</li>
                <li>Rock: especially in modal jam sections</li>
                <li>Folk music: particularly in Celtic and medieval-inspired music</li>
            </ul>
            <p>Famous examples of Dorian mode include Miles Davis's "So What," Santana's "Oye Como Va," and The Doors' "Riders on the Storm."</p>
        `
    };
}

// Initialize expanded practice content
function initPracticeContent() {
    practiceContent = {
        1: `
            <h3>A Minor Scale Practice Techniques</h3>
            <p><strong>Exercise 1: Basic Scale Runs</strong></p>
            <ul>
                <li>Play the A minor scale ascending and descending, quarter notes at 60 BPM</li>
                <li>Focus on clean transitions between strings</li>
                <li>Maintain consistent timing between notes</li>
            </ul>
            
            <p><strong>Exercise 2: Rhythmic Variations</strong></p>
            <ul>
                <li>Play the scale using eighth notes, then triplets</li>
                <li>Create a pattern: quarter, eighth, eighth, quarter</li>
                <li>Accent the first note of each beat</li>
            </ul>
            
            <p><strong>Exercise 3: String Skipping</strong></p>
            <ul>
                <li>Practice playing the scale while skipping strings</li>
                <li>Try pattern: play two notes on one string, then skip to another string</li>
                <li>This helps develop finger independence and fretboard vision</li>
            </ul>
            
            <p>Remember to use a metronome and gradually increase speed only after achieving clean execution at slower tempos.</p>
        `,
        5: `
            <h3>Minor Pentatonic Practice Techniques</h3>
            <p><strong>Exercise 1: Position 1 Mastery</strong></p>
            <ul>
                <li>Play the A minor pentatonic scale in Position 1 (the "blues box")</li>
                <li>Ascend and descend slowly at first, focusing on clean notes</li>
                <li>Play with a metronome at 60-80 BPM</li>
            </ul>
            
            <p><strong>Exercise 2: Comparison Study</strong></p>
            <ul>
                <li>Play the natural minor scale, then immediately play the pentatonic</li>
                <li>Notice the differences in sound and feel</li>
                <li>Try playing simple melodies using only pentatonic notes</li>
            </ul>
            
            <p><strong>Exercise 3: Pentatonic Sequences</strong></p>
            <ul>
                <li>Play groups of 3 notes, then start from the next note in the scale</li>
                <li>Example: A-C-D, C-D-E, D-E-G, E-G-A, etc.</li>
                <li>Try descending sequences as well</li>
            </ul>
            
            <p><strong>Backing Track Practice:</strong> Use a simple A minor backing track and practice improvising using only the pentatonic scale. Focus on phrasing and space between notes rather than speed.</p>
        `,
        8: `
            <h3>Harmonic Minor Practice Techniques</h3>
            <p><strong>Exercise 1: The Augmented 2nd Interval</strong></p>
            <ul>
                <li>Isolate and practice the F to G# movement (♭6 to 7) in A harmonic minor</li>
                <li>Play slowly at first to internalize this distinctive sound</li>
                <li>Practice this interval in various positions on the neck</li>
            </ul>
            
            <p><strong>Exercise 2: Harmonic Minor Arpeggios</strong></p>
            <ul>
                <li>Practice arpeggios derived from the harmonic minor scale</li>
                <li>Focus on the i, V, and vii° chords (Am, E major, G# diminished)</li>
                <li>The V chord is now major (unlike in natural minor), which creates the strong resolution</li>
            </ul>
            
            <p><strong>Exercise 3: Eastern-Inspired Phrases</strong></p>
            <ul>
                <li>Create melodic phrases emphasizing the augmented 2nd interval</li>
                <li>Try playing patterns that use F, G#, and A in succession</li>
                <li>Add vibrato and quarter-tone bends for an exotic flavor</li>
            </ul>
            
            <p><strong>Application:</strong> Record a simple i-V progression (Am to E) and practice resolving phrases on the tonic A note, using the G# as a leading tone.</p>
        `,
        15: `
            <h3>Advanced Scale Position Practice</h3>
            <p><strong>Exercise 1: Position Transition Drills</strong></p>
            <ul>
                <li>Practice moving from Position 1 to Position 2 and back</li>
                <li>Create a 3-note pattern that crosses the position boundary</li>
                <li>Start slowly (60 BPM) and gradually increase speed</li>
            </ul>
            
            <p><strong>Exercise 2: Three Octave Scales</strong></p>
            <ul>
                <li>Play the A minor scale across three octaves, moving through multiple positions</li>
                <li>Focus on smooth position shifts without hesitation</li>
                <li>Maintain consistent tone and volume across all positions</li>
            </ul>
            
            <p><strong>Exercise 3: Position-Based Improvisation</strong></p>
            <ul>
                <li>Improvise within Position 1 for 8 bars</li>
                <li>Shift to Position 2 for 8 bars</li>
                <li>Continue through all positions, then reverse the order</li>
            </ul>
            
            <p><strong>Visualization Exercise:</strong> Without playing, mentally map out all five positions of the A minor scale on the fretboard. Then verify by playing through each position slowly.</p>
        `,
        23: `
            <h3>Three-Note-Per-String Scale Patterns</h3>
            <p><strong>Exercise 1: Basic Three-Note Pattern</strong></p>
            <ul>
                <li>Play the A minor scale using three notes on each string</li>
                <li>This creates a pattern of 3 notes per string across the neck</li>
                <li>Focus on consistent finger placement (typically 1-2-4 or 1-3-4 fingering)</li>
            </ul>
            
            <p><strong>Exercise 2: Economy Picking</strong></p>
            <ul>
                <li>Use alternate picking for notes on the same string</li>
                <li>When changing strings, use economy picking (continue in the same direction)</li>
                <li>This creates efficient pick movement across strings</li>
            </ul>
            
            <p><strong>Exercise 3: Legato Technique</strong></p>
            <ul>
                <li>Practice playing the three-note-per-string patterns using hammer-ons and pull-offs</li>
                <li>Pick only the first note on each string, play the other two with legato technique</li>
                <li>This creates a smooth, flowing sound ideal for fast passages</li>
            </ul>
            
            <p><strong>Speed Building:</strong> Once comfortable with the patterns, practice with a metronome starting at 60 BPM playing eighth notes. Increase by 4-8 BPM increments only after achieving clean execution.</p>
        `
    };
} 