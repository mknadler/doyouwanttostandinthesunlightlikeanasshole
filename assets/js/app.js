// Declaring variables at global scope so that they can be used througout the script 
var about = $(".about span");
var output = $("#howlong");
var sun = $(".sun-selector");
var cloudparts = $(".opencloud.cloud, .opencloud.cloud::after, .opencloud.cloud::before");

// Prime everything.
$(function(){
	$(".cloudlayer .cloud").addClass("animate-cloudToLeft");
	sun.click(geolocate);
    $("a.info-open").click(function(){
        $(".pane").addClass("full");
    });
    $("a.info-close").click(function(){
        $(".pane").removeClass("full");
    })
});

// Grab geolocation data & pass the Position object
// created by the geolocation API to the sunsetCalc function
var geolocate = function(isfirst) {
    about.animate({"opacity":"0"}, 400);
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
    var yesterday = new Date();
    tomorrow.setDate(now.getDate()+1);
    yesterday.setDate(now.getDate()-1);
    var tomorrow_times = SunCalc.getTimes(tomorrow, latitude, longitude);
    var yesterday_times = SunCalc.getTimes(yesterday, latitude, longitude);

    var now_hours = now.getHours();

    var difference = null;
    var remainder = {};

    if (now_hours == 0){
        // N.B.: SunCalc parses hour 0 (aka midnight -> 1am) as part of the previous day
        remainder.isDay = false;
        difference = tomorrow_times.dawn - now;
        barGraph((tomorrow_times.dawn - now_times.dusk), (now - now_times.dusk), false);
    } else {
        if (now > now_times.dawn && now < now_times.dusk) {
            remainder.isDay = true;
            difference = now_times.dusk - now;
            barGraph((now_times.dusk - now_times.dawn), (now-now_times.dawn), true);
        } else if (now > now_times.dusk && now > now_times.dawn) { // dusk --> midnight
            remainder.isDay = false;
            difference = tomorrow_times.dawn - now;
            barGraph((tomorrow_times.dawn - now_times.dusk), (now - now_times.dusk), false);
        } else if (now_times.dawn > now) { // 1am --> dawn
            remainder.isDay = false;
            difference = now_times.dawn - now;
            barGraph((now_times.dawn - yesterday_times.dusk), (now - yesterday_times.dusk), false);
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
               $("#hours").text(remainder.numhours);
               $("#minutes").text(remainder.numminutes);
               $("#seconds").text(remainder.numseconds);
            } else {
               $("#hours").text(remainder.numhours);
               $("#minutes").text(remainder.numminutes);
               $("#seconds").text(remainder.numseconds);
            }
            $(".svg-container").addClass("day");
            $("body").addClass("day");
            break;
        case false : 
            if (remainder.numhours > 0) {
               $("#hours").text(remainder.numhours);
               $("#minutes").text(remainder.numminutes);
               $("#seconds").text(remainder.numseconds);
            } else {
               $("#hours").text(remainder.numhours);
               $("#minutes").text(remainder.numminutes);
               $("#seconds").text(remainder.numseconds);
            }
            $(".svg-container").addClass("moon");
            $("html").addClass("moon");
            $("#output-type").text(" until dawn.");
            break;
    }

    $(".time").css("display", "inline-block");
    $(".bottom-words").remove();
    $(".about").remove();
    $(".output").animate({"opacity":"1"}, 400);
}

var barGraph = function (whole, elapsed, isDay){

    var elapsedPercent = Math.floor(100*(elapsed/whole));
    var remainingPercent = 100-(Math.floor(100*(elapsed/whole)));

    // given numerals 1 to 99, get text
    function numToWords(num) {
        var singleDigit = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        var doubleDigit = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        var teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        var digits = num.toString().split('');
        for (i = 0; i<digits.length; i++) {
            digits[i] = +digits[i];
        }
        if (digits.length === 2){ // >10
            if (digits[0] >= 2) { // >20
                if (digits[1] != 0) { //NOT 20, 30, 40, 50, etc.
                    var output = doubleDigit[digits[0]].toString() + "-" + singleDigit[digits[1]].toString();
                } 
                else { // IS 20, 30, 40, 50, etc.
                    var output = doubleDigit[digits[0]].toString();
                }
            } 
            else { // 10-19
                var output = teens[digits[1]].toString();
            }
        } 
        else if (digits.length === 1){ // 1 - 9
            var output = singleDigit[digits[0]].toString();
        }
        return output;
    }
    if (isDay) {
        $('.bar-words').text(numToWords(elapsedPercent) + " percent of the way to dusk");
    } else {
        $('.bar-words').text(numToWords(elapsedPercent) + " percent of the way to dawn");
        $('#left-bar').text("dusk");
        $('#right-bar').text("dawn");
    }

    $('#sunmarker').css("left", elapsedPercent+"%");
    $(".bar").animate({"opacity":"1"}, 2000);
}