var miniMetric = function (data) {

    var height = 400,
    width = 200,
    barWidth = 40,
    animateDuration = 700
    animateDelay = 30;

    metrics = []    
    for(var i in data)
    {
        if(i === "dance" || i === "energy" || i === "instrumental" || i === "liveness" || i === "valence")
        {
            metrics.push([i, data[i]]);
        }
    }

    const yScale = d3.scaleLinear()
        .domain([0, 1])
        .range([0, height])

    var vAxis = d3.axisLeft(yScale)
        .ticks(3)

    const xScale = d3.scaleBand()
        .domain(metrics.map(function(d){
            return String(d[0]);
        }))
        .range([0, width])
        .padding(0);

    var hAxis = d3.axisBottom(xScale)
        .ticks(metrics.length)
        .tickValues(xScale.domain());

    const colours = d3.scaleLinear()
        .domain([0,metrics.length - 1])
        .range(['#18CAE6','#18CAFF']);

    var tooltip = d3.select("#miniMetric")
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

    var svg = d3.select('#miniMetric')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append("g")
                    .attr("transform", "translate(0,-60)")
                    .selectAll("rect")
                        .data(metrics)
                        .enter().append('rect')
                            .style('fill', function(d,i){
                                return colours(i);
                            })
                            .attr('width', barWidth)
                            .attr('height', 0)
                            .attr('x', function (d,i) {
                                return i * (barWidth);
                            })
                            .attr('y',height)
                            .style("stroke-width", 1)    // set the stroke width
                            .style("stroke", "black")    
                            .on("mouseover", function(d){
                                tooltip.html(d[0] +": "+ d[1]); 
                                d3.select(this).style('opacity', 0.7);
                                d3.select(this).style("stroke-width", 2);
                                return tooltip.style("visibility", "visible");
                            })
                            .on("mousemove", function(){
                                return tooltip.style("top", (d3.event.pageY- 10)+"px").style("left",(d3.event.pageX+10)+"px");
                            })
                            .on("mouseout", function(){
                                d3.select(this).style('opacity', 1);
                                d3.select(this).style("stroke-width", 1);
                                return tooltip.style("visibility", "hidden");
                            });

    var hGuide = d3.select('#miniMetric').select('svg').append("g")
                    hAxis(hGuide)
                    hGuide.attr('transform', 'translate(0,'+(height -60) +')')
                    .selectAll("text")
                        .style("text-anchor", "start")
                        .attr("transform", function(d) {
                            return "rotate(65)" 
                            })
                        .style('color','black')
                        .style('font-size','14')

    var vGuide = d3.select('#miniMetric').select('svg').append("g")
                    vAxis(vGuide)
                    vGuide.attr('transform', 'translate(0,-60)')
                    .selectAll("text")
                        .style("text-anchor", "start")
                        .style('color','black')
                        .style('font-size','14')

                   

    // var xAxis = d3.select('#miniMetric').select('svg').append("g")
    //     .classed("xAxis", true)
    //     .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisBottom(xScale))
    //     //.selectAll('text')


        
    // //  d3.select('#miniMetric').select('svg').selectAll('line')
    // //         .attr('stroke','black')
            
    // d3.select('#miniMetric').selectAll('.x.axis')
    //         .attr('fill','black')
    // d3.select(".x.axis")
    //     .attr("fill", "black")


    svg.transition()
        .attr('height', function(d){
            return yScale(d[1]);
        })
        .attr('y',function(d,i){
            return height - yScale(d[1]);
        })
        .duration(animateDuration)
        .delay(function(d,i){
            return i * animateDelay;
        })
}

var removeMiniMetric = function(){
    d3.select("#miniMetric").selectAll("svg").remove();
    d3.select("#miniMetric").selectAll("div").remove();
}