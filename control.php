<?php 
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 1000");
header("Access-Control-Allow-Headers: X-Requested-With, Content-Type, Origin, Cache-Control, Pragma, Authorization, Accept, Accept-Encoding");
header("Access-Control-Allow-Methods: PUT, POST, GET, OPTIONS, DELETE");
?>

<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/3.4.11/d3.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.13.1/lodash.min.js"></script>
        <script src="http://d3js.org/queue.v1.min.js"></script>
        <script src="https://code.jquery.com/jquery-2.1.2.min.js"></script>
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

        <script src="src/plugins/js/L.D3SvgOverlay.min.js"></script>

        <script src="src/plugins/js/nouislider.js"></script>
        <script src="src/plugins/js/wNumb.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.3.3/require.min.js"></script>
    
        <link rel="stylesheet" href="src/plugins/css/nouislider.min.css" />
        <link href='src/css/main.css' rel='stylesheet' />

    </head>

    <body>
        <div class="sliders" id="daycontrol"></div>
        <div class="sliders" id="timecontrol"></div>
        <div class="sliders" id="nexthourcontrol"></div>
      
        <div id="scripts">
            <script src='src/js/timeControl.js'></script>
            <script src='src/js/controller.js'></script>
        </div>

    </body>

</html>


