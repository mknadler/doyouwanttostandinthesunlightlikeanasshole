afterDisplay = null;
nightTime = null;
dayTime = null;

$(function() {
  $(".cloud").addClass("animate-cloudToLeft");
  function afterDisp() {
    $(".time").css("display", "inline-block");
  }
  afterDisplay = afterDisp;
  function isNight() {
    $(".svg-container").addClass("moon");
    $("html").addClass("moon");
  }
  nightTime = isNight;
  function isDay() {
    $(".svg-container").addClass("day");
  }
  dayTime = isDay;
});
var z=document.getElementById("howlong");
function sunsetCalc(){
  getSunset();
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
    var gmorningtoya = when.sunrise;
    var difference = then - now;
    var seconds = Math.floor(difference / 1000);
    var numhours = Math.floor(seconds / 3600);
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    if (difference < 0) {
      numhours = numhours * -1;
      numminutes = numminutes * -1;
      numseconds = numseconds * -1;
      z.innerHTML = "Oh no! The sun set</p><p>" + numhours + " hours, " + numminutes + " minutes,</p><p> and " + numseconds + " seconds ago!";
      nightTime();
    }
    else if (numhours <=2 && numhours >= 1) {
      z.innerHTML = "Better hurry! You have</p><p>" + numhours + " hours, " + numminutes + " minutes, </p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    else if (numhours < 1) {
      z.innerHTML = "Better hurry! You have</p><p>" + numminutes + " minutes,</p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    else if (numhours >=2) {
      z.innerHTML = "<p>You have</p><p>" + numhours + " hours, " + numminutes + " minutes, </p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    afterDisplay();
}