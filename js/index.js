var myApp = angular.module('myApp', [])

    .controller('myController', function($scope) {
  
        // we will store our form data in this object
        $scope.pickup = "";
        $scope.dropOff = "";
});

$(document).ready(function(){

var total = $(".outerbox")[0].scrollWidth - $(".outerbox").width();
var width = $(".outerbox").width();	
console.log(width);

var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
$('#features').animateNumber(
  {
    number: 10,
    numberStep: comma_separator_number_step
  }, 1000
);
$('#examples').animateNumber(
  {
    number: 8000000,
    numberStep: comma_separator_number_step
  }, 1000
);
$(".slide").width(width);
$(".outerbox").scroll(function() {
     // use the value from $(window).scrollTop();
     console.log(" in scroll")
    // console.log($(".outerbox").scrollLeft());
     var per = $(".outerbox").scrollLeft(); 
     
     var value = ((per * width) / total);
     value = Math.max(0, value);
     $(".taxi").css({left : value});
     // $(".taxi").scrollLeft($(".outerbox").scrollLeft())
 });

$('.front').click(function (e) {
	console.log("hello");
    var $card = $(this).parent();
    $(".header").css("display", "none")
    $(".slide").css("display", "block");
    $(".taxi").css("display", "block");
    if ($card.hasClass("flipped")) {
        $card.removeClass('flipped');
    } else {
        $card.addClass('flipped');
    }
    width = $('#graph1').width();
	height = $('#graph1').height();
	drawGraph(width, height);
	$(".outerbox").css("overflow", "auto");
});

});
