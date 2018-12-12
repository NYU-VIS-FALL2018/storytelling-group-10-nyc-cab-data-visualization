var myApp = angular.module('myApp', [])

    .controller('myController', function($scope) {
  
        // we will store our form data in this object
        $scope.pickup = "Brooklyn";
        $scope.dropOff = "";
});

$(document).ready(function(){
  $("#graph6_borough").change(function(){
    $("#graph6").not("foreignobject").empty();
  //   $("#graph6").append("<foreignobject >"+               
  //  "<article class='clock'>"+
  //           "<div class='hours'></div>"+    
  //       "</article>"+
  //       "<select id='graph6_borough'>"+
  //               "<option>Brooklyn</option>"+
  //               "<option>Manhattan</option>"+
  //               "<option>Bronx</option>"+
  //               "<option>Staten Island</option>"+
  //               "<option>Queens</option>"+
  //           "</select>"+
        
// "</foreignobject>");
    width = $('#graph6').width();
    height = $('#graph6').height();
    angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup= $(this).children("option:selected").val();
	drawGraph6(width, height);
  });
  $('input[type=radio][name=question1]').change(function() {

    $("#graph6").not("foreignobject").empty();
//     $("#graph6").append("<foreignobject >"+               
//    "<article class='clock'>"+
//             "<div class='hours'></div>"+    
//         "</article>"+
//         "<select id='graph6_borough'>"+
//                 "<option>Brooklyn</option>"+
//                 "<option>Manhattan</option>"+
//                 "<option>Bronx</option>"+
//                 "<option>Staten Island</option>"+
//                 "<option>Queens</option>"+
//             "</select>"+
        
// "</foreignobject>");
    
    width = $('#graph6').width();
	  height = $('#graph6').height();
	drawGraph6(width, height);
  });
var total = $(".outerbox")[0].scrollWidth - $(".outerbox").width();
var width = $(".outerbox").width();	

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
     var per = $(".outerbox").scrollLeft(); 
     
     var value = ((per * width) / total);
     value = Math.max(0, value);
     $(".taxi").css({left : value});
     // $(".taxi").scrollLeft($(".outerbox").scrollLeft())
 });

$('.front').click(function (e) {
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
