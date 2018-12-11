

function drawGraph(w,h){
	var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = w - margin.left - margin.right - 30,
    height = h - margin.top - margin.bottom - 20;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#graph1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
var colorScale = d3.scaleLinear().domain([1,57560])
      .interpolate(d3.interpolateHcl)
      .range([d3.rgb("green"), d3.rgb('red')]);

// get the data
d3.csv("dataset/vis1_d3.csv", function(error, data) {
  if (error) throw error;

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.time_pick; }));
  y.domain([0, d3.max(data, function(d) { return d.count / 10; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.time_pick); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.count/10); })
      .attr("height", function(d) { return height - y(d.count/10); })
	  .style("fill", function(d) { return colorScale(d.count/10); })
	  .append("svg:title")
   	  .text(function(d) { return d.count / 10; });;
  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + 
                           (height + 30) + ")")
      .style("text-anchor", "middle")
      .text("Date");
svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left - 1)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Value");   


});
}