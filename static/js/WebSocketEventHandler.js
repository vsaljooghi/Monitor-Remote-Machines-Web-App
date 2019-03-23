$(document).ready(function(){
            
    namespace = '/monitoring_servers';
    var socket = io.connect('http://' + document.domain + ':' + location.port + namespace);    

    socket.on('my_server_event', function(msg) {                
        console.log(msg);
        
        switch(msg.Subject) {
             
             case "CPU":
                var id = msg.ServerName + "_" + msg.Subject;
                newVal = Math.round(msg.Value);
                if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].CPU_Usage_Update(newVal);
             break;
             
             case "heartbeat":
                 var id = msg.ServerName + "_" + msg.Subject;
                 if(window.Objs_Dict[id] != undefined)
                     window.Objs_Dict[id].receivedHB = true;
             break;
             
             case "RAM":
                 var id = msg.ServerName + "_" + msg.Subject;
                 if(window.Objs_Dict[id] != undefined)
                     window.Objs_Dict[id].RAM_Usage_Update(msg.Value);
             break;
               
             case "Storage":
                 var id = msg.ServerName + "_" + msg.Subject;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].Storage_Usage_Update(msg.Value, msg.Color);
             break;
            
             case "TRANS":
                 var id = msg.ServerName;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].updateIndicatorLight(msg.Value);
             break;

             case "Civil":
                 var id = msg.ServerName;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].updateIndicatorLight(msg.Value);
             break;

             case "Sitad":
                 var id = msg.ServerName;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].updateIndicatorLight(msg.Value);
             break;

             case "Post":
                 var id = msg.ServerName;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].updateIndicatorLight(msg.Value);
             break;
             
             case "NTP":
                 var id = msg.ServerName;
                 if(window.Objs_Dict[id] != undefined)
                    window.Objs_Dict[id].updateIndicatorLight(msg.Value);
             break;
             
             default:
                 console.log("message is not supported");
        }     
    });    
});
