afterDisplay = null;

$(function() {
  function afterDisp() {
    $(".time").css("display", "inline-block");
  }
  afterDisplay = afterDisp;
})


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
    var seconds = Math.floor(difference / 1000);
    var numhours = Math.floor(seconds / 3600);
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    if (difference < 0) {
      numhours = numhours * -1;
      numminutes = numminutes * -1;
      numseconds = numseconds * -1;
      z.innerHTML = "Oh no! The sun set</p><p>" + numhours + " hours, " + numminutes + " minutes, </p><p> and " + numseconds + " seconds ago!";
    }
    afterDisplay();
}
