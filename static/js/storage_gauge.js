class storage_gauge {  // Syntactical sugar supported in ES6 (used instead of constructor function of ES5).

    constructor(ID2Append2) {
        this.ID2Append2 = ID2Append2;
    }
    
    drawStorage_gauge() {
        var SVG_Dimention = {width: 100 , height: 100};
        var margin = {top: 5, right: 5, bottom: 5, left: 5};
            
        var width =  SVG_Dimention.width - margin.left - margin.right;
        var height = SVG_Dimention.height - margin.top - margin.bottom;

        var r = height/2;
        var cx = width/2 + margin.left; 
        var cy = height/2 + margin.top;
        
        var svg = d3.select(this.ID2Append2).append("svg")
            .attr("width", SVG_Dimention.width)
            .attr("height", SVG_Dimention.height);

        svg.append("circle")
            .attr("stroke", "black")
            .attr("stroke-width", 2)
            .attr("cx", cx)
            .attr("cy", cy)
            .style("fill-opacity", 0)
            .attr("r", r);

        svg.append("path");    

        svg.append("text").attr("text-anchor", "middle").attr("transform", "translate(" + cx + "," + cy + ")").text("0%");
    }
    
    Storage_Usage_Update(storage_usage, storage_color) {
        var SVG_Dimention = {width: 100 , height: 100};
        var margin = {top: 5, right: 5, bottom: 5, left: 5};
            
        var width =  SVG_Dimention.width - margin.left - margin.right;
        var height = SVG_Dimention.height - margin.top - margin.bottom;
        
        var r = height/2;
        var cx = width/2 + margin.left; 
        var cy = height/2 + margin.top;
        
        var angle_scale = d3.scaleLinear().domain([0, 100]).range([Math.PI, 0]);

        var start_x= cx + Math.cos(angle_scale(storage_usage)-Math.PI/2) * (r-5);
        var start_y= cy + Math.sin(angle_scale(storage_usage)-Math.PI/2) * (r-5);

        var end_x= cx - Math.cos(angle_scale(storage_usage)-Math.PI/2) * (r-5);
        var end_y= start_y;

        var Path_Data;
       
        if(storage_usage >= 50)
            Path_Data="M"+start_x+","+start_y+"A"+(r-5)+","+(r-5)+",0,1,1,"+end_x+","+end_y+"Z";
        else
            Path_Data="M"+start_x+","+start_y+"A"+(r-5)+","+(r-5)+",0,0,1,"+end_x+","+end_y+"Z";

        var color;

        if(storage_color) {  
           if(storage_color=="R") color='red'; else if(storage_color=="G") color='green'; else color='orange';
        }
        else {
           if(storage_usage >= 80) {
              color = 'red'; 
              var Voicemsg = new SpeechSynthesisUtterance("Disk is getting full.");
               if ('speechSynthesis' in window)
                    window.speechSynthesis.speak(Voicemsg);
           } 
           else if(storage_usage >= 60) {color = 'orange';} 
           else {color = 'green';}
        }

        d3.select(this.ID2Append2 + " path").attr("d", Path_Data).attr("fill", color);
        
        d3.select(this.ID2Append2 + " text").attr("text-anchor", "middle").attr("transform", "translate(" + cx + "," + cy + ")").text(storage_usage+"%");
    }
}
