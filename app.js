var predefinedTimings={
  custom:{green:'1:00',yellow:'1:30',red:'2:00',dq:'2:30'},
  tableTopics:{green:'1:00',yellow:'1:30',red:'2:00',dq:'2:30'},
  evaluation:{green:'2:00',yellow:'2:30',red:'3:00',dq:'3:30'},
  speech:{green:'5:00',yellow:'6:00',red:'7:00',dq:'7:30'},
  gracePeriod:{green:'',yellow:'',red:'0:30',dq:''},
  iceBreaker:{green:'4:00',yellow:'5:00',red:'6:00',dq:'6:30'}
};

var current='tableTopics',running=false,elapsed=0,startStamp=0,raf=null,hasStarted=false;
var wrapper,clock,controlButton,resetButton,grower,infoButton,info,showClock;
var greenInput,yellowInput,redInput,dqInput;

function $(id){return document.getElementById(id)}

function parseTime(v){
  if(!v)return null;
  var s=String(v).trim();
  if(!s)return null;
  var p=s.split(':');
  if(p.length!==2)return null;
  var m=parseInt(p[0],10),sec=parseInt(p[1],10);
  if(isNaN(m)||isNaN(sec))return null;
  return m*60+sec;
}

function formatTime(sec){
  sec=Math.max(0,Math.floor(sec));
  var m=Math.floor(sec/60);
  var s=sec%60;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function setInputs(name){
  var t=predefinedTimings[name];
  greenInput.value=t.green;
  yellowInput.value=t.yellow;
  redInput.value=t.red;
  dqInput.value=t.dq;
}

function validateWatch(){}
function validateThis(){}

function updateClock(){
  clock.textContent=formatTime(elapsed/1000);
}

function updateButtons(){
  if(running){
    controlButton.textContent='Stop';
    controlButton.classList.add('timerRunning');
    resetButton.style.display='block';
  }else{
    controlButton.classList.remove('timerRunning');
    controlButton.textContent=hasStarted&&elapsed>0?'Resume':'Start';
    resetButton.style.display=hasStarted||elapsed>0?'block':'block';
  }
}

function applyColors(){
  var sec=elapsed/1000;
  var green=parseTime(greenInput.value),
      yellow=parseTime(yellowInput.value),
      red=parseTime(redInput.value),
      dq=parseTime(dqInput.value);

  wrapper.classList.remove('dqFlash');

  if(dq!==null&&sec>=dq){
    wrapper.style.backgroundColor='hsla(0,85%,52%,1)';
    wrapper.classList.add('dqFlash');
  }else if(red!==null&&sec>=red){
    wrapper.style.backgroundColor='hsla(0,85%,52%,1)';
  }else if(yellow!==null&&sec>=yellow){
    wrapper.style.backgroundColor='hsla(45,100%,50%,1)';
  }else if(green!==null&&sec>=green){
    wrapper.style.backgroundColor='hsla(120,45%,45%,1)';
  }else{
    wrapper.style.backgroundColor='hsla(0,0%,27%,1)';
  }

  var max=dq!==null?dq:(red!==null?red:(yellow!==null?yellow:(green!==null?green:null)));
  if(max!==null){
    grower.style.width=Math.min(100,(sec/max)*100)+'%';
  }else{
    grower.style.width='0%';
  }
}

function render(){
  updateClock();
  applyColors();
  updateButtons();
}

function tick(ts){
  if(!running)return;
  if(!startStamp)startStamp=ts-elapsed;
  elapsed=ts-startStamp;
  render();
  raf=requestAnimationFrame(tick);
}

function startTimer(){
  if(running)return;
  running=true;
  hasStarted=true;
  startStamp=performance.now()-elapsed;
  updateButtons();
  raf=requestAnimationFrame(tick);
}

function stopTimer(){
  running=false;
  if(raf)cancelAnimationFrame(raf);
  raf=null;
  startStamp=0;
  updateButtons();
}

function resetTimer(){
  stopTimer();
  elapsed=0;
  hasStarted=false;
  render();
}

function selectPreset(name){
  current=name;
  setInputs(name);
  resetTimer();
}

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

  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(function(registrations){
      registrations.forEach(function(registration){
        registration.unregister();
      });
    });
  }

  setInputs(current);

  document.querySelectorAll('input[name="predefinedOption"]').forEach(function(r){
    r.addEventListener('change',function(){
      selectPreset(this.value);
    });
  });

  greenInput.addEventListener('input',function(){
    document.getElementById('custom').checked=true;
    current='custom';
    render();
  });

  yellowInput.addEventListener('input',function(){
    document.getElementById('custom').checked=true;
    current='custom';
    render();
  });

  redInput.addEventListener('input',function(){
    document.getElementById('custom').checked=true;
    current='custom';
    render();
  });

  dqInput.addEventListener('input',function(){
    document.getElementById('custom').checked=true;
    current='custom';
    render();
  });

  controlButton.addEventListener('click',function(){
    running?stopTimer():startTimer();
  });

  resetButton.addEventListener('click',resetTimer);

  document.addEventListener('keydown',function(e){
    if(e.code==='Space'){
      e.preventDefault();
      running?stopTimer():startTimer();
    }
  });

  if(showClock){
    showClock.addEventListener('change',function(){
      clock.style.visibility=this.checked?'visible':'hidden';
    });
  }

  if(infoButton&&info){
    infoButton.addEventListener('click',function(){
      info.style.display='flex';
      setTimeout(function(){info.style.opacity='1'},10);
    });
    info.addEventListener('click',function(e){
      if(e.target===info){
        info.style.opacity='0';
        setTimeout(function(){info.style.display='none'},180);
      }
    });
  }

  render();
});
