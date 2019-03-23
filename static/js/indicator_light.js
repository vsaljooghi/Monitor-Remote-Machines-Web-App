class indicator_light {   // Syntactical sugar supported in ES6 (used instead of constructor function of ES5).

    constructor(ID2Append2) {
        this.ID2Append2 = ID2Append2;
    }
    
    drawIndicatorLight() {
        var SVG_Dimention = {width: 35 , height: 35};
        var squareSize = 25; 
        var margin = {top: 5, right: 5, bottom: 5, left: 5};
        
        var width = SVG_Dimention.width - margin.left - margin.right;
        var height = SVG_Dimention.height - margin.top - margin.bottom;
        
        var svg = d3.select(this.ID2Append2).append("svg")
                .attr("width",  SVG_Dimention.width)
                .attr("height", SVG_Dimention.height);
            
        var square = svg.append("rect")
                        .attr("fill", "red")
                        .attr("x",  SVG_Dimention.width/2-squareSize/2)
                        .attr("y",  SVG_Dimention.height/2-squareSize/2)
                        .attr("rx", "5")
                        .attr("ry", "5")
                        .attr("height", squareSize)
                        .attr("width", squareSize);
   }

   updateIndicatorLight(value) {
      var color;

      if(this.ID2Append2=="#TRANS")
	if(value=="notloaded") {color="red";} else if(value=="loading") {color="orange";} else {color="green";}
      else //for Post,Sitad,Civil
	if(value=="disconnected") {color="red";} else if(value=="slow") {color="orange";} else {color="green";}  
       
      d3.select(this.ID2Append2 + " rect").attr("fill", color);
   }
}
