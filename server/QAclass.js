class allQAs{
    constructor(){
        this.QAdatabase = [{
                q: "Which cat is usually the fattest?",
                optionA: "Persion cat",
                optionB: "Russia Blue cat",
                optionC: "Orange cat",
                optionD: "Calico cat",
                ans: "C"
            },{
                q: "Where is the capital of Canada?",
                optionA: "Toronro",
                optionB: "Vancouver",
                optionC: "Ontario",
                optionD: "Ottawa",
                ans: "D"
            }, {
                q: "How long is the average lifespan of a cat?",
                optionA: "7 years",
                optionB: "13 years",
                optionC: "18 years",
                optionD: "22 years",
                ans: "B"
            }, {
                q: "When is the International Cat Day?",
                optionA: "3/20",
                optionB: "5/10",
                optionC: "8/8",
                optionD: "11/25",
                ans: "C"
            }, {
                q: "When is Harry Potter's birthday?",
                optionA: "8/31",
                optionB: "9/30",
                optionC: "10/31",
                optionD: "12/31",
                ans: "A"
            }
        ]
    }

    addQA(q, optionA, optionB, optionC, optionD, ans)
    {
        let QA = {q, optionA, optionB, optionC, optionD, ans};
        this.QAdatabase.push(QA);
    }

    getQAs(){
        let QAs = [0, 1, 2, 3, 4];
        return QAs;
    }

    getQA(index){
        return this.QAdatabase[index];
    }
}

module.exports = {allQAs};