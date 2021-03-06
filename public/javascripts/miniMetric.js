var miniMetric = function (data) {

    var margin = {top: 5, right: 30, bottom: 60, left: 30};

    var height = 325 - margin.top - margin.bottom,
    width = 240 - margin.left - margin.right,
    animateDuration = 700,
    animateDelay = 30;


    metrics = []    
    for(var i in data)
    {
        if(i === "dance" || i === "energy" || i === "liveness" || i === "valence")// || i === "instrumental")
        {
            metrics.push([i, data[i]]);
        }
    }
    //swap ijnstrumentalness index
    //[metrics[2], metrics[4]] = [metrics[4], metrics[2]];

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0])

    var vAxis = d3.axisLeft(yScale)
        .ticks(3)

    const xScale = d3.scaleBand()
        .domain(metrics.map(function(d){
            return capitalizedString(d[0]).charAt(0)
        }))
        .range([0, width])
        .padding(0.1);

    var hAxis = d3.axisBottom(xScale)
        .ticks(metrics.length)
        .tickValues(xScale.domain());

    const colours = d3.scaleLinear()
        .domain([0,metrics.length - 1])
        .range(['#ff0066','#ff6666']);

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
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                    .selectAll("rect")
                        .data(metrics)
                        .enter().append('rect')
                            .style('fill', function(d,i){
                                return colours(i);
                            })
                            .attr('width', xScale.bandwidth)
                            .attr('height', 0)
                            .attr('x', function (d,i) {
                                return xScale(capitalizedString(d[0]).charAt(0))
                            })
                            .attr('y',height)
                            .style("stroke-width", 1)    // set the stroke width
                            .style("stroke", "black")    
                            .on("mouseover", function(d){
                                tooltip.html(capitalizedString(d[0]) +": "+ Math.round(d[1] *100) + '%'); 
                                d3.select(this).style('opacity', 0.7);
                                d3.select(this).style("stroke-width", 2);
                                return tooltip.style("visibility", "visible");
                            })
                            .on("mousemove", function(){
                                return tooltip.style("top", (d3.mouse(this)[1])+"px").style("left",(d3.mouse(this)[0])+"px");
                            })
                            .on("mouseout", function(){
                                d3.select(this).style('opacity', 1);
                                d3.select(this).style("stroke-width", 1);
                                return tooltip.style("visibility", "hidden");
                            });

    var hGuide = d3.select('#miniMetric').select('svg').append("g")
                    hAxis(hGuide)
                    hGuide.attr('transform', 'translate(' + margin.left +','+(height + margin.top) +')')
                    .selectAll("text")
                        .style("text-anchor", "start")
                        // .attr("transform", function(d) {
                        //         return "rotate(65)" 
                        //     })
                        .style('color','white')
                        .style('font-size','14')

    var vGuide = d3.select('#miniMetric').select('svg').append("g")
                    vAxis(vGuide)
                    vGuide.attr('transform', 'translate(' + margin.left +','+ margin.top +')')
                    .selectAll("text")
                        .style("text-anchor", "end")
                        .style('color','white')
                        .style('font-size','14')

    svg.transition()
        .attr('y',function(d,i)
        {
            return yScale(d[1] *100);
        })
        .attr('height', function(d)
        {
            return height - yScale(d[1]*100);
        })
        .duration(animateDuration)
        .delay(function(d,i)
        {
            return i * animateDelay;
        })

    document.getElementById('mm-header').innerHTML = 
        '<h3>Audio Features' + '</h3>' + 
        '<h5>'+ data.name +'</h5>' +
        '<p class="mb-1">' + data.artist +
        '</p>' 
    ;
}

capitalizedString = function(name)
{
    return name.charAt(0).toUpperCase() + name.slice(1)
}

var removeMiniMetric = function(){
    d3.select("#miniMetric").selectAll("svg").remove();
    d3.select("#miniMetric").selectAll("div").remove();
}