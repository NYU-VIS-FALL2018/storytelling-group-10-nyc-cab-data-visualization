$(document).ready(function(){

    width = $('#graph6').width();
    height = $('#graph6').height();
    drawGraph6(width, height);
});


function drawGraph6(width, height){
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
    var projection = d3.geoMercator() 
        .scale(scale).center(dict[pickup_Data])
        .translate([width / 2, height / 2]);
    
    var path = d3.geoPath()
        .projection(projection);
    
    d3.json("dataset/nyctaxipickups.geojson", function(error, nyctaxis) {  //load the geojson file
        if (error) throw error;
        var max = 0;
        
        var colorScale = d3.scaleLinear().domain([1,max])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb("#ffffd9"), d3.rgb("#c7e9b4"), d3.rgb("#41b6c4"), d3.rgb('#225ea8')]);
        // **** CREATE THE MAP ****
        var mymap = svg.selectAll("anystring")
            .data(nyctaxis.features)
            .enter()
            .filter(function(d){
                if (pickup_Data == true)
                    return true;
                return d.properties["BoroName"] == pickup_Data
            })
            .append("path").attr("d", path)
            .style("fill",function(d){
                var pickupsInHour0 = d.properties["hour0"];
                var temp = Math.log(pickupsInHour0) + 1
                if (temp > max)
                    max = temp
                return colorScale(temp);
            });
            colorScale = d3.scaleLinear().domain([1, max / 2, max + 1])
            .range([d3.rgb("#1E9600"), d3.rgb("#FFF200"), d3.rgb("#FF0000")]);
        var displayHour = svg.append("text")
            .attr("x",30)
            .attr("y",30)
            .style("fill","Black")
            .text("Hour : 0")
            .style("font-size", "20px")
        
        // **** ANIMATE THE MAP'S COLORS ACCORDING TO THE HOURLY NUMBER OF PICKUPS ****
        var hour = 0;
        setInterval(function(){
            hour = (hour + 1) % 24;
            
                    mymap 
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
            
            displayHour.text("Hour : " + hour);
        },1000);
        
    });
}