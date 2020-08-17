// Global declarations

let mrOscillator;
let toggleOnOff;

// Cache the DOM
const chooseOscillator = document.querySelector('.oscillators');
const playButton = document.querySelector('.playButton');
const setVolume = document.querySelector('.setVolume');
const setPan = document.querySelector('.setPan');
const setFreq = document.querySelector('.setFreq');

// Fast Fourier Transform
let fft;

function setup() {

    createCanvas(windowWidth, 400);

    // initialize p5 objects
    mrOscillator = new p5.Oscillator();
    mrOscillator.amp(0);
    fft = new p5.FFT();
    
    //draw attributes
    fill('white');
    noStroke();
}

playButton.addEventListener('click', function() {
    //if sound is on, turn if off; if sound is off, turn it on.
    if (mrOscillator.started){
        mrOscillator.stop();
        playButton.innerHTML = "Play"
    } else {
        mrOscillator.start();
        playButton.innerHTML = "Stop"
    }
});

chooseOscillator.addEventListener('change', function() {
    // When select changes, set value to type for mrOscillator
    //mrOscillator.stop()
    mrOscillator.setType(chooseOscillator.value);
    //mrOscillator.start()
});

setVolume.addEventListener('input', function() {

    let decibels = Number(this.value);

    if (decibels > -56) {
        // amplitude = 10^(decibels/20)
        // pow(base, exponent)
        // amp([vol], [rampTime], [tFromNow])
        mrOscillator.amp(pow(10, decibels/20), 0.1)
    } else {
        //map - first argument, thing you want to map, 
          //    - next 2 arguments - range of thing
          //    - desired width
        mrOscillator.amp(map(decibels, -60, -56, 0, 0.0016), 0.1);
    }
});

setPan.addEventListener('input', function() {
    // pan(panning, timeFromNow)
    panNumber = Number(this.value);
    // console.log(panNumber)
    mrOscillator.pan(panNumber);
});

setFreq.addEventListener('input', function() {
    // freq(Frequency, [rampTime], [timeFromNow])
    freqNumber = Number(this.value);
    // console.log(freqNumber)
    mrOscillator.freq(freqNumber);
});


function draw() {

    background(80);

    let spectrum = fft.analyze();
    let wave = fft.waveform();

    //connect the points
    beginShape();
    // create two vertices to fill from the bottom
    vertex(0,height);

    for (let i=0; i<spectrum.length; i++){
        vertex(map(log(i),0, log(spectrum.length), 0, width),map(spectrum[i], 0, 255, height, 0));
    }
    vertex(width, height)
    endShape();

    beginShape();
    stroke('white')
    for (let j=0; j < wave.length; j++) {
        let x = map(j, 0, wave.length, 0, width);
        let y = map(wave[j], -1, 1, 0, height);
        point(x,y)
    }
    endShape();

}

function touchStarted() {
    if (getAudioContext().state !== 'running') {
      get.AudioContext().resume();
    }
  }