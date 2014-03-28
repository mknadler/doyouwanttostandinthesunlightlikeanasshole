/*
 _      _ 
| |__  (_)
| '_ \ | |
| | | || |
|_| |_||_|
                 
*/
//    A lot of this is probably already obvious to you.
//    I erred on the side of thoroughness partially to make sure
//    that I actually know how everything works!   -- Miri

// 'creating' the jQuery functions as empty objects
// so that we can call them from JavaScript
afterDisplay = null;
nightTime = null;
dayTime = null;

// jQuery functions

// the first line -- $(function(){ -- is jQuery shorthand
/* 
$(function() { 
~*~thecode~*~
})

is the same as 

$(document).ready(function(){
~*~thecode~*~
})
*/
$(function() {
  // afterDisp() reveals the cloud with the time in it
  // By default, div.time is set to display: none
  // If it weren't, it'd be an ugly, empty, tiny cloud 
  function afterDisp() {
    $(".time").css("display", "inline-block");
  }
  // I don't know why this next line works! I'm going to ask Sophie tomorrow.
  // It's part of letting JavaScript call the jQuery function.
  afterDisplay = afterDisp;
  // isNight() and isDay() add classes to HTML elements
  // the HTML elements already have CSS styles written for them
  // So once .svg-container has the class 'moon',
  // the CSS for .svg-container.moon is applied
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

//This stores #howlong as a variable so we can work with it later.
var z=document.getElementById("howlong");

//This is actually *currently* not necessary.
//Previous, I had split it off this way so that
//I could call multiple functions from a single on-click
//You CAN call multiple functions by doing "onclick: function, function"
//in the HTML, but doing it that way hurts maintainability
//I'm leaving this here for now because I am probably going to call multiple functions from here later
function sunsetCalc(){
  getSunset();
}

function getSunset()
  {
    // Check if the current browser supports HTML5 geolocation
    // If it does, run the function showSunset and pass that function the user's position
    // If it doesn't, throw an error message
    if (navigator.geolocation)
      {navigator.geolocation.getCurrentPosition(showSunset);}
    else
      {y.innerHTML="Geolocation is not supported by this browser.";}
  }  
function showSunset(position)
      {
    // Using the geolocation information passed in from getSunset,
    // Store the user's latitude + longitude as variables so that they can be modified
    var la = position.coords.latitude;
    var lo = position.coords.longitude;
    // Make a new Date object named 'now'
    // this will be the user's current system date
    var now = new Date();
    // Make a new Date object named 'when' that contains all of the information provided
    // by SunCalc
    var when = SunCalc.getTimes(new Date(), la, lo);
    // Make a new variable, 'then', that pulls the sunset time from the la/lo info
    var then = when.sunset;
    // Same as above for sunrise; this isn't being used yet,
    // But I will be adding code to account for
    // someone checking the site after midnight
    // but before sunrise
    var gmorningtoya = when.sunrise;
    // Subtract the current time in milliseconds
    // from the sunset time for the current date in milliseconds
    // and store the result as a variable, 'difference'
    var difference = then - now;
    // Divide milliseconds by 1000 to get seconds
    // the floor part just rounds it down to the nearest whole unit
    // Nobody cares if there are 12.19491391 seconds left until sunset
    var seconds = Math.floor(difference / 1000);
    // Divide seconds by 3600 to get hours
    var numhours = Math.floor(seconds / 3600);
    // Get the remainder of the division of #seconds and 3600
    // so if there are 3900 seconds until sunset
    // the first part will resolve to '300'
    // and then the second part converts that from minutes into seconds
    // Figuring out the remainder is what makes it so that
    // Instead of telling people "you have ~4 hours = 240 minutes = whatever seconds"
    // we're telling them the time in hours, minutes and seconds
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    // If the difference variable is a negative number, it means that
    // the current time in millisecs is a larger number than the sunset time in millisecs
    // if that is the case, it is after sunset
    if (difference < 0) {
      // Multiply the values we figured out above by -1 for presentation purposes;
      // nobody cares if there are -12 seconds left until sunset
      numhours = numhours * -1;
      numminutes = numminutes * -1;
      numseconds = numseconds * -1;
      z.innerHTML = "Oh no! The sun set</p><p>" + numhours + " hours, " + numminutes + " minutes,</p><p> and " + numseconds + " seconds ago!";
      // Run the jQuery function nightTime()
      nightTime();
    }
    // This one is just flavor.
    else if (numhours <=2 && numhours >= 1) {
      z.innerHTML = "Better hurry! You have</p><p>" + numhours + " hours, " + numminutes + " minutes, </p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    // If there's less than an hour left, we don't want to say "0 hours", so that's excluded
    else if (numhours < 1) {
      z.innerHTML = "Better hurry! You have</p><p>" + numminutes + " minutes,</p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    // We only *really* need this one here and the one before it.
    // I actually want to add more. Some easter eggs.
    // "if (numhours == 6 && numminutes == 6 $$ numseconds == 6) {
    // 'hail satan! you have numhours hours + numminutes minutes + numseconds seconds left
    // with which to serve her evilness'
    // or w/e
    else if (numhours >=2) {
      z.innerHTML = "<p>You have</p><p>" + numhours + " hours, " + numminutes + " minutes, </p><p> and " + numseconds + " seconds</p><p>of sunlight left!";
      dayTime();
    }
    // This isn't in the if/else set because it is always going to run
    // (this is just the function which makes the result visible on the page)
    afterDisplay();
}