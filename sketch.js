
// SPEECH TO TEXT

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();

recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.variable');


// COLOURS

let paletteA = ["#002626","#0e4749","#95c623","#e55812","#efe7da","#93b7be","#f1fffa","#785964","#fcfcfc", "#f1fffa"];
let paletteB = ["#001219","#005f73","#0a9396","#94d2bd","#e9d8a6","#ee9b00","#ca6702","#bb3e03","#ae2012","#9b2226"];
let paletteC = ["#ffe8d6","#829e95","#f1f1f1","#ff7f11","#ffffff","#829e95","#022b3a","#ffe8d6","#fAf5f0","#1c1c1c"];
let paletteD = ["#ffcdb2","#ffb4a2","#e5989b","#b5838d","#6d6875","#ffcdb2","#ffb4a2","#e5989b","#b5838d","#6d6875"];
let paletteE = ["#fbf8cc","#fde4cf","#ffcfd2","#f1c0e8","#cfbaf0","#a3c4f3","#90dbf4","#8eecf5","#98f5e1","#b9fbc0"];
let paletteF = ["#f8f9fa","#e9ecef","#dee2e6","#ced4da","#adb5bd","#6c757d","#495057","#343a40","#212529", "#FEEBF4"];

let palette = paletteD; // CHANGE PALETTE LETTER A - F TO VARY PALETTES
let sensitivity = 1; // RANGE 0 - 1

let index = Math.random();
index *= palette.length;
index = Math.floor(index);

var textColor = document.getElementById("words");
words.style.color = (palette[index]);
document.body.style.backgroundColor = (palette[index -1]);

// MIC INPUT

let mic, fft;
let voiceWeight;

// SETUP

function setup() {
  noCanvas();

  mic = new p5.AudioIn();
  //mic.start();
  fft = new p5.FFT(0.9,512);
  fft.setInput(mic);
  
  
  variable = select('.variable');
}

// SPEECH TO TEXT

document.body.onkeydown = function() {
  recognition.start();
  mic.start();
  console.log('Ready to receive a color command.');
}

recognition.onresult = function(event) {

  var words = event.results[0][0].transcript;
  diagnostic.textContent = words;
  console.log('Confidence: ' + event.results[0][0].confidence);  
}

// DRAW

function draw() {

  let spectrum = fft.analyze();
  //console.log('Spectrum ' + spectrum.length);

  let lowMid = fft.getEnergy("lowMid");
  let mid = fft.getEnergy("mid");
  let highMid = fft.getEnergy("highMid");
  let treble = fft.getEnergy("treble");
  //console.log(treble);


  voiceWeight = map(lowMid, 0, 200, 0, 1000);
  voiceInvWeight = map(treble, 0, 20, 1000, 0);
  voiceWidth = map(highMid, 0, 50, 100, 35);
  voiceOpticalSize = map(treble, 0, 20, 50, 10);
  voiceContrast = map(treble, 0, 20, 0, 1000);
  voiceHrot = map(lowMid, 0, 200, -45, 45);
  voiceVrot = map(treble, 0, 20, -45, 45);
  voiceShape = map(treble, 0, 20, 1, 16);
  voiceGrid = map(mid, 0, 50, 1.0, 2.0);
  voiceStripe = map(treble, 0, 20, 0, 1000);
  voiceWorm = map(highMid, 0, 50, 0, 1000);

  variable.style('font-variation-settings', 
  " 'wght' " + ((voiceWeight) * sensitivity) + // AMSTELVAR, KYIV, HANDJET
  ", 'wdth' " + (voiceWidth * sensitivity) + // AMSTELVAR
  ", 'opsz' " + (voiceOpticalSize * sensitivity) + // AMSTELVAR
  ", 'CONT' " + (voiceContrast * sensitivity) + // KYIV
  ", 'HROT' " + (voiceHrot * sensitivity) + // TILTWARP
  ", 'VROT' " + (voiceVrot * sensitivity) + // TILTWARP
  ", 'ESHP' " + (voiceShape * sensitivity) + // HANDJET
  ", 'EGRD' " + (voiceGrid * sensitivity) + // HANDJET
  ", 'WMX2' " + (voiceWeight * sensitivity) + // DECOVAR
  ", 'SKLD' " + (voiceStripe * sensitivity) + // DECOVAR
  ", 'SKLB' " + (voiceWorm * sensitivity)  // DECOVAR
  );

  variable.style('font-size', (100 + (voiceWeight * 0.05)) + "px");
}

recognition.onspeechend = function() {
  recognition.stop();

let index = Math.random();
index *= palette.length;
index = Math.floor(index);

var textColor = document.getElementById("words");
words.style.color = (palette[index]);
document.body.style.backgroundColor = (palette[index -1]);
}

function mousePressed(){
  window.print();
}