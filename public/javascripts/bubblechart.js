var bubbleChart = function (data) {

    var height = 1000,
        width = 1000;

    var svg = d3.select('#graph')
                    .append('svg')
					.attr('width', width)
                    .attr('height', height)
                    .append("g")
                    .attr("transform", "translate(0,0)")

    var radiusScale = d3.scaleSqrt().domain([1,50]).range([20,400])
    var fontScale   = d3.scaleSqrt().domain([1,50]).range([8,40])
     
    var simulation = d3.forceSimulation()
                    .force("x",d3.forceX(width/1.5).strength(0.05))
                    .force("y",d3.forceY(height/3.5).strength(0.05))
                    .force("collide",d3.forceCollide(function(d){
                        return radiusScale(d.plays) + 2
                    }));

    var tooltip = d3.select("#graph")
                    .append("div")
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("color", "white")
                    .style("padding", "8px")
                    .style("background-color", "rgba(0, 0, 0, 0.75)")
                    .style("border-radius", "8px")
                    .style("text-align", "left")
                    .style("font", "12px sans-serif")
                    .style("padding","12px")
                    .text("");
    processData(data);

    function processData(data) {
        var circles = svg.selectAll("circle")
                .data(Object.values(data))
                .enter()
                .append("circle")
                .attr("r",function(d){
                    return radiusScale(d.plays)
                })
                .style("stroke-width", 2.5)    // set the stroke width
                .style("stroke", "black")      // set the line colour
                .attr("cx", 300)
                .attr("cy", 300)
                .on('click', function(d){
                    console.log(d);
                })
                .style("fill", function(d) {
                    var returnColor;
                    var plays = d.plays
                    if (plays <=2) { returnColor = "steelblue";
                    } else if (plays <= 10) { returnColor = "SpringGreen";
                    } else if (plays <= 20) { returnColor = "lightcoral"; 
                    } else if (plays <= 30) { returnColor = '#6600FF'; }
                    return returnColor;
                })
                .on("mouseover", function(d){
                    if(d.plays > 1)
                    {
                        tooltip.html(d.name +"<br> "+ d.artist+"<br>"+ "Plays: "+d.plays); 
                    }
                    else
                    {
                        tooltip.html(d.name +"<br> "+ d.artist); 
                    }
                    d3.select(this).style('opacity', 0.7);
                    d3.select(this).style("stroke-width", 4);

                    miniMetric(d);

                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(){
                    return tooltip.style("top", (d3.event.pageY- 10)+"px").style("left",(d3.event.pageX+10)+"px");
                })
                .on("mouseout", function(){
                    d3.select(this).style('opacity', 1);
                    d3.select(this).style("stroke-width", 2.5)

                    removeMiniMetric();
                    
                    return tooltip.style("visibility", "hidden");
                });

        let texts = svg.selectAll(null)
                .data(Object.values(data))
                .enter()
                .append('text')
                .attr("dy", ".3em")
                .attr("font-family", "sans-serif")
                .attr("font-size", function(d){
                    return fontScale(d.plays);
                })
                .style("text-anchor", "middle")
                .text(function(d){
                    var regex = "^[^\(]+";
                    return d.name.match(regex);
                })
                .attr('color', 'black')

        simulation.nodes(Object.values(data))
                .on('tick',update)

        function update(){
            circles
                .attr("cx",function(d){
                    return d.x;
                })
                .attr("cy",function(d){
                    return d.y;
                })

            texts.attr('x', (d) => {
                    return d.x
                })
                .attr('y', (d) => {
                    return d.y
                });
        } 
    }

}
