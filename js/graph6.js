$(document).ready(function(){
  
	width = $('#graph6').width();
	height = $('#graph6').height();
	//drawGraph6(width, height);
});


function drawGraph6(width, height){
    console.log("in function ")
	var svg = d3.select("#graph6") // set the width, height and color of the background
        ;
        var dict = {
            "Brooklyn": [-73.9, 40.67],
            "Manhattan": [-73.9, 40.8],
            "Staten Island": [-74.15, 40.6],
            "Bronx": [-73.85, 40.85],
            "Queens": [-73.8, 40.7],
            true:  [-74.0, 40.7]
          };
          var scale = 0
          if(angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup == "ALL"){
            pickup_Data = true;
            scale = 46000;
          }
        else{
            pickup_Data= angular.element(document.querySelector('[ng-controller="myController"]')).scope().pickup;
            scale = 75000;
        }     
    var projection = d3.geoMercator()  // set the map projection
        .scale(scale).center(dict[pickup_Data])  // these values will change depending on the region you want the map to show
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()  // create a function to convert your map's coordinates to an svg path
        .projection(projection);
    
    d3.json("dataset/nyctaxipickups.geojson", function(error, nyctaxis) {  //load the geojson file
        if (error) throw error;
        var max = 0;
        
        var colorScale = d3.scaleLinear().domain([1,max])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#ffffd9"), d3.rgb("#c7e9b4"), d3.rgb("#41b6c4"), d3.rgb('#225ea8')]);
        // **** CREATE THE MAP ****
        var mymap = svg.selectAll("anystring")  // For these purposes, what goes here is irrelevant
            .data(nyctaxis.features) // The features from your geojson file
            .enter()
            .filter(function(d){
                if (pickup_Data == true)
                    return true;
                return d.properties["BoroName"] == pickup_Data
            })
            .append("path").attr("d", path)
            .style("fill",function(d){ // set the colors of each feature
                var pickupsInHour0 = d.properties["hour0"]; // You can reference any of your map's attributes in this way
                var temp = Math.log(pickupsInHour0) + 1
                if (temp > max)
                    max = temp
                return colorScale(temp); // Viridis is one of D3's built in color ramps. More here: https://github.com/d3/d3-scale#interpolateViridis
            });
            colorScale = d3.scaleLinear().domain([1, max / 2, max + 1])
            .range([d3.rgb("#1E9600"), d3.rgb("#FFF200"), d3.rgb("#FF0000")]);
        var displayHour = svg.append("text") // display the current hour
            .attr("x",30)  // position the text box on the screen. Coordinate [0,0] is the upper left corner.
            .attr("y",30)
            .style("fill","Black")
            .text("Hour : 0")
            .style("font-size", "20px")
         
        // **** ANIMATE THE MAP'S COLORS ACCORDING TO THE HOURLY NUMBER OF PICKUPS ****
        var hour = 0;
        setInterval(function(){
            hour = (hour + 1) % 24;  // increment the hour
            
            mymap // change the colors smoothly
                .transition()
                .duration(1000)
                .filter(function(d){
                    if (pickup_Data == true)
                        return true;
                    return d.properties["BoroName"] == pickup_Data;
                })    
                .style("fill",function(d){
                    var pickupsThisHour = d.properties["hour" + hour];
                    return colorScale(Math.log(pickupsThisHour) + 1);
                });
            
            displayHour.text("Hour : " + hour); // display the updated hour
        },1000); // repeat this function every second
        
    });
}