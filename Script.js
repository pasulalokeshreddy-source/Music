let model;
let player;
let sequence;

async function generateMusic(){

document.getElementById("status").innerText="Loading AI model...";

model = new mm.MusicRNN(
'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn'
);

await model.initialize();

const seed={
notes:[
{pitch:60,startTime:0,endTime:0.5},
{pitch:64,startTime:0.5,endTime:1},
{pitch:67,startTime:1,endTime:1.5}
],
totalTime:1.5
};

document.getElementById("status").innerText="Generating music...";

sequence=await model.continueSequence(seed,40,1.2);

player=new mm.Player();

document.getElementById("status").innerText="Music Ready";
}

function playMusic(){

if(!sequence){
alert("Generate music first");
return;
}

player.start(sequence);
startVisualizer();
}

function stopMusic(){
if(player) player.stop();
}

function downloadMIDI(){

let midi=mm.sequenceProtoToMidi(sequence);

let blob=new Blob([midi],{type:"audio/midi"});

let a=document.createElement("a");

a.href=URL.createObjectURL(blob);

a.download="ai_music.mid";

a.click();
}

function startVisualizer(){

let canvas=document.getElementById("visualizer");
let ctx=canvas.getContext("2d");

let analyser=Tone.context.createAnalyser();

function draw(){

requestAnimationFrame(draw);

let data=new Uint8Array(analyser.frequencyBinCount);

analyser.getByteFrequencyData(data);

ctx.fillStyle="black";
ctx.fillRect(0,0,canvas.width,canvas.height);

ctx.fillStyle="lime";

for(let i=0;i<data.length;i++){

let value=data[i];

ctx.fillRect(i*2,canvas.height-value,2,value);
}

}

draw();
}
