var barChart = function (data) {

    var height = 1000,
    width = 1000,
    barWidth = 60,
    animateDuration = 700
    animateDelay = 30;


    delete data.artist;
    delete data.artist_id;
    delete data.duration;
    delete data.image;
    delete data.key;
    delete data.name;
    delete data.plays;
    delete data.popularity;
    delete data.tempo;
    delete data.time_signature;
    delete data.track_id;

    metrics = []    
    for(var i in data)
        metrics.push([i, data [i]]);

    const yScale = d3.scaleLinear()
        .range([0, height])
        .domain([0, 1]);

    const verScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);

    const xScale = d3.scaleBand()
        .range([0, height])
        .domain(0,1);
    
    const horiScale = d3.scaleBand()
        .padding(0.1)
        .range([0, width])

    
    const colours = d3.scaleLinear()
        .domain([0,metrics.length])
        .range(['#00FFBF','#00FA9A']);

    var vAxis = d3.axisLeft(verScale)
            .ticks(6)
            .tickPadding(6)

    var hAxis = d3.axisBottom(horiScale)
                .ticks(metrics.length)
                .tickValues(horiScale.domain().filter(function(d,i){
                    return d[0];
                }));
    
    var vGuide = d3.select('svg')
        .append('g')
            vAxis(vGuide)
            vGuide.attr('transform', 'translate(30,0)')
            vGuide.selectAll('path')
                .style('fill','none')
                .style('stroke','#000')
            vGuide.selectAll('line')
                .style('stroke','#000')
    var hGuide = d3.select('svg')
        .append('g')
            hAxis(hGuide)
            hGuide.attr('transform', 'translate(30,'+(height -10) +')')
            hGuide.selectAll('path')
                .style('fill','none')
                .style('stroke','#000')
            hGuide.selectAll('line')
                .style('stroke','#000')


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

    var svg = d3.select('#bar')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append("g")
                    .attr("transform", "translate(0,0)")
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

    horiScale.domain(function(d){
        return d[0];
    })

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(horiScale));
    
    svg.transition()
        .attr('height', function(d){
            return  yScale(d[1]);
        })
        .attr('y',function(d,i){
            return height - yScale(d[1]);
        })
        .duration(animateDuration)
        .delay(function(d,i){
            return i * animateDelay;
        })
     

//     svg.append("g")
//       .call(d3.axisBottom(xScale));
  
//     svg.append("g")
//       .call(d3.axisLeft(yScale));

//     svg.selectAll()
//       .data(metrics)
//       .enter()
//       .append('rect')
//       .attr("class", "bar")
//       .attr('x', function(d) {xScale(Object.keys(d));})
//       .attr('y', (d) => yScale(Object.values(d)))
//       .attr('height', (d) => height - yScale(Object.values(d)))
//       .attr('width', xScale.bandwidth())
}