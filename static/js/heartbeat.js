class HB {   // Syntactical sugar supported in ES6 (used instead of constructor function of ES5).

    constructor(receivedHB, ID2Append2, HB_interval) {
        this.receivedHB = receivedHB;
        this.ID2Append2 = ID2Append2;
        this.HB_interval = HB_interval;
        this.HB_Tolerate = 0;
        this.HB_Phase = 0;
        this.CIRCLE_MAX_RADIUS = 25;
    }
    
    drawHB() {
        var CIRCLE_MIN_RADIUS = this.CIRCLE_MAX_RADIUS / 2; 
        
        var margin = {top: 10, right: 10, bottom: 10, left: 10};
        
        var width = 100 - margin.left - margin.right;
        var height = 100 - margin.top - margin.bottom;

        var svg = d3.select(this.ID2Append2).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom )
                 .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            
        var circle = svg.append("circle")
                        .attr("fill", "red")
                        .attr("cx", width/2 )
                        .attr("cy", height/2 )
                        .attr("r", this.CIRCLE_MAX_RADIUS);
    }
        
    updateHB() {     
                
        var CIRCLE_MIN_RADIUS = this.CIRCLE_MAX_RADIUS /2 ;
        var colorScale = d3.scaleLinear()
            .domain([0, this.HB_interval])
            .range(["#18ce8e", "#09e296"]);

        var radiusScale = d3.scaleLinear()
            .domain([this.HB_interval, 0])
            .range([CIRCLE_MIN_RADIUS, this.CIRCLE_MAX_RADIUS]);
        
        const Tolerate_NUM = 25; // Number of half intervals that receiving no heartbeats, can be tolerated before alarm goes off
            
        if(this.receivedHB == false && this.HB_Tolerate < Tolerate_NUM)
            this.HB_Tolerate += 1;
                            
        if(this.receivedHB) {
            this.HB_Tolerate = 0;
        }
        
        if(this.HB_Tolerate == Tolerate_NUM){
            d3.select(this.ID2Append2 + " circle").transition()
                .attr("r", this.CIRCLE_MAX_RADIUS)
                .attr("fill", "red");
        }
        else{             
            d3.select(this.ID2Append2 + " circle").transition()
                .duration(Math.round (this.HB_Interval/2))
                .attr("r", radiusScale(this.HB_Phase))
                .attr("fill", colorScale(this.HB_Phase));
        }
        
        if(this.HB_Phase == this.HB_interval){
            this.HB_Phase = 0;
            this.receivedHB = false;
        }
        else
            this.HB_Phase =  this.HB_interval;
    }    
}
