'use strict';

function CPU_gauge(ID2Append2) {  //Constructor function (ES5)
    this.ID2Append2 = ID2Append2;
};

CPU_gauge.prototype.drawCPU_gauge= function() {
    var SVG_Dimention = {width: 180 , height: 100};
    var margin = {top: 0, right: 5, bottom: 15, left: 5};
        
    var height =  SVG_Dimention.height - margin.top - margin.bottom;    
    var width = 2 * height;

    var angleScale = d3.scaleLinear().domain([0, 100]).range([-90, 90]);
    
    var svg = d3.select(this.ID2Append2).append("svg")
        .attr("width", SVG_Dimention.width)
        .attr("height", SVG_Dimention.height) 
         .append("g")
        .attr("transform", "translate(" + SVG_Dimention.width/2 + "," + (SVG_Dimention.height-margin.bottom) + ")");    

    
    // Add axis
       svg.append('g')
        .classed('axis', true)
        .call(axisRadialInner(angleScale.copy().range(angleScale.range().map(deg2rad)), height-2));
        
    var needle = svg.append('g')
               .attr('transform', `scale(${height * 0.85})`)
               .append('path').classed('CPU_needle', true)
            .attr('d', ['M0 -1', 'L0.03 0', 'A 0.03 0.03 0 0 1 -0.03 0', 'Z'].join(' '))
            .attr('transform', `rotate(${angleScale(0)})`);

    var label = svg.append('text').classed('txt_CPU_usage', true)
            .attr("transform", "translate( 0, " + margin.bottom + ")")
              .attr('text-anchor', 'middle')
            .text('0%');

    function deg2rad(deg) { return deg * Math.PI / 180; }    
};

    
CPU_gauge.prototype.CPU_Usage_Update = function(CPU_usage) {
       
    var color = "";
    
    if(CPU_usage >= 80) {color = 'red';} else if(CPU_usage >= 60) {color = 'orange';} else {color = 'green';}

    var angleScale = d3.scaleLinear().domain([0, 100]).range([-90, 90]);
    
    d3.select(this.ID2Append2 + " .txt_CPU_usage").text(CPU_usage + "%").style("fill", color);
    d3.select(this.ID2Append2 + " .CPU_needle").style("fill", color).transition().duration(1500).ease(d3.easeElastic).attr('transform', `rotate(${angleScale(CPU_usage)})`);
};

/* 
class CPU_gauge {  // Syntactical sugar supported in ES6 (used instead of constructor function of ES5).
    
    constructor(ID2Append2) {
    this.ID2Append2 = ID2Append2;
    }

    drawCPU_gauge() {
    var SVG_Dimention = {width: 180 , height: 100};
    var margin = {top: 0, right: 5, bottom: 15, left: 5};
        
    var height =  SVG_Dimention.height - margin.top - margin.bottom;    
    var width = 2 * height;

    var angleScale = d3.scaleLinear().domain([0, 100]).range([-90, 90]);
    
    var svg = d3.select(this.ID2Append2).append("svg")
        .attr("width", SVG_Dimention.width)
        .attr("height", SVG_Dimention.height) 
         .append("g")
        .attr("transform", "translate(" + SVG_Dimention.width/2 + "," + (SVG_Dimention.height-margin.bottom) + ")");    

    
    // Add axis
        svg.append('g')
        .classed('axis', true)
        .call(axisRadialInner(angleScale.copy().range(angleScale.range().map(deg2rad)), height-2));
        
    var needle = svg.append('g')
               .attr('transform', `scale(${height * 0.85})`)
               .append('path').classed('CPU_needle', true)
            .attr('d', ['M0 -1', 'L0.03 0', 'A 0.03 0.03 0 0 1 -0.03 0', 'Z'].join(' '))
            .attr('transform', `rotate(${angleScale(0)})`);

    var label = svg.append('text').classed('txt_CPU_usage', true)
            .attr("transform", "translate( 0, " + margin.bottom + ")")
              .attr('text-anchor', 'middle')
            .text('0%');

    function deg2rad(deg) { return deg * Math.PI / 180; }    
    }    
    
    CPU_Usage_Update(CPU_usage) {
       
    var color = "";
    
    if(CPU_usage >= 80) {color = 'red';} else if(CPU_usage >= 60) {color = 'orange';} else {color = 'green';}

    var angleScale = d3.scaleLinear().domain([0, 100]).range([-90, 90]);
    
    d3.select(this.ID2Append2 + " .txt_CPU_usage").text(CPU_usage + "%").style("fill", color);
    d3.select(this.ID2Append2 + " .CPU_needle").style("fill", color).transition().duration(1500).ease(d3.easeElastic).attr('transform', `rotate(${angleScale(CPU_usage)})`);
    }
} */

