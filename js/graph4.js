
$(document).ready(function(){
	width = $('#graph4').width();
	height = $('#graph4').height();
	drawGraph4(width, height);
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

  //var borough_data = 

  var data = d3.nest()
                .key(function(d) {return Number(d.Hour);})
                .sortKeys(d3.ascending)
                .rollup(function(d) {
                  return d3.mean(d, function(g) {return g.Duration;});
                }).entries(csv_data);

//   var data = {};
//   Object.keys(unsorted_data).sort().forEach(function(key) {
//   data[key] = unsorted_data[key];
//   });             

  // data = d3.nest()
  //           .key(function(d) {return parseInt(d.key);})
  //           .sortKeys(d3.ascending)
  //           .entries(data);

  data.forEach(function(d) {
      d.time_drop = d.key;
      d.avg_duration = d.value;
  });

  console.log(data);

  
  // Scale the range of the data
  x.domain([ 0, d3.max(data, function(d) { return parseInt(d.time_drop); })]);
  y.domain([10, d3.max(data, function(d) { return d.avg_duration; })]);

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

});
}