var predefinedTimings={custom:{green:'1:00',yellow:'1:30',red:'2:00',dq:'2:30'},tableTopics:{green:'1:00',yellow:'1:30',red:'2:00',dq:'2:30'},evaluation:{green:'2:00',yellow:'2:30',red:'3:00',dq:'3:30'},speech:{green:'5:00',yellow:'6:00',red:'7:00',dq:'7:30'},gracePeriod:{green:'',yellow:'',red:'0:30',dq:''},iceBreaker:{green:'4:00',yellow:'5:00',red:'6:00',dq:'6:30'}};
var current='tableTopics',running=false,startTime=0,elapsed=0,raf=null;
var wrapper,clock,controlButton,resetButton,grower,infoButton,info,showClock;
var greenInput,yellowInput,redInput,dqInput;
function $(id){return document.getElementById(id)}
function parseTime(v){if(!v)return null;var s=String(v).trim();if(!s)return null;var p=s.split(':');if(p.length!==2)return null;var m=parseInt(p[0],10),sec=parseInt(p[1],10);if(isNaN(m)||isNaN(sec))return null;return m*60+sec}
function formatTime(sec){sec=Math.max(0,Math.floor(sec));var m=Math.floor(sec/60);var s=sec%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')}
function setInputs(name){var t=predefinedTimings[name];greenInput.value=t.green;yellowInput.value=t.yellow;redInput.value=t.red;dqInput.value=t.dq}
function validateWatch(){}
function validateThis(){}
function updateClock(){clock.textContent=formatTime(elapsed/1000)}
function applyColors(){var sec=elapsed/1000;var green=parseTime(greenInput.value),yellow=parseTime(yellowInput.value),red=parseTime(redInput.value),dq=parseTime(dqInput.value);var color='hsla(0,0%,27%,1)';if(red!==null&&sec>=red)color='hsla(0,85%,52%,1)';else if(yellow!==null&&sec>=yellow)color='hsla(45,100%,50%,1)';else if(green!==null&&sec>=green)color='hsla(120,45%,45%,1)';if(dq!==null&&sec>=dq)color='hsla(0,85%,52%,1)';wrapper.style.backgroundColor=color;var max=dq!==null?dq:(red!==null?red:(yellow!==null?yellow:(green!==null?green:null)));if(max!==null){grower.style.width=Math.min(100,(sec/max)*100)+'%'}else{grower.style.width='0%'}}
function tick(){if(!running)return;elapsed=Date.now()-startTime;updateClock();applyColors();raf=requestAnimationFrame(tick)}
function startTimer(){if(running)return;running=true;startTime=Date.now()-elapsed;controlButton.textContent='Stop';controlButton.classList.add('timerRunning');raf=requestAnimationFrame(tick)}
function stopTimer(){running=false;controlButton.textContent='Start';controlButton.classList.remove('timerRunning');if(raf)cancelAnimationFrame(raf)}
function resetTimer(){stopTimer();elapsed=0;updateClock();applyColors()}
function selectPreset(name){current=name;setInputs(name);resetTimer()}
window.validateWatch=validateWatch;
window.validateThis=validateThis;
window.addEventListener('DOMContentLoaded',function(){
  wrapper=$('wrapper');
  clock=$('clock');
  controlButton=$('controlButton');
  resetButton=$('resetButton');
  grower=$('grower');
  infoButton=$('infoButton');
  info=$('info');
  showClock=$('showClock');
  greenInput=$('customGreenLight');
  yellowInput=$('customYellowLight');
  redInput=$('customRedLight');
  dqInput=$('customDq');
  setInputs(current);
  document.querySelectorAll('input[name="predefinedOption"]').forEach(function(r){r.addEventListener('change',function(){selectPreset(this.value)})});
  greenInput.addEventListener('input',function(){document.getElementById('custom').checked=true;current='custom'});
  yellowInput.addEventListener('input',function(){document.getElementById('custom').checked=true;current='custom'});
  redInput.addEventListener('input',function(){document.getElementById('custom').checked=true;current='custom'});
  dqInput.addEventListener('input',function(){document.getElementById('custom').checked=true;current='custom'});
  controlButton.addEventListener('click',function(){running?stopTimer():startTimer()});
  resetButton.addEventListener('click',resetTimer);
  document.addEventListener('keydown',function(e){if(e.code==='Space'){e.preventDefault();running?stopTimer():startTimer()}});
  if(showClock)showClock.addEventListener('change',function(){clock.style.visibility=this.checked?'visible':'hidden'});
  if(infoButton&&info){infoButton.addEventListener('click',function(){info.style.display='flex';setTimeout(function(){info.style.opacity='1'},10)});info.addEventListener('click',function(){info.style.opacity='0';setTimeout(function(){info.style.display='none'},180)})}
  resetTimer()
});
