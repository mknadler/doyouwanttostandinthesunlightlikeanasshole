
$(function(){
// Globals
    var about = $(".about span");
    var output = $("#howlong");
    var sun = $(".sun-selector");
    var cloudparts = $(".opencloud.cloud, .opencloud.cloud::after, .opencloud.cloud::before");



var initiate = function(){
// Check if geolocation data was already grabbed & cached
// If it was, use that cached data; if not, grab the data.
    animationEffects.beforeGeo();
    position.exists() ? sunsetCalc(position.localPosition) : position.geolocate();
};

var animationEffects = (function() {
// Animation
    // Private
    function sunClicked() {
        about.animate({"opacity":"0"}, 400);
        $("body").css("cursor", "wait");
    }
    function showSun() {
        $("body").css("cursor","auto");
        $("#sunner").animate({opacity: 1});
        output.hide();
    }
        // Public
    return {
        beforeGeo : sunClicked,
        afterGeo : showSun
    };
}());

var position = (function() {
// Store latitude and longitude to prevent unneccesary geolocation lookups
    // Private
    var localPosition;

    function exists(){
        return this.localPosition!==undefined ? true : false;
    }

    function geolocate(){
        //console.time("geolocate");
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(location) {
                position.localPosition = location;

                sunsetCalc(location);
            });
        } else {
            alert("Sorry! Geolocation is not supported by your browser. We will be adding zip code functionality soon.");
        }
        //console.timeEnd("geolocate");
    }
    // Public
    return {
        exists: exists,
        geolocate: geolocate,
        localPosition: localPosition
    };

}());

var times = (function(){
    var today = new Date(),
        tomorrow = new Date(),
        yesterday = new Date(),
        days = [today, tomorrow, yesterday];
    yesterday.setDate(yesterday.getDate()-1);
    tomorrow.setDate(tomorrow.getDate()+1);
    
    function registerSunTimes(position) {
        for (var i = 0, max = days.length; i < max; i++){
            days[i].at = SunCalc.getTimes(days[i], position.coords.latitude, position.coords.longitude);
        }
    }
    function refreshTimes(){
        times.today = new Date();
        times.tomorrow = new Date();
        times.yesterday = new Date();
        times.yesterday.setDate(yesterday.getDate()-1);
        times.tomorrow.setDate(tomorrow.getDate()+1);
    }
    return {
        now: today,
        today: today,
        tomorrow: tomorrow,
        yesterday: yesterday,
        assign: registerSunTimes,
        refresh: refreshTimes
    }

}());

var sunsetCalc = function(position){

	// pull info from the Position object created by
	// the geolocation; run them through SunCalc;
	// set up the variables we'll need later.

    // Fire animation
    animationEffects.afterGeo();
    times.assign(position);

    var difference = null, remainder = {};
    var now = times.now;

    if (times.now.getHours() === 0){
        // N.B.: SunCalc parses hour 0 (aka midnight -> 1am) as part of the previous day
        remainder.isDay = false;
        difference = times.tomorrow.at.dawn - now;
        barGraph((times.tomorrow.at.dawn - times.today.at.dusk), (now - times.today.at.dusk), false);
    } else {
        if (now > times.today.at.dawn && now < times.today.at.dusk) {
            remainder.isDay = true;
            difference = times.today.at.dusk - now;
            barGraph((times.today.at.dusk - times.today.at.dawn), (now-times.today.at.dawn), true);
        } else if (now > times.today.at.dusk && now > times.today.at.dawn) { // dusk --> midnight
            remainder.isDay = false;
            difference = times.tomorrow.at.dawn - now;
            barGraph((times.tomorrow.at.dawn - times.today.at.dusk), (now - times.today.at.dusk), false);
        } else if (times.today.at.dawn > now) { // 1am --> dawn
            remainder.isDay = false;
            difference = times.today.at.dawn - now;
            barGraph((times.today.at.dawn - times.yesterday.at.dusk), (now - times.yesterday.at.dusk), false);
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


    $(".cloudlayer .cloud").addClass("animate-cloudToLeft");
    sun.click(initiate);
    $("a.info-open").click(function(){
        $(".pane").addClass("full");
    });
    $("a.info-close").click(function(){
        $(".pane").removeClass("full");
    });


});