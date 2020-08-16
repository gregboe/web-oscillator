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

    createCanvas(400, 200);

    // initialize p5 objects
    mrOscillator = new p5.Oscillator();
    mrOscillator.amp(0);
    fft = new p5.FFT();
    
    //draw attributes
    stroke('white');
}

playButton.addEventListener('click', function() {
    //if sound is on, turn if off; if sound is off, turn it on.
    if (mrOscillator.started){
        mrOscillator.stop();
    } else {
        mrOscillator.start();
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

    for (let i=0; i<spectrum.length; i++){
        point(map(log(i),0, log(spectrum.length), 0, width),map(spectrum[i], 0, 255, height, 0));
    }
}

function touchStarted() {
    if (getAudioContext().state !== 'running') {
      get.AudioContext().resume();
    }
  }