class allUsers{
    constructor(){
        this.users = [];
    }

    addUser(id, name, room){
        let score = 0;
        let user = {id, name, room, score};
        this.users.push(user);
        return user;
    }

    getUserList(room){
        let users = this.users.filter((user) => user.room === room);
        let userList = users.map((user) => user.name);

        return userList;
    }

    getScoreList(room){
        let users = this.users.filter((user) => user.room === room);
        let scoreList = users.map(function(user) {
            let name = user.name, score = user.score;
            let userScore = {name, score};
            return userScore;
        });

        return scoreList;
    }

    getUser(userID){
        return this.users.filter((user) => user.id === userID)[0];
    }

    addScore(userID, addAmo){
        let user = this.getUser(userID);
        let userNames = this.getUserList(user.room);
        let userIndex = userNames.indexOf(user.name, 0);
        user.score += addAmo;
        this[userIndex] = user;
    }

    getRanking(room){
        let roomUsers = this.users.filter((user) => user.room === room);
        roomUsers.sort(function(user1, user2){
            return user2.score - user1.score;
        })

        return roomUsers.map((user) => user.name);
    }

    removeRoom(room){
        this.users = this.users.filter((user) => user.room != room);
    }

    removeUser(id){
        let user = this.getUser(id);

        if (user){
            this.users = this.users.filter((user) => user.id != id);
        }
    }
}

module.exports = {allUsers};