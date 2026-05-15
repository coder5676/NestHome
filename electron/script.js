// dummy play video check
document.getElementById("weathericon").addEventListener("click", async () => {

  try {

    const res = await fetch("http://127.0.0.1:8000/movie/project");
    const data = await res.json();

    if (data.found) {
      window.electronAPI.openVideo(data.name);
    }

  } catch (err) {
    console.error("API ERROR:", err);
  }

});
let longitude;
let latitude;
const now = new Date();
let ampm;
const day = now.getDay(); // 0–6
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

 ampm = hours >= 12 ? "PM" : "AM";

  // convert 24h → 12h format
  hours = hours % 12 || 12;

  const time = `${hours < 10 ? "0" + hours : hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;

  document.getElementById("time").innerText = time;

   // Date

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
  // Day name
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];



  // Update DOM

  document.getElementById("day").innerHTML =
  `${now.getDate()}  ${weekdays[day]} .• ${months[now.getMonth()]} .• ${now.getFullYear()}`;
}

// run immediately
updateClock();
// update every second
setInterval(updateClock, 1000);


if(ampm=="AM"){
  document.getElementById("am").style.backgroundColor="black";
  document.getElementById("pm").style.backgroundColor="transparent";
}
else{
  document.getElementById("pm").style.backgroundColor="black";
  document.getElementById("am").style.backgroundColor="transparent";

}

async function getlocation() {
  try {
    // Using ipapi.co because it allows free HTTPS requests
    const res = await fetch("http://ipapi.co");
    
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    
    const data = await res.json();

    // ipapi.co uses full names: 'latitude' and 'longitude'
    let latitude = data.latitude;
    let longitude = data.longitude;

    console.log("Coordinates fetched:", longitude, latitude);

    if (latitude && longitude) {
      getweatherbylocation(latitude, longitude);
    } else {
      console.log("Location keys missing from response, using fallback");
      getweatherbycity("Raebareli");
    }

  } catch (error) {
    console.error("IP location error:", error);
    // Fallback if API fails or network is down
    getweatherbycity("Raebareli");
  }
}

// Ensure the code executes safely in Electron's lifecycle
if (document.readyState === "loading") {
  window.addEventListener("DOMContentLoaded", getlocation);
} else {
  getlocation();
}

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
setdetails(data2)

}
catch(err){
    document.getElementById("temp").innerHTML="🤕";
    document.getElementById("location").innerHTML="City not found..";
console.log(err)


}
}

function setdetails(data){
  console.log(data);
   const description=data.weather[0].description;
  fg="humidity is "+data.main.humidity+"% with "+data.weather[0].description;
  document.getElementById("temp").innerHTML=Math.round(data.main.temp)+"°";
  document.getElementById("location").innerHTML=data.name +", "+data.sys.country;
  document.getElementById("desc").innerHTML=data.weather[0].main;
  document.getElementById("feels").innerHTML="Feels Like "+Math.round(data.main.feels_like)+"°";
  document.getElementById("hilo").innerHTML="Low: "+Math.round(data.main.temp_min)+"°"+" | "+"High: "+Math.round(data.main.temp_max)+"°";
 document.getElementById("desc2").innerHTML=desc(description)+". "+fg;
 document.getElementById("ic").innerHTML=weathericon(description)
}
 
function openweatherconsole(){


}
console.log(window.electronAPI);
document.getElementById("animation").addEventListener("click",()=>{
  console.log("animation button clicked");
  window.electronAPI.start();
})
/*window.voiceAPI.onResult((text) => {
  console.log("You said:", text);
  document.getElementById("prompt").innerText = text;

  handleCommand(text);
});*/

