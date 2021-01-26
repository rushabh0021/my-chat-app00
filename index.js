var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

var server = app.listen(process.env.PORT || 3001, () => {
    console.log('server is running on port', server.address());
});

var http = require('http').Server(app);
var socket = require('socket.io');
var io = socket(server);

var dbURL = require('./config');
app.use(express.static("views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));




mongoose.connect(dbURL, { useMongoClient: true }, (err) => {
    console.log('mongodb connected', err);
});

var Message = mongoose.model('Message',
    {
        name: String,
        message: String
    });


io.on('connection', () => {
    console.log('a user is connected');
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, message) => {
        res.send(message);
    });
});

app.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        io.emit('message', req.body)
        res.sendStatus(200);
    });
});

