// Declaring variables at global scope so that they can be used througout the script 
var about = $(".about span");
var output = $("#howlong");
var sun = $(".sun-selector");
var cloudparts = $(".opencloud.cloud, .opencloud.cloud::after, .opencloud.cloud::before");

// Prime everything.
$(function(){
	$(".cloudlayer .cloud").addClass("animate-cloudToLeft");
	sun.click(geolocate);
    $(".opencloud.cloud").click(function(){
        $(".pane").addClass("full");
    });
    $(".closecloud.cloud").click(function(){
        $(".pane").removeClass("full");
    })

});

// Grab geolocation data & pass the Position object
// created by the geolocation API to the sunsetCalc function
var geolocate = function(isfirst) {
    about.animate({"color": "#ffffcc", "opacity":"0"}, 400);
    $("body").css("cursor", "wait");
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(sunsetCalc);
	} else {
		alert("Sorry! Geolocation is not supported by your browser. We will be adding zip code functionality soon.")
	}
}

var sunsetCalc = function(position){
    $("body").css("cursor","auto");
    $("#sunner").animate({opacity: 1});
    output.hide();

	// pull info from the Position object created by
	// the geolocation; run them through Sun Calc;
	// set up the variables we'll need later.
	var latitude = position.coords.latitude;
	var longitude = position.coords.longitude;
	var now = new Date();
	var all_times = SunCalc.getTimes(new Date(), latitude, longitude);
	var sunset_time = all_times.dusk;
	var sunrise_time = all_times.dawn;
	// figure out the difference between
	// now and sunset 
	// & convert it to hours, minutes, and seconds
	var difference = sunset_time - now;
    var seconds = Math.floor(difference / 1000);
    var numhours = Math.floor(seconds / 3600);
    var numminutes = Math.floor((seconds % 3600) / 60);
    var numseconds = Math.floor((seconds % 3600) % 60);
    console.log(
        all_times.dawn + ": dawn, " +
        all_times.sunrise + ": sunrise," +
        all_times.solarNoon + ": solar noon, " +
        all_times.dusk + ": dusk, " + 
        all_times.sunset + ": sunset ,    " +
        all_times.sunriseEnd + " to " + all_times.goldenHourEnd + " is morning golden hour, " + 
        all_times.goldenHour + " to " + all_times.sunsetStart + " is evening golden hour."
    );
    // Output the time + change css classes
    // depending on whether it is daytime or nighttime
    console.log("difference: " + difference + "; sunset: " + sunset_time + " ; now: " + now + " ; sunrise: " + sunrise_time);
    if (sunrise_time > now) {
        var difference = sunrise_time - now;
        seconds = Math.floor(difference / 1000);
        numhours = Math.floor(seconds / 3600);
        numminutes = Math.floor((seconds % 3600) / 60);
        numseconds = Math.floor((seconds % 3600) % 60);
    	output.text("The sun is rising in " + numhours + " hours & " + numminutes + " minutes.");
        $(".svg-container").addClass("moon");
        $("html").addClass("moon");
        $(".about span, #howlong").css("color", "#DDD");
    } else if (difference < 0) {
        console.log("diff < 0");
        difference = difference * -1;
        seconds = Math.floor(difference / 1000);
        numhours = Math.floor(seconds / 3600);
        numminutes = Math.floor((seconds % 3600) / 60);
        numseconds = Math.floor((seconds % 3600) % 60);
        if (numhours >= 1) {
            output.text("Oh no! The sun set " + numhours + " hours, " + numminutes + " minutes, and " + numseconds + " seconds ago!");	
    	} else {
            output.text("Oh no! The sun set " + numminutes + " minutes and " + numseconds + " seconds ago!");  
        }
        $(".svg-container").addClass("moon");
    	$("html").addClass("moon");
    	$(".about span, #howlong").css("color", "#DDD");
    }
    else if (numhours <=2 && numhours >= 1) {
    	output.text("Better hurry! You have " + numhours + " hours, " + numminutes + " minutes, & " + numseconds + " seconds of sunlight left!");
    	$(".svg-container").addClass("day");
    } else if (numhours < 1) {
    	output.text("Better hurry! You have " + numminutes + " minutes, & " + numseconds + " seconds of sunlight left!");	
    	$(".svg-container").addClass("day");
    } else if (numhours >= 2) {
    	output.text("You have " + numhours + " hours, " + numminutes + " minutes, & " + numseconds + " seconds of sunlight left!");
    	$(".svg-container").addClass("day");
    }

    // Hide the top text, show the bottom text
    $(".time").css("display", "inline-block");
    output.fadeIn(1200);
    about.empty();
}