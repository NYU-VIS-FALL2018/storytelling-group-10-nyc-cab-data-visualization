
$(document).ready(function(){
  
	width = $('#graph2').width();
	height = $('#graph2').height();
	drawGraph2(width, height);
});

function drawGraph2(w,h){
	console.log("hello from graph 2")
  var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = w - margin.left - margin.right,
    height = h - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
var colorScale = d3.scaleLinear().domain([10, 16])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("lightgreen"),d3.rgb('darkgreen')]);


// get the data
d3.csv("dataset/vis2.csv", function(error, data) {
  if (error) throw error;
  console.log(data)
  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.date_pick; }));
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.date_pick); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.count); })
      .attr("height", function(d) { return height - y(d.count); })
	    .style("fill", function(d) { 
        console.log("hello");
        console.log(colorScale(d.count));
        return colorScale(d.count); })
	    .append("svg:title")
   	  .text(function(d) { return d.count; });;
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
}