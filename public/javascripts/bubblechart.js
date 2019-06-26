var bubbleChart = function (data) {

    var margin = {top: 35, right: 30, bottom: 80, left: 60};

    var height = 500  - margin.top - margin.bottom,    //627
        width = 500 - margin.left - margin.right;
    
    var imgWidth = 250;

    var svg = d3.select('#graph')
                    .append('svg')
					.attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

    var radiusScale = d3.scaleSqrt().domain([1,50]).range([7,130])


    popColours = ['#ff0066','#ffcc00']
    const popColourScale = d3.scaleLinear()
        .domain([0,100])
        .range([popColours[0],popColours[1]]);


    var legendsvg = d3.select('#graph')
        .select('svg')
    
    var grad = legendsvg.append('defs')
        .append('linearGradient')
        .attr('id', 'linear-gradient')
        .attr('x1', '0%')
        .attr('x2', '0%')
        .attr('y1', '0%')
        .attr('y2', '100%');
    
    grad.selectAll('stop')
        .data(popColours.reverse())
        .enter()
        .append('stop')
        .style('stop-color', function(d){ return d; })
        .attr('offset', function(d,i){
            return 100 * (i / (popColours.length - 1)) + '%';
        })
    
    legendsvg.append('rect')
        .attr('x', width + margin.right)
        .attr('y', margin.top)
        .attr('width', 25)
        .attr('height', 150)
        .style('fill', 'url(#linear-gradient)');

    legendsvg.append("text")
        .attr("class", "legendTitle")
        .attr("x", width)
        .attr("y", 20)
        .style("text-anchor", "left")
        .style("fill", "white")
        .text("Popularity");

    //create tick marks
    var xLeg = d3.scaleLinear()
        .domain([100, 0])
        .range([0, 150]);

    var axisLeg = d3.axisLeft(xLeg)
        .tickValues(popColourScale.domain())

    legendsvg
        .attr("class", "axis")
        .append("g")
        .attr("transform", "translate(" + (width + margin.right) + "," + margin.top + ")")
        .call(axisLeg);
    
    var x = d3.scaleLinear()
        .domain([0, 100])
        .range([ 0, width ]);

    var hAxis = d3.axisBottom(x)
        .ticks(5)
    
    var hGuide = d3.select('#graph').select('svg').append("g")
            hAxis(hGuide)
            hGuide.attr('transform', 'translate(' + margin.left +','+(height + margin.top) +')')
            .selectAll("text")
                .style("text-anchor", "middle")
                .style('color','white')
                .style('font-size','14')
    
     // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height+50 )
        .style('font-size','20')
        .style("fill", "white")
        .text("Positivity (%)");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([0, 100])
        .range([ height, 0]);
    var vAxis = d3.axisLeft(y)
        .ticks(5)
    
    var vGuide = d3.select('#graph').select('svg').append("g")
                vAxis(vGuide)
                vGuide.attr('transform', 'translate(' + margin.left +','+ margin.top +')')
                .selectAll("text")
                    .style("text-anchor", "end")
                    .style('color','white')
                    .style('font-size','14')
  
    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", 0)
        .attr("y", -20 )
        .style("fill", "white")
        .style('font-size','20')
        .text("Energy (%)");

        // var size = 20
        // var allGroups = ["Instrumental", "Non-Instrumental"]

        // svg.selectAll("myrect")
        //   .data(allGroups)
        //   .enter()
        //   .append("circle")
        //     .attr("cx", 310)
        //     .attr("cy", function(d,i){ return 10 + i*(size+5)}) // 100 is where the first dot appears. 25 is the distance between dots
        //     .attr("r", 7)
        //     .style("fill", function(d,i){ 
        //         var returnColor;
        //         if (d === "Instrumental") { returnColor = "SpringGreen";}
        //         else { returnColor = '#6600FF'; }
        //         return returnColor;
        //     })

        // svg.selectAll("mylabels")
        //     .data(allGroups)
        //     .enter()
        //     .append("text")
        //         .attr("x", 310 + size*.8)
        //         .attr("y", function(d,i){ return i * (size + 5) + (size/2)}) // 100 is where the first dot appears. 25 is the distance between dots
        //         .style("fill", function(d,i){ 
        //             var returnColor;
        //             if (d === "Instrumental") { returnColor = "SpringGreen";}
        //             else { returnColor = '#6600FF'; }
        //             return returnColor;
        //         })
        //         .text(function(d){ return d})
        //         .attr("text-anchor", "left")
        //         .style("alignment-baseline", "middle")
     
    var simulation = d3.forceSimulation()
                    .force("x",d3.forceX(function(d){
                        return x(d.valence * 100);
                    }).strength(0.04))
                    .force("y",d3.forceY(function(d){
                        return y(d.energy * 100);
                    }).strength(0.04))
                    

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
                    .style("opacity", "0.9")
                    .style("padding","12px")
                    .text("");
    processData(data);

    function processData(data) {
        var circles = svg.selectAll("circle")
                .data(Object.values(data))
                .enter().append("circle")
                .attr("r",function(d){
                    return radiusScale(d.plays)
                })
                .style("stroke-width", 2.5)    // set the stroke width
                .style("stroke", "black")      // set the line colour
                .style('opacity', 0.7)
                .attr("cx", function(d){
                    return 0;
                })
                .attr("cy", function(d){
                    return 0;
                })
                .on('click', function(d){
                    console.log(d);
                })
                .style("fill", function(d) {
                    var returnColor;
                    var instrumental = d.instrumental > 0.4;
                    if (instrumental) { returnColor = "SpringGreen";}
                    else { returnColor = '#6600FF'; }
                    return popColourScale(d.popularity);
                    return returnColor;
                })
                .on("mouseover", function(d){
                    var imgstring = '<img src=' + d.image +' " ' + 'height="'+ imgWidth + '" width="' + imgWidth + '">';

                    if(d.plays > 1)
                    {
                        tooltip.html(d.name +"<br> "+ d.artist+"<br>"+ "Plays: "+d.plays +"<br>"+ 'Popularity: '+ d.popularity + '<br>' +'<br>' + imgstring); 
                    }
                    else
                    {
                        tooltip.html(d.name +"<br> "+ d.artist +"<br>"+ 'Popularity: '+ d.popularity + '<br>' + "<br>" + imgstring); 
                    }
                    d3.select(this).style('opacity', 1);
                    d3.select(this).style("stroke-width", 4);

                    removeMiniMetric();
                    miniMetric(d);
                    return tooltip.style("visibility", "visible");
                })
                .on("mousemove", function(){
                    return tooltip.style("top", (d3.mouse(this)[1] - imgWidth/1.5)+"px").style("left",(d3.mouse(this)[0]+imgWidth/4)+"px");
                })
                .on("mouseout", function(){
                    d3.select(this).style('opacity', 0.7);
                    d3.select(this).style("stroke-width", 2.5)

                    return tooltip.style("visibility", "hidden");
                });

        simulation.nodes(Object.values(data))
                .on('tick',update)

        function update(){
            circles
                .attr("cx", function(d){
                    return d.x
                })
                .attr("cy", function(d){
                    return d.y
                })
        } 
    }

}
