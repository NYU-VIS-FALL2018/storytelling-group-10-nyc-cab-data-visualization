  var myApp = angular.module('myApp', [])

      .controller('myController', function($scope) {
          $scope.pickup = "ALL";
          $scope.dropOff = "ALL";
  });

  $(document).ready(function(){
    $("#graph6_borough").change(function(){
      $("#graph6").not("foreignobject").empty();
      width = $('#graph6').width();
      height = $('#graph6').height();
      angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup= $(this).children("option:selected").val();
    drawGraph6(width, height);
    });
    $('input[type=radio][name=question1]').change(function() {

      $("#graph6").not("foreignobject").empty();
      width = $('#graph6').width();
      height = $('#graph6').height();
    drawGraph6(width, height);
    $("#graph4").empty();
    $("#chart").empty();
    width = $('#graph4').width();
    height = $('#graph4').height();
    drawGraph4(width, height - 20);
    heatmap();
    });
    $('input[type=radio][name=question2]').change(function() {

    $("#graph4").empty();
    $("#chart").empty();
    width = $('#graph4').width();
    height = $('#graph4').height();
    drawGraph4(width, height - 20);
    heatmap();
    });

  var comma_separator_number_step = $.animateNumber.numberStepFactories.separator(',')
  $('#features').animateNumber(
    {
      number: 9,
      numberStep: comma_separator_number_step
    }, 1000
  );
  $('#examples').animateNumber(
    {
      number: 17144,
      numberStep: comma_separator_number_step
    }, 1000
  );
  $(".slide").width($(".outerbox").width());
  $(".outerbox").scroll(function() {
      // use the value from $(window).scrollTop();
      var per = $(".outerbox").scrollLeft(); 
      var total = $(".outerbox")[0].scrollWidth - $(".outerbox").width();
      var width = $(".outerbox").width();	
            
      var value = ((per * width) / total) - 123;
      value = Math.max(0, value);
      $(".taxi").css({left : value});
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
