$( document ).ready(function() {
  $("#howlong").css("display", "none");
});


var z=document.getElementById("howlong");

function sunsetCalc(){
  getSunset();
  getLocation();
}

function getSunset()
  {
    if (navigator.geolocation)
      {navigator.geolocation.getCurrentPosition(showSunset);}
    else
      {y.innerHTML="Geolocation is not supported by this browser.";}
  }  
function showSunset(position)
      {
    var la = position.coords.latitude;
    var lo = position.coords.longitude;
    var now = new Date();
    var when = SunCalc.getTimes(new Date(), la, lo);
    var then = when.sunset;
    var difference = then - now;
    z.innerHTML = difference;
    var seconds = Math.floor(difference / 1000);
    var numhours = Math.floor(seconds / 3600);
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    if (difference < 0) {
      numhours = numhours * -1;
      numminutes = numminutes * -1;
      numseconds = numseconds * -1;
      z.innerHTML = numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds ago!";
      tooLate();
    }
   
}