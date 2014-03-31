afterDisplay = null;
nightTime = null;
dayTime = null;
afterDisplay = function (){
   $(".time").css("display", "inline-block");
}
$(function() {
  $(".cloud").addClass("animate-cloudToLeft");
/*
  function afterDisp() {
    $(".time").css("display", "inline-block");
  }
  afterDisplay = afterDisp;
*/
  function isNight() {
    $(".svg-container").addClass("moon");
    $("html").addClass("moon");
    $(".about span, #howlong").css("color", "#DDD");
    $(".about span").css("opacity", "0");
    $("#howlong").css("opacity", "1");
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
    if (gmorningtoya > now) {
      z.innerHTML = "It isn't even sunrise yet, calm down!";
      nightTime();
    }
    else if (difference < 0) {
      numhours = numhours * -1;
      numminutes = numminutes * -1;
      numseconds = numseconds * -1;
      z.innerHTML = "Oh no! The sun set " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds ago!";
      nightTime();
    }
    else if (numhours <=2 && numhours >= 1) {
      z.innerHTML = "Better hurry! You have " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!";
      dayTime();
    }
    else if (numhours < 1) {
      z.innerHTML = "Better hurry! You have " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!";
      dayTime();
    }
    else if (numhours >=2) {
      z.innerHTML = "You have " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!";
      dayTime();
    }
    afterDisplay();
}