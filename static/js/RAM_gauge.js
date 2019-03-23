class RAM_gauge {  // Syntactical sugar supported in ES6 (used instead of constructor function of ES5).
  
  constructor(ID2Append2) {
    this.ID2Append2 = ID2Append2;
    this.arcGenerator = null; //It's a local variable that drawRAM_gauge() fills and RAM_Usage_Update() updates. Sadly, JS classes only can contain methods. 
  }  
  
  drawRAM_gauge() {
    var SVG_Dimention = {width: 180 , height: 100};
    var margin = {top: 2, right: 5, bottom: 13, left: 5};
    
    var height = SVG_Dimention.height - margin.top - margin.bottom;  
    var width = 2 * height;

    var svg = d3.select(this.ID2Append2).append("svg")
      .attr("width", SVG_Dimention.width)
      .attr("height", SVG_Dimention.height)
       .append("g")
      .attr("transform", "translate(" + SVG_Dimention.width/2 + "," + (SVG_Dimention.height-margin.bottom) + ")");

    var oR= height;
    var iR= 2 * (oR /3 );
    
    this.arcGenerator = d3.arc().innerRadius(iR).outerRadius(oR).startAngle(-90 * (Math.PI/180)).cornerRadius(4);
    
    var background = svg.append("path").datum({endAngle:  90 * (Math.PI/180)}).style("fill", "#ddd").attr("d", this.arcGenerator); // Append background arc to svg
    var foreground = svg.append("path").datum({endAngle: -90 * (Math.PI/180)}).style("fill", "#ddd").classed("fgd_path", true).attr("d", this.arcGenerator); // Append foreground arc to svg

    var min = 0;
    var current = 0;
    var max = 100;
  
    svg.append("text").attr("transform", "translate("+ -(iR + ((oR - iR)/2)) +",12)") // Set between inner and outer Radius
      .attr("text-anchor", "middle").style("font-size", "12px").style("font-family", "Helvetica").text(min);  // Display Min value  
    
    svg.append("text").classed("txt_RAM_usage", true).attr("transform", "translate(0,"+ -(iR/4) +")") // Push up from center 1/4 of innerRadius
      .attr("text-anchor", "middle").style("font-size", "20").style("font-family", "Helvetica").text(current + "%");   // Display Current value
    
    svg.append("text").attr("transform", "translate("+ (iR + ((oR - iR)/2)) +",12)") // Set between inner and outer Radius
      .attr("text-anchor", "middle").style("font-size", "12px").style("font-family", "Helvetica").text(max); // Display Max value 
    
  }
  
  RAM_Usage_Update(RAM_Usage) {
    
    var degreeScale = d3.scaleLinear().domain([0,100]).range([-90,90]); 
    var color;
    
    var RAM_Usage_Angle = Math.floor(degreeScale(RAM_Usage)) * (Math.PI/180);// Get value
    if(RAM_Usage >= 80) {color = 'red';} else if(RAM_Usage >= 60) {color = 'orange';} else {color = 'green';}
    
    d3.select(this.ID2Append2 + " .txt_RAM_usage").transition().text(Math.floor(RAM_Usage) + "%"); // Text transition

    //this.arcGenerator.endAngle(RAM_Usage_Angle);
    var myarcGen = this.arcGenerator;  
    
    d3.select(this.ID2Append2 + " .fgd_path").transition().duration(750).style("fill", color)
    
          .attrTween("d", function(d)
              {
                var interpolate = d3.interpolate(d.endAngle, RAM_Usage_Angle);
                return function(t) 
                    {
                    d.endAngle = interpolate(t);
                    return myarcGen(d);
                    };  
              });        
    
    //  .attr("d", this.arcGenerator);   
  }
}
