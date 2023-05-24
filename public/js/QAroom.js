let socket = io();
let myName = "defaultName";
let myRoom = "defaultRoom";

socket.on('connect', function () {
    
    // if (window.innerHeight > window.innerWidth){
    //     document.querySelector('#roomPage').style = "-webkit-transform: rotate(90deg); -moz-transform: rotate(90deg); -o-transform: rotate(90deg); -ms-transform: rotate(90deg); transform: rotate(90deg);";
    // }

    let searchQuery = window.location.search.substring(1);
    params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, ' ').replace(/=/g, '":"') + '"}');

    let roomName = document.querySelector('#roomName');
    roomName.innerText = params.RoomID;

    socket.emit('join', params, function(err) {
        if (err){
            alert(err);
            window.location.href = '/';
        }
        else{
            console.log('No Join Error');
        }
    });
});

socket.on('updateMemberList', function(users) {
    let ol = document.createElement('ol');
    ol.id = "memberList";
    io.className = "memberList";

    users.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ol.appendChild(li);
    })

    let userList = document.querySelector('#roomMembers');
    roomMembers.innerHTML= '';
    userList.appendChild(ol);
});

document.querySelector('#startBtn').addEventListener('click', function(e) {
    socket.emit('startGame');
});

socket.on('initQandA', function(QandA) {
    // Delete startBtn
    let startBtn = document.querySelector('#startBtn');
    startBtn.remove();

    // Delete waitMdg
    let waitMsg = document.querySelector('#waitMsg');
    waitMsg.remove();

    document.querySelector("#QAsidebar").style.bottom = "2%";
    document.querySelector("#questionAndOptions").style.top = "2%";
    document.getElementById('QAsidebar').style.borderRadius = '0px';
    document.getElementById('QAsidebar').style.backgroundColor = 'rgb(116, 143, 196)';
    document.getElementById('QAsidebar').style.margin = '0px';

    document.querySelector('#memberTitle').innerText = "Score:";

    // Append question area
    let qArea = document.querySelector('#questionArea');
    let question = document.createElement('h3');
    question.id = 'question';
    question.innerHTML = QandA.q;
    console.log(QandA.q);
    qArea.append(question);

    // Append option Area
    //let wrongNum = 1;

    let optionOl = document.querySelector('#options');
    let anOption = document.createElement('button');
    anOption.innerText = QandA.optionA;
    if (QandA.ans === "A") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionB;
    if (QandA.ans === "B") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionC;
    if (QandA.ans === "C") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionD;
    if (QandA.ans === "D") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    // Click right ans
    document.querySelector('#ansBtn').addEventListener('click', function(e) {
        document.querySelector('#ansBtn').remove();
        document.querySelectorAll('#wrongBtn').forEach((btn) => btn.remove());
        let correctMsg = document.createElement('h3');
        correctMsg.id = "correctMsg";
        correctMsg.className = "correctMsg";
        correctMsg.innerHTML = 'CORRECT!';
        document.querySelector('#options').append(correctMsg);

        // Return correctness to server
        socket.emit('makeAns', true);
    });

    // Click wrong ans
    document.querySelectorAll('#wrongBtn').forEach((btn => 
        btn.addEventListener('click', function(e) {
            document.querySelector('#ansBtn').remove();
            document.querySelectorAll('#wrongBtn').forEach((btn) => btn.remove());
            let wrongMsg = document.createElement('h3');
            wrongMsg.id = "wrongMsg";
            wrongMsg.className = "wrongMsg";
            wrongMsg.innerHTML = 'Wrong Answer. Ans: ' + QandA.ans;
            document.querySelector('#options').append(wrongMsg);

            // Return wrongAns to server
            socket.emit('makeAns', false);
        })
    ));
});

socket.on('updateScore', function(scoreList) {
   document.querySelector('#memberList').remove();
   let newList = document.createElement('ol');
   newList.id = 'memberList';
   newList.className = 'memberList';
   newList.style.display = 'flex';

   scoreList.forEach(function (userScore) {
    let li = document.createElement('p');
    li.innerHTML = userScore.name + '&nbsp';
    newList.appendChild(li);
    li = document.createElement('p');
    li.innerHTML = userScore.score + '&nbsp&nbsp&nbsp&nbsp';
    newList.appendChild(li);
   })

   document.querySelector('#roomMembers').append(newList);
});

socket.on('endOneQA', function() {
    socket.emit('newQuestion');
});

socket.on('updateQandA', function(QandA) {
    // Delete the resultMsg of last QA
    let options = document.querySelector('#options');
    options.remove();
    options = document.createElement('ol');
    options.id = 'options';
    options.className = 'options';

    let optionArea = document.querySelector('#optionArea');
    optionArea.append(options);
    
    // Append question area
    let question = document.querySelector('#question');
    question.innerHTML = QandA.q;

    // Append option Area
    //let wrongNum = 1;

    let optionOl = document.querySelector('#options');
    let anOption = document.createElement('button');
    anOption.innerText = QandA.optionA;
    if (QandA.ans === "A") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionB;
    if (QandA.ans === "B") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionC;
    if (QandA.ans === "C") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    anOption = document.createElement('button');
    anOption.innerText = QandA.optionD;
    if (QandA.ans === "D") anOption.id = "ansBtn";
    else anOption.id = "wrongBtn";
    optionOl.appendChild(anOption);

    // Click right ans
    document.querySelector('#ansBtn').addEventListener('click', function(e) {
        document.querySelector('#ansBtn').remove();
        document.querySelectorAll('#wrongBtn').forEach((btn) => btn.remove());
        let correctMsg = document.createElement('h3');
        correctMsg.id = "resultMsg";
        correctMsg.className = "correctMsg";
        correctMsg.innerHTML = 'CORRECT!';
        document.querySelector('#options').append(correctMsg);

        // Return correctness to server
        socket.emit('makeAns', true);
    });

    // Click wrong ans
    document.querySelectorAll('#wrongBtn').forEach((btn => 
        btn.addEventListener('click', function(e) {
            document.querySelector('#ansBtn').remove();
            document.querySelectorAll('#wrongBtn').forEach((btn) => btn.remove());
            let wrongMsg = document.createElement('h3');
            wrongMsg.id = "resultMsg";
            wrongMsg.className = "wrongMsg";
            wrongMsg.innerHTML = 'Wrong Answer. Ans: ' + QandA.ans;
            document.querySelector('#options').append(wrongMsg);

            // Return wrongAns to server
            socket.emit('makeAns', false);
        })
    ));
});

socket.on('endGame', function(ranking) {
    // Ranking
    console.log('endGame');
    document.querySelector('#QAsidebar').remove();
    document.querySelector('#questionAndOptions').remove();
    let resultField = document.createElement('div');
    resultField.className = "resultField";
    let resEle = document.createElement('h3');
    resEle.className = 'rankingTitle';
    resEle.innerText = "Ranking";
    resultField.append(resEle);

    resEle = document.createElement('h3');
    resEle.className = "rankingRoom";
    resEle.innerHTML = '';
    resultField.append(resEle);

    resEle = document.createElement('ol');
    resEle.className = "rankingResult";
    ranking.forEach(function(user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        resEle.appendChild(li);
    });
    resultField.append(resEle);

    document.querySelector('#QA').append(resultField);

    let remainingTime = 5000;
    setInterval(() => {
        remainingTime -= 1000;
        if (remainingTime === 0) window.location.href = "../index.html";
    }, 1000);
});