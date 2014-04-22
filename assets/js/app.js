// Declaring variables at global scope so that they can be used througout the script 
var about = $(".about span");
var output = $("#howlong");
var sun = $(".sun-selector");

// Prime everything.

$(function(){
	$(".cloud").addClass("animate-cloudToLeft");
	sun.click(geolocate);
});

// Grab geolocation data & pass the Position object
// created by the geolocation API to the sunsetCalc function

var geolocate = function(isfirst) {	
	console.log("geolocate");
	if ($("body").hasClass("initial")) {
		about.text("Calculating...");
		$("body").removeClass("initial");
	}
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sunsetCalc);
	} else {
		alert("Sorry! Geolocation is not supported by this browser. We will be adding zip code functionality soon.")
	}
}

var sunsetCalc = function(position){
	console.log("sunsetcalc");
	// pull info from the Position object created by
	// the geolocation; run them through Sun Calc;
	// set up the variables we'll need later.
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var now = new Date();
	var all_times = SunCalc.getTimes(new Date(), latitude, longitude);
	var sunset_time = all_times.sunset;
	var sunrise_time = all_times.sunrise;
	
	// figure out the difference between
	// now and sunset 
	// & convert it to hours, minutes, and seconds
	var difference = sunset_time - now;
    var seconds = Math.floor(difference / 1000);
    var numhours = Math.floor(seconds / 3600);
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    
    // Output the time + change css classes
    // depending on whether it is daytime or nighttime
    if (sunrise_time > now) {
    	output.text("It isn't even sunrise yet!");
    } else if (difference < 0) {
    	numhours = numhours * -1;
      	numminutes = numminutes * -1;
      	numseconds = numseconds * -1;
      	output.text("Oh no! The sun set " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds ago!");	
    	$(".svg-container").addClass("moon");
    	$("html").addClass("moon");
    	$(".about span, #howlong").css("color", "#DDD");
    } else if (numhours <=2 && numhours >= 1) {
    	output.text("Better hurry! You have " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!");
    	$(".svg-container").addClass("day");
    } else if (numhours < 1) {
    	output.text("Better hurry! You have " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!");	
    	$(".svg-container").addClass("day");
    } else if (numhours >= 2) {
    	output.text("You have " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds of sunlight left!");
    	$(".svg-container").addClass("day");
    }
    // Hide the top text, show the bottom text
    about.empty();
    $(".time").css("display", "inline-block");
}