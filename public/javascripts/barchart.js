var barChart = function (data) {
    var height = 1000,
    width = 1000;

    var svg = d3.select('#bar')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height)
                    .append("g")
                    .attr("transform", "translate(0,0)")
                    .attr("fill", "steelblue")
                    .selectAll("rect")
                    .data(data)
                    .join("rect")
                    .attr("y", d => y(Object.keys(data)))
                    .attr("width", d => x(Object.values(data)) - x(0))

    const yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1]);

    const xScale = d3.scaleBand()
        .range([0, width])
        .domain(function(d)
        {
            Object.keys(d)
        })
        .padding(0.2);

    svg.append("g")
      .call(d3.axisBottom(xScale));
  
    svg.append("g")
      .call(d3.axisLeft(yScale));

    svg.selectAll()
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => xScale(Object.keys(d)))
      .attr('y', (d) => yScale(Object.values(d)))
      .attr('height', (d) => height - yScale(Object.values(d)))
      .attr('width', xScale.bandwidth())
}