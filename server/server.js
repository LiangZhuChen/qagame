const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {isRealStr} = require('./QAIsRealStr');
const {allUsers} = require('./QAusers');
const {allQAs} = require('./QAclass');

const publicPath = path.join(__dirname, '/../public');
const port = process.env.PORT || 1928;
var web =  express();
let server = http.createServer(web);
let io = socketIO(server);

let users = new allUsers();
let QAdatabase = new allQAs();
let QAlist = [];
let waitState = [];

web.use(express.static(publicPath));

// Direct the first page to QAindex.html
web.get('/', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
})


io.on('connection', (socket) =>  {
    console.log("A new user just connected", socket.id);

    socket.on('join', (params, callback) => {
        if (!isRealStr(params.Name) || !isRealStr(params.RoomID)){
            return callback('Name and room are required.');
        }

        users.removeUser(socket.id);
        users.addUser(socket.id, params.Name, params.RoomID);
        socket.join(params.RoomID);
        socket.join(params.id);

        waitState.push(params.RoomID);

        io.to(params.RoomID).emit('updateMemberList', users.getUserList(params.RoomID));

        callback();
    });

    socket.on('startGame', () => {
        let user = users.getUser(socket.id);

        waitState = waitState.filter((room) => room != user.room);

        let roomQAs = QAdatabase.getQAs();
        QAlist.push({room: (user.room), QAs: roomQAs});
        let QAindex = roomQAs[0];
        io.to(user.room).emit('initQandA', QAdatabase.getQA(QAindex));
        let roomIndex = -1;
        for (let i = 0; i < QAlist.length; i++){
            if (QAlist[i].room == user.room){
                roomIndex = i;
                break;
            }
        }
        ((QAlist[roomIndex]).QAs).shift();

        let scoreList = users.getScoreList(user.room);
        io.to(user.room).emit('updateScore', scoreList);
        
        let remainingTime = 5000;
        setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime === 0) io.to(user.id).emit('endOneQA');
        }, 1000);
    });

    socket.on('makeAns', (correct) => {
        let user = users.getUser(socket.id);
        if (correct) users.addScore(socket.id, 10);
        let scoreList = users.getScoreList(user.room);
        io.to(user.room).emit('updateScore', scoreList);
    });

    socket.on('newQuestion', () => {
        let user = users.getUser(socket.id);

        let scoreList = users.getScoreList(user.room);
        io.to(user.room).emit('updateScore', scoreList);

        let roomIndex = -1;
        for (let i = 0; i < QAlist.length; i++){
            if (QAlist[i].room == user.room){
                roomIndex = i;
                break;
            }
        }
        let QAindex = QAlist[roomIndex].QAs[0];
        io.to(user.room).emit('updateQandA', QAdatabase.getQA(QAindex));
        ((QAlist[roomIndex]).QAs).shift();
        
        let remainingTime = 5000;
        setInterval(() => {
            remainingTime -= 1000;
            if (remainingTime === 0){
                if(QAlist[roomIndex].QAs.length === 0){
                    let ranking = users.getRanking(user.room);
                    io.to(user.room).emit('endGame', ranking);
                    users.removeRoom(user.room);
                    QAlist = QAlist.filter((roomQAlist) => roomQAlist.QAs.length != 0);
                }
                else{
                    io.to(user.id).emit('endOneQA');
                }
            }
        }, 1000);
    });

    socket.on('disconnect', () => {
        console.log("A user was disconnected.");
        let user = users.getUser(socket.id);
        users.removeUser(socket.id);
        if (user != undefined && waitState.indexOf(user.room, 0) != -1)
            io.to(user.room).emit('updateMemberList', users.getUserList(user.room));
    });
});

// On server
server.listen(port, () => {
    console.log('Server is up to port', port);
});