// dummy play video check
/*document.getElementById("play").addEventListener("click", async () => {

  try {

    const res = await fetch("http://127.0.0.1:8000/movie/project");
    const data = await res.json();

    if (data.found) {
      window.electronAPI.openVideo(data.name);
    }

  } catch (err) {
    console.error("API ERROR:", err);
  }

});*/
let longitude;
let latitude;
const now = new Date();

const day = now.getDay(); // 0–6
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let hours = now.getHours();
const minutes = now.getMinutes();
const seconds = now.getSeconds();

const ampm = hours >= 12 ? "PM" : "AM";

// convert 24h → 12h format
hours = hours % 12 || 12;

const time = `${hours}:${minutes}`;
const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
if(ampm=="AM"){
  document.getElementById("am").style.backgroundColor="black";
  document.getElementById("pm").style.backgroundColor="transparent";
}
else{
  document.getElementById("pm").style.backgroundColor="black";
  document.getElementById("am").style.backgroundColor="transparent";

}
document.getElementById("time").innerHTML=time;
document.getElementById("day").innerHTML =
  `${now.getDate()}  ${weekdays[day]} .• ${months[now.getMonth()]} .• ${now.getFullYear()}`;
function getlocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
           latitude=position.coords.latitude;
          longitude=position.coords.longitude;

          if (longitude!=null&&latitude!=null){

    getweatherbylocation(latitude,longitude)
  }
          },
          (error) => {
            console.error("Error Code = " + error.code + " - " + error.message);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
     
}
window.addEventListener("DOMContentLoaded", () => {
  getlocation();
});

const audio=document.getElementById("musicplayer");
const thumbnail=document.getElementById("thumbnail");
const title=document.getElementById("title");
async function playmusic(name){
    try{
        const res=await fetch(`http://127.0.0.1:8000/music/${name}`);
        const data=await res.json();

       if (data.found) {

      // SET MUSIC FILE
      audio.src = `../music/${data.file}`;

      audio.load();

      // RESUME FROM LAST TIME
      audio.addEventListener("loadedmetadata", () => {

      audio.play().catch(console.log);
      thumbnail.style.backgroundImage=`url('../thumbnails/${data.thumbnail}')`;
      title.innerHTML=data.name.slice(0,18) + "...";

      }, { once: true });

    }
    
    else {

      console.log("Music not found");

    }

  } catch (err) {

    console.log("Fetch error:", err);

  }

}
document.getElementById("pla").addEventListener("click",()=>{
    playmusic("mountain");
})



function weathericon(description){
    const desc=["clear sky","few clouds","scattered clouds","broken clouds","shower rain","rain","thunderstorm","snow","mist","overcast clouds","light rain","moderate rain","heavy intensity rain","haze","light intensity shower rain"];
    const descicon=['<i class="fa-solid fa-sun"></i>','<i class="fa-solid fa-cloud-sun"></i>','<i class="fa-solid fa-smog"></i>','<i class="fa-solid fa-cloud"></i>','<i class="fa-solid fa-cloud-rain"></i>','<i class="fa-solid fa-umbrella"></i>','<i class="fa-solid fa-cloud-bolt"></i>','<i class="fa-regular fa-snowflake"></i>','<i class="fa-solid fa-cloud-meatball"></i>','<i class="fa-solid fa-cloud-sun"></i>','<i class="fa-solid fa-cloud-rain"></i>','<i class="fa-solid fa-cloud-showers-heavy"></i>','<i class="fa-solid fa-cloud-bolt"></i>','<i class="fa-solid fa-cloud-meatball"></i>','<i class="fa-solid fa-cloud-showers-heavy"></i>'];
    const position=desc.indexOf(description);
    return descicon[position];
}


function desc(description){
const quote=[" it's a nice weather outside.","Clouds are beautiful outside","Don't forget your umbrella","Winds are speedy today","Look plants can dance too.","Weather is getting watery.","Avoid going out it's lightning.","Nice day for a snowman.","Drive safe low visibility","It could rain just wait","Nice time for a tea","Outside is beautiful in rain.","Heavy rain avoid going out today","It may be foggy outside","Raining slowly carry an umbrella."];
const desc=["clear sky","few clouds","scattered clouds","broken clouds","shower rain","rain","thunderstorm","snow","mist","overcast clouds","light rain","moderate rain","heavy intensity rain","haze","light intensity shower rain"];
const position=desc.indexOf(description);
return quote[position];
};
function getcity(){

}
const apikey="771268cf58226d55a8385e574cac8de9";
/*get weather by location*/
async function getweatherbylocation(lat,lon){
    try{
const url=`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
const url2=`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;
const response=await fetch(url);
const response2=await fetch(url2);
var data=await response.json();
var data2=await response2.json();
console.log(data2);
setdetails(data2);

}
catch(err){
    document.getElementById("temp").innerHTML="🤕";
    document.getElementById("location").innerHTML="Location data is unavailable..";
    console.log(err);
}
}


/*getting weather by city name*/

async function getweatherbycity(cityname){
    try{
const url=`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apikey}&units=metric`;
const url2=`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apikey}&units=metric`;
const response=await fetch(url);
const response2=await fetch(url2);
var data=await response.json();
var data2=await response2.json();
console.log(data);
console.log(data2);
document.getElementById("citytemp").innerHTML=data2.main.temp;
document.getElementById("tempicon1").innerHTML=weathericon(data2.weather[0].description);
document.getElementById("loader").style.display="none";

}
catch(err){
    document.getElementById("temp").innerHTML="🤕";
    document.getElementById("location").innerHTML="City not found..";
    document.getElementById("description").innerHTML="Remove end spaces if any and try again...";
console.log(err)


}
}

function setdetails(data){
  console.log(data);
   const description=data.weather[0].description;
  fg="humidity is "+data.main.humidity+"% with "+data.weather[0].description;
  document.getElementById("temp").innerHTML=Math.round(data.main.temp)+" °";
  document.getElementById("location").innerHTML=data.name +", "+data.sys.country;
  document.getElementById("desc").innerHTML=data.weather[0].main;
  document.getElementById("feels").innerHTML="Feels Like "+Math.round(data.main.feels_like)+"°";
  document.getElementById("hilo").innerHTML="Low: "+Math.round(data.main.temp_min)+"°"+" | "+"High: "+Math.round(data.main.temp_max)+"°";
 document.getElementById("desc2").innerHTML=desc(description)+". "+fg;
 document.getElementById("ic").innerHTML=weathericon(description)
}
 
function openweatherconsole(){


}

// speechrecognition functions
const SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

if (!SpeechRecognition) {
  console.log("Speech Recognition not supported");
}
console.log(window.webkitSpeechRecognition);
const recognition = new SpeechRecognition();
recognition.lang = "en-IN";
function openassistant(){
    recognition.start();
    };
recognition.onstart=function(){ 
  console.log("speech started")

    document.getElementById("sd").classList.add("active");
    document.getElementById("sg").classList.add("active2");

    };
    recognition.onerror = (event) => {
  console.log("ERROR:", event.error);
};
 recognition.onend=function(){
  console.log("speech ended")
    document.getElementById("sd").classList.remove("active");
    document.getElementById("sg").classList.remove("active2");
  }
    
    recognition.onresult=(event)=>{
    const transcript=String(event.results[0][0].transcript).toLowerCase();

    console.log(transcript);
    }

    function closeassistant(){
    recognition.stop();
}
document.getElementById("animation").addEventListener("click",()=>{
  openassistant();
})