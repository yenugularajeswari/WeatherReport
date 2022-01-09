
const apiKey = "91cb80435e51aa4064fe99b941012a0b";


async function weatherInfo(city){
    const res = await fetch('http://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=metrics&appid=' +apiKey)
    const data = await res.json();
   // console.log("by city: ", data);
    if(data.cod == 200){
        this.displayWeather(data);
        this.nextDayForcast(data.coord.lat, data.coord.lon);
        document.querySelector('.errorMsg').innerHTML='';
        document.querySelector('.searchBlock').classList.remove('error');
    }
    else{
        document.querySelector('.errorMsg').innerHTML=data.message;
        document.querySelector('.searchBlock').classList.add('error');
    }
    }


function search(){
    let city= document.querySelector('.searchBar').value
    this.weatherInfo(city);
    }

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition,showError);
  } else {
   document.querySelector('#demo').innerHTML= "Geolocation is not supported by this browser.";
   document.querySelector('#main').classList.add('hide');
  }
}

function showPosition(position) {
  //console.log( "Latitude: " + position.coords.latitude +"Longitude: " + position.coords.longitude);
    lat=position.coords.latitude;
    lon=position.coords.longitude;
    document.querySelector('#main').classList.remove('hide');
    weatherByCoords(lat,lon);
    
}
function showError(error){
    let mainBlock = document.querySelector('#main');
    mainBlock.innerHTML='';
    switch(error.code){
        case error.PERMISSION_DENIED:
            document.querySelector('#demo').innerHTML="User denied the request for Geolocation."
        
        break;
        case error.POSITION_UNAVAILABLE:
            document.querySelector('#demo').innerHTML="Location information is unavailable."
        break;
        case error.TIMEOUT:
            document.querySelector('#demo').innerHTML="The request to get user location timed out."
        break;
        case error.UNKNOWN_ERROR:
            document.querySelector('#demo').innerHTML="An unknown error occurred."
        break;
    }
}
async function weatherByCoords(lat,long){
     const res = await fetch('https://api.openweathermap.org/data/2.5/weather?lat='+ lat +'&lon='+ long +'&appid=' + apiKey)
     const data = await res.json();
     //console.log(data);
     
     if(data.cod == 200){
        this.displayWeather(data);
        this.nextDayForcast(lat,long);
    }
    else{
        document.querySelector('.demo').innerHTML=data.message;
    }
    }
function displayWeather(data){
    const {name} = data
    const {speed} = data.wind;
    const {icon, description} =data.weather[0];
    const {temp, humidity, temp_min, temp_max} = data.main;
    const {dt} = data;
    let date= new Date(dt * 1000);
    let day = date.getDate();
    let year = date.getFullYear();
    let dayName = date.toString().split(' ')[0]
    let mon= date.toLocaleString('default', { month: 'short' });
    let tempMax = Math.round(temp_max - 273.15);
    let tempMin = Math.round(temp_min - 273.15);
    let sunrise = new Date(data.sys.sunrise * 1000);
    let sunset = new Date(data.sys.sunset * 1000);

    document.querySelector('.city').innerHTML=name;
    //document.querySelector('.icon').src="https://openweathermap.org/img/wn/" + icon + "@2x.png";
    document.querySelector('.temp').innerHTML= Math.round(temp - 273.15);
   // document.querySelector('.desc').innerHTML=description;
    document.querySelector('.date').innerHTML=day +' ' + mon + ', ' + dayName ;
    document.querySelector('.tempMax').innerHTML = tempMax + '°';
    document.querySelector('.tempMin').innerHTML =  tempMin +'°';
    document.querySelector('.wind').innerHTML = speed;
    document.querySelector('.humidity').innerHTML = humidity;
    document.querySelector('.sunrise').innerHTML = sunrise.getHours()+ ' : ' + sunrise.getMinutes();
    document.querySelector('.sunset').innerHTML = sunset.getHours()+ ' : ' + sunset.getMinutes();
 }
 async function nextDayForcast(lat,lon){
    const res1 = await fetch('https://api.openweathermap.org/data/2.5/onecall?lat='+ lat +'&lon='+ lon +'&appid=' + apiKey);
    
    if(res1.status == 200){
        const data1 = await res1.json();
        document.getElementById('report').innerHTML="";
        data1.hourly.filter((i, index) => (index < 24))
        .map((hourData, index) => {
                let time = (new Date(hourData.dt * 1000)).getHours();
                let td = document.createElement('td');
                let row = document.getElementById('report');
                let temp = Math.round(hourData.temp - 273.15);
                let icon = hourData.weather[0].icon;
                let desc = hourData.weather[0].description;
                let ampm = time >= 12 ? 'pm' : 'am';
                let timeInhours = ((time + 11) % 12 + 1) + '<span>'+ ampm + '</span>';
                td.innerHTML = timeInhours + "</br><img src='https://openweathermap.org/img/wn/" + icon + "@2x.png'/>" +
                temp + "°"
                if(index < 1){
                    document.querySelector('.icon').src="https://openweathermap.org/img/wn/" + icon + "@2x.png";
                    document.querySelector('.desc').innerHTML=desc;
                }
                
                row.appendChild(td);
        })
    }
    else{
        document.querySelector('#demo').innerHTML=res1.message;
        
    }
    
       
 }
 document.addEventListener('DOMContentLoaded', () => { 

 
 document.querySelector(".searchBar").addEventListener("keyup", function (e) {

    if (e.key === "Enter") {  
      validate(e);
      
    }
   });
}); 
   function validate(e) {
    var text = e.target.value;
       if(text == ''){
           document.querySelector('.errorMsg').innerHTML='Please enter city';
       }
       else{
           alert("TEXT"+ text)
       this.search();
       }
       
   }


 
 this.getLocation();