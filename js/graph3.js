
$(document).ready(function(){
	width = $('#graph3').width();
	height = $('#graph3').height();
  data = readData();
  console.log(data)
  drawMap(width, height);
	// drawGraph2(width, height);
  // addColorsToBoroughs()
});
function readData() {
  d3.json("dataset/boroughs_population.json",function(error, data) {
    console.log(data)
  });
}
function drawMap(width, height) {
  //TODO draw map from the given dataset
  var svg = d3.select("#graph3").append("svg")
    .attr("width", width)
    .attr("height", height);

  d3.json("dataset/nyc.json", function(error, nyb) {

    d3.json("dataset/boroughs_population.json",function(error, data) {
      console.log(data)
    var projection = d3.geoMercator()
            .center([-73.94, 40.70])
            .scale(34000)
            .translate([(width) / 2, (height)/2]);

  var path = d3.geoPath()
      .projection(projection);

  var g = svg.append("g");
  var colorScale = d3.scaleSequential(d3.interpolateRgb("orange", "brown"))
    .domain([0, 7965703]);
  g.append("g")
    .attr("id", "boroughs")
    .selectAll(".state")
    .data(nyb.features)
    .enter().append("path")
    .attr("class", function(d){ return  d.properties.borough; })
    .attr("d", path)
    .style("fill", function(d) {
        var borough = d.properties.borough;
        var count = data[borough];
        return colorScale(count);
    })
    .append("svg:title")

    .text(function(d) {
        var borough = d.properties.borough;
        var count = data[borough];
        return borough + count; });
});
  });

}

