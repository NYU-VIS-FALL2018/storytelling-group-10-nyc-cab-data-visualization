
$(document).ready(function(){
	width = $('#graph4').width();
	height = $('#graph4').height();
	drawGraph4(width, height - 20);
});

function drawGraph4(w,h){
	var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;



// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) {return  x(d.time_drop);})
    .y(function(d) {return  y(d.avg_duration);});

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph4").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("dataset/final_project_data.csv", function(error, csv_data) {
  if (error) throw error;
  var pickup_location = angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup;
  var drop_location = angular.element(document.querySelector('[ng-controller="myController"]')).scope().dropOff;    
  // console.log(pickup_location + " " + drop_location)

  if( pickup_location != "ALL" && drop_location != "ALL")
    csv_data = csv_data.filter(function(d) { return (d.Source_Borough  == pickup_location && d.Drop_Borough  == drop_location);});
  else if( pickup_location != "ALL"){
    csv_data = csv_data.filter(function(d) { return d.Source_Borough  == pickup_location;});
  }
  else if( drop_location != "ALL"){
    csv_data = csv_data.filter(function(d) { return d.Drop_Borough  == drop_location;});
  }
  // console.log(csv_data)
  var unsorted_data = d3.nest()
                .key(function(d) {return Number(d.Hour);})
                .rollup(function(d) {
                  return d3.mean(d, function(g) {return g.Duration;});
                }).entries(csv_data);

  var count = 0;
  unsorted_data.forEach(function(d) {
      d.key = +d.key;
      d.value = +d.value;
      count += 1;
  });

  if (count < 23){

    svg.append("text")
    .attr("y", height / 2)
    .attr("x",(width/3))
    .text("Sorry data is not available for the selected locations.")
    return
  }

//   var data = {};
//   Object.keys(unsorted_data).sort().forEach(function(key) {
//   data[key] = unsorted_data[key];
//   });             


  keys = []
  unsorted_data.forEach(function(d){
    keys.push(+d.key)
  })


  data = new Array(24);

  for(i=0;i<unsorted_data.length;i++){
    data[unsorted_data[i].key] = unsorted_data[i];
  }


  data.forEach(function(d) {
      d.time_drop = d.key;
      d.avg_duration = d.value;
  });

  // console.log(data);

  
  // Scale the range of the data
  x.domain([ 0, d3.max(data, function(d) {
       return parseInt(d.time_drop); })]);
  y.domain([ d3.min(data, function(d) { 
    return d.avg_duration; }), d3.max(data, function(d) { 
      return d.avg_duration; })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .attr("stroke-width", "2px")
      .attr("font-wight", "bold");


  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
      .attr("stroke-width", "2px")
      .attr("font-wight", "bold");

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Averge Trip Duration(minutes)");
     
      svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 30) + ")")
      .style("text-anchor", "middle")
      .text("Hour of the Day");


});
}