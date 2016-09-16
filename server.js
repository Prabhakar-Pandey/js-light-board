var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 5000;
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/views'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
// right
var config = {
    rowCol: 10,

}

//Global Object
var globalArray = [];
for (var i = 0; i < config.rowCol; i++) {
    for (var j = 0; j < config.rowCol; j++) {
        globalArray.push({
            "x": i,
            "y": j,
            "user": null,
            "color": "#FFF"
        });
    }
}

//socket methods for renderding objects
io.on('connection', function(socket) {
    // emitting same object to all clients
    socket.emit("RENDERUI", globalArray);
    // here we are setting the the box clicked by user
    socket.on("ASSAIGN", function(data) {
        var x = data.postition.split(',')[0];
        var y = data.postition.split(',')[1];
        var i;
        globalArray.forEach(function(e, index) {

            if (e.x == x && e.y == y) {
                i = index;
                if (e.user) {
                    globalArray[index].user = null;
                    globalArray[index].color = "#FFF";

                }
                if (data.user == e.user) {

                } else {
                    globalArray[index].user = data.user;
                    globalArray[index].color = data.color;
                }


            }

        });
        io.emit("ASSAIGNED", globalArray);
    })

    socket.on('TIMER', function(data) {
        io.emit('SERVERTIMER', data);
    });

    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});


http.listen(port, function() {
    console.log('listening on *:' + port);
});
