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

    var now_times = SunCalc.getTimes(new Date(), latitude, longitude);

    var tomorrow = new Date();
    tomorrow.setDate(now.getDate()+1);
    var tomorrow_times = SunCalc.getTimes(tomorrow, latitude, longitude);

    var now_hours = now.getHours();

    var difference = null;
    var remainder = {};

    if (now_hours == 0){
        // N.B.: SunCalc parses hour 0 (aka midnight -> 1am) as part of the previous day
        remainder.isDay = false;
        difference = tomorrow_times.dawn - now;
    } else {
        if (now > now_times.dawn && now < now_times.dusk) {
            remainder.isDay = true;
            difference = now_times.dusk - now;
        } else if (now > now_times.dusk && now > now_times.dawn) {
            remainder.isDay = false;
            difference = tomorrow_times.dawn - now;
        } else if (now_times.dawn > now) {
            remainder.isDay = false;
            difference = now_times.dawn - now;
        }
    }

    var convertToHoursMins = function(diff) {
        remainder.inseconds = Math.floor(diff/1000);
        remainder.numminutes = Math.floor((remainder.inseconds % 3600) / 60);
        remainder.numhours = Math.floor(remainder.inseconds / 3600);
        remainder.numseconds = Math.floor((remainder.inseconds % 3600) % 60);
        return;
    }

    convertToHoursMins(difference);

    switch(remainder.isDay) {
        case true : 
            if (remainder.numhours > 0) {
                output.text("You have " + remainder.numhours + " hours and " + remainder.numminutes + " minutes until dusk.");
            } else {
                output.text("You have " + remainder.numminutes + " minutes until dusk.");
            }
            $(".svg-container").addClass("day");
            barGraph(now_times, remainder.numhours, remainder.numminutes);
            break;
        case false : 
            if (remainder.numhours > 0) {
                output.text("You have " + remainder.numhours + " hours and " + remainder.numminutes + " minutes until dawn.");
            } else {
                output.text("You have " + remainder.numminutes + " minutes until dawn.");
            }
            $(".svg-container").addClass("moon");
            $("html").addClass("moon");
            $(".about span, #howlong").css("color", "#DDD");
            break;
    }

    $(".time").css("display", "inline-block");
    output.fadeIn(1200);
    about.empty();
}

var barGraph = function (all_times, numhours, numminutes){
    //console.log("barGraph ran");

    var toTotalMinutes = new Function("hours", "minutes", "return hours*60 + minutes");
    var timesArray = [all_times.dawn, all_times.dusk, all_times.night, all_times.nightEnd, all_times.solarNoon]
    for (var i = 0; i<=4; i++) { 
        timesArray[i] = toTotalMinutes(timesArray[i].getHours(),timesArray[i].getMinutes());
    } 
    var dawn = timesArray[0];
    var dusk = timesArray[1];
    var night = timesArray[2];
    var nightEnd = timesArray[3];
    var solarNoon = timesArray[4];

    var now = new Date();
    var nowhrs = (60 * now.getHours()) + now.getMinutes();

    var total_bar_width = night - nightEnd;
    var dawn_percentage = (dawn-nightEnd)/total_bar_width;
    var dusk_percentage = (dusk-nightEnd)/total_bar_width;
    var noon_percentage = (solarNoon-nightEnd)/total_bar_width;

    var now_percentage = (nowhrs-dawn)/total_bar_width;

    before_dawn = 100 * dawn_percentage;
    dawn_to_noon = 100 * (noon_percentage-dawn_percentage);
    noon_to_dusk = 100 * (dusk_percentage-noon_percentage);
    at_dusk = Math.round((1 - (before_dawn+dawn_to_noon+noon_to_dusk)));
        console.log(at_dusk)
    duskbar = 100-(-1*at_dusk);
    adjusted_dusk = 100 - (before_dawn+dawn_to_noon+noon_to_dusk);

    $(".bargraph").fadeIn();
    $("#before-dawn").width(before_dawn+"%");
    $("#dawn-to-noon").width(dawn_to_noon+"%");
    $("#noon-to-dusk").width(noon_to_dusk+"%");
    $("#dusk").width(adjusted_dusk+"%");
    $("#elapsed").width(100*now_percentage+"%");

}