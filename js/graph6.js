$(document).ready(function(){
  
	width = $('#graph6').width();
	height = $('#graph6').height();
	drawGraph6(width, height);
});


function drawGraph6(width, height){
	var svg = d3.select("#graph6") // set the width, height and color of the background
        ;
    var colorScale = d3.scaleLinear().domain([1,20])
    .interpolate(d3.interpolateHcl)
    .range([d3.rgb("green"), d3.rgb('red')]);
  
    var projection = d3.geoMercator()  // set the map projection
        .scale(46000).center([-73.9,40.7])  // these values will change depending on the region you want the map to show
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()  // create a function to convert your map's coordinates to an svg path
        .projection(projection);
    
    d3.json("dataset/nyctaxipickups.geojson", function(error, nyctaxis) {  //load the geojson file
        if (error) throw error;
        
        // **** CREATE THE MAP ****
        var mymap = svg.selectAll("anystring")  // For these purposes, what goes here is irrelevant
            .data(nyctaxis.features) // The features from your geojson file
            .enter().append("path").attr("d", path)
            .style("fill",function(d){ // set the colors of each feature
                var pickupsInHour0 = d.properties["hour0"]; // You can reference any of your map's attributes in this way
                // console.log(pickupsInHour0 / 100);
                return colorScale(Math.log(pickupsInHour0)); // Viridis is one of D3's built in color ramps. More here: https://github.com/d3/d3-scale#interpolateViridis
            });
        
        var displayHour = svg.append("text") // display the current hour
            .attr("x",30)  // position the text box on the screen. Coordinate [0,0] is the upper left corner.
            .attr("y",30)
            .style("fill","white")
            .text("0");
         
        // **** ANIMATE THE MAP'S COLORS ACCORDING TO THE HOURLY NUMBER OF PICKUPS ****
        var hour = 0;
        setInterval(function(){
            hour = (hour + 1) % 24;  // increment the hour
            
            mymap // change the colors smoothly
                .transition()
                .duration(1000)
                .style("fill",function(d){
                    var pickupsThisHour = d.properties["hour" + hour];
                    // console.log(Math.log(pickupsThisHour))
                    return colorScale(Math.log(pickupsThisHour));
                });
            
            displayHour.text(hour); // display the updated hour
        },1000); // repeat this function every second
        
    });
}