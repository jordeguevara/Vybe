const page = document.querySelector("#feed-container");
let uid;
let answers_ref;
let questionsRef;
let vybeChallengesRef;
let userRef;
let add_vybe_challenge = document.querySelector('.add-vybe-challenge');
let users_ref;
let firestore;



// LetsVybe Prototypes
/**
 * VybeChallenge
 * @param questions: an empty array to be filled with question objects
 * @param date: the real-time date grabbed as the object is created
 * @param dislikes: integer of people who selected dislike
 * @param likes: integer of people who selected like
 * @param private: a boolean to determine if vybechallenge is private or not
 * @param tags: an empty array to be filled with tag objects
 * @param uid: the user id who created the VybeChallenge object.
 * @constructor
 *   - assumes uid is already grabbed from firestore
 * @addQuestion
 *   - pushes a question to the VybeChallenge questions array
 * @addTag
 *   - pushes a tag to the VybeChallenge tags array
 * @uploadChallenge
 *   - uploads the VybeChallenge object to firestore
 */
function VybeChallenge(){
    this.questions = [];
    this.date = Date.now();
    this.dislikes = 0;
    this.likes = 0;
    this.private = false;
    this.tags = [];
    this.uid = uid;
}

VybeChallenge.prototype.addQuestion = function(questionID, validated){
    if(validated) {
        console.log("Pushing question: ", questionID);
        this.questions.push(questionID);
    } else{
        console.log("Question not pushed to Vybe Challenge.")
    }
}

// VybeChallenge.protoype.addTag = function(tagID, validated){
//     if(validated){
//         console.log("Pushing tags: ", tagID);
//         this.tags.push(tagID);
//     } else{
//         console.log("Tag not pushed to Vybe Challenge")
//     }
// }

VybeChallenge.prototype.uploadChallenge = function(){
    vybeChallengesRef.add({
        questions: this.questions,
        date: this.date,
        dislikes: this.dislikes,
        likes: this.likes,
        private: this.private,
        tags: this.tags,
        uid: this.uid
    }).then(result => {console.log('successfully uploaded challenge')}).catch(error => {console.log(error.message)});
}

/**
 * Question
 * @param question: a user input string
 * @param answerSet: a list of user input strings represent possible answers to a question
 * @param answerCorrect: an integer in {0, 1, 2, 3}
 * @param answerCount = an array representing the integer count of people who answered each question
 * @param answerUsersn = an array of users who answered answern where n is in {0, 1, 2, 3}
 * @constructor
 *   - input: question, answer0, answer1, answer2, answer3, answerCorrect, uid from forms on feed.html
 *   - output: Question object
 *@uploadQuestion
 *   - inputs a vybeChallenge object and an upload indicator
 */
function Question(question, answer0, answer1, answer2, answer3, answerCorrect){
    this.question = question;
    this.answerSet = [answer0, answer1, answer2, answer3];
    this.answerCorrect = answerCorrect;
    this.answerCount = [0, 0, 0, 0];
    this.answerUsers0 = [];
    this.answerUsers1 = [];
    this.answerUsers2 = [];
    this.answerUsers3 = [];
}

Question.prototype.uploadQuestion = function(vybeChallenge, upload){
    questionsRef.add({
        question: this.question,
        answerSet: this.answerSet,
        answerCount: this.answerCount,
        answerUsers0: this.answerUsers0,
        answerUsers1: this.answerUsers1,
        answerUsers2: this.answerUsers2,
        answerUsers3: this.answerUsers3,
    }).then(result => {
        console.log('question added successfully');
        console.log(result);
        // get the id of the question object from result and call the function to update the question id in the challenge
        console.log(result.id);
        vybeChallenge.addQuestion(result.id, true);
        if (upload){
            vybeChallenge.uploadChallenge();
            var modal= document.getElementById('myModal')
        }
    }).catch(error => {
        console.log(error.message);
    });
}
// Question.prototype.validate = function(){
//
// }

// function Tag(tag){
//     this.tag = tag
// }
//
// Tag.prototype.uploadTag = function(challenge, uploadChallenge){
//     tagsRef.add({
//         tag: this.tag,
//     }).then(result => {
//         console.log('tag added successfully');
//         console.log(result);
//         console.log(result.id);
//         challenge.addTag(result.id);
//         if (upload){
//             challenge.uploadChallenge();
//         }
//     }).catch(error => {
//         console.log(error.message);
//     });
// }



function createVybeChallengePrototype(){
    console.log("oy")
    var question = document.getElementById('vybeQuestion').value;
    console.log(question)
    var answers0, answer1, answer2, answer3;
    answer0 = document.getElementById('answerOne').value
    answer1 = document.getElementById('answerTwo').value
    answer2 = document.getElementById('answerThree').value
    answer3 = document.getElementById('answerFour').value
    var correctAnswer = parseInt($("input[type='radio'][name='optradio']:checked ").val()) - 1;
    
    var vybeChallenge = new VybeChallenge();
    var question = new Question(question, answer0, answer1, answer2, answer3, correctAnswer);
    question.uploadQuestion(vybeChallenge, true);
    // var correctAnswer = document.getElementById('')
    

}



window.onload = function(){

    // get firestore
    //    We want this inside because firebase takes time to load
    database_ref = firebase.firestore();

    // this is so because firebase recommends doing this
    database_ref.settings({/* your settings... */ timestampsInSnapshots: true});

    // more database refs
    vybeChallengesRef = database_ref.collection('vybeChallenges');
    console.log(vybeChallengesRef)
    userRef = database_ref.collection('users');
    questionsRef = database_ref.collection('questions');

    // If a user is logged in, load their information
    // Else redirect them to the login/register page, which is the landing page, index.html.
    firebase.auth().onAuthStateChanged(user => {
        if (user){
            var navPhoto = document.getElementById("navPhoto")
            var navName = document.getElementById("nav-name")
            var postAreaPhoto = document.getElementById("postarea-photo")
            navPhoto.setAttribute('src', user.photoURL);
            postAreaPhoto.setAttribute('src', user.photoURL)

            navName.innerHTML = user.displayName
            navName.setAttribute('style', 'color: #fff;')
            console.log(navPhoto)


            
            uid = user.uid;  // This is taking up unnecessary space.  We always have user and can always reference user.uid in constant time (k).
        } else {
            document.location.href = "index.html";
        }
    });


 
    // Create Global Feed
    //    1. Grab All Vybe Challenges
    //    2. For each Vybe Challenge:
    //         a. Create a Vybe Challenge div
    //         b. Get all questions associated with the Vybe Challenge and place in question_set
    //         c. For each question in the question_set:
    //                   i. Create/Fill a question div (child of Vybe Challenge)
    //                  ii. Create answer_set div (child of Vybe Challenge)
    //                 iii. Grab all answers associated with the question and place in answer_set
    //                 iii. For each answer in answer_set do the following:
    //                            a. Create/Fill answer div
    //

    // 1. Grab All Vybe Challenges
    console.log("START:  grab all vybe challenges");

    // To grab all global vybe challenges, we can go to our vybe challenges collection (vybeChallengesRef) and
    // find the set of vybe challenges where for each vybe challenge, the privacy is set to global.
    // querySnapshot is then used to...


    let allGlobalVybeChallenges = getGlobalVybeChallenges(vybeChallengesRef);
    // let allGlobalVybeChallenges = getGlobalVybeChallenges(userRef);
    // console.log(userRef)
    console.log("END:  grab all vybe challenges");

    // REST OF CODE NOT GONE OVER YET; hence, commented out
    // questions_ref = firestore.collection('questions');
    // console.log(questions_ref);
    // users_ref = firestore.collection('users');
    //
    // // Change listener.  Anytime something changes in the db we get that change back.
    // //
    // questions_ref.onSnapshot(snapshot => {
    //     let changes = snapshot.docChanges();
    //     changes.forEach(change => {
    //         if(change.type === 'added'){
    //             get_answer_and_make_post(change.doc);
    //         }
    //     });
    // });
    window.alert("everything loaded")
}

function getQuestion(questionsRef, qid){
    let question = questionsRef.doc(qid).get();
    return question
}

function getGlobalVybeChallenges(vybeChallengesRef){
    let allGlobalVybeChallenges = vybeChallengesRef
        .get()
        .then(function(querySnapshot){
            console.log("... grabbing global challenges ...");
            // console.log(querySnapshot)
            // if (doc.exists) {
            //     console.log("Document data:", doc.data());
            // } else {
            //     // doc.data() will be undefined in this case
            //     console.log("No global challenges in database or an error");
            // }
        

            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshot
                console.log(doc.id, '=>', doc.data());
                console.log(" - creating challenge div");
                createFeedPost(doc.data())
              
            });
            console.log("... done grabbing global challenges ...")
        })
        .catch(function(error){
            console.log("Error getting global vybe challenge: ", error);
        });

    // userRef.get().then(function(querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //         createFeedPost(doc.data());

    //     });
    // });
    
}


/*
Create Feed Post to populate feed (vybeView is container for the feed)
takes a user Object as parameter and extracts properties 
*/
async function  createFeedPost(vybechallenge) {
    // Get the required attributes from the vybechallenge.
    let uid = vybechallenge.uid;
    var questionsList = vybechallenge.questions;
    let questions = [];
    let user;

    // Get the question object.
    await questionsList.forEach(question => {
        questionsRef.doc(question).get().then(querySnapshot => {
            questions.push(querySnapshot.data())
        })
    })

    // Get the user to populate name and the photo
    await userRef.doc(uid).get()
        .then(doc => {
            user = doc.data()
        }).catch(error => {
            console.log(error.message);
        })

    renderFeed(user, questions);
}

function renderFeed(user, questions){
    console.log('in  create object is : ')
    console.log(user.name)
    var ul = document.getElementById('feed-list')
    var li = document.createElement('li');

    var label = document.createElement('label')
    label.setAttribute('class', 'name-title  news__header--title')
    label.innerHTML = user.name;


    var containerDiv = document.createElement('div')
    containerDiv.setAttribute('class', 'news')
    var feed = document.createElement('div')
    feed.setAttribute('class', 'news__header')
    var profileImage = document.createElement('img')
    profileImage.setAttribute('src', user.photoURL)
    /*
    Having some trouble creating SVGs with use dynamically with JS 

    // var svgElem = document.createElementNS('img/flash.svg#Capa_1"', 'svg'),
    // var useElem = document.createElementNS('img/flash.svg#Capa_1"', 'use');

    // useElem.setAttributeNS('img/flash.svg#Capa_1"', 'xlink:href', '#down-arrow');

    // svgElem.appendChild(useElem);
    */
    profileImage.setAttribute('class', 'user-nav__user-photo news__header--img')
    var userContent = document.createElement('div');
    userContent.setAttribute('class', 'news__userContent')
    userContent.innerHTML = '<p> ' + questions[0].question + '</p>'
    var vybeButton = document.createElement("button")
    vybeButton.setAttribute('class', 'news__activity__btn')
    var span = document.createElement('span')
    span.setAttribute('class', 'news__activity--icon')
    var playButton = document.createElement("button")
    playButton.setAttribute('class', 'news__activity__btn')
    var optionButton = document.createElement("button")
    optionButton.setAttribute('class', 'news__activity__btn')
    var newsActivity = document.createElement('div')
    newsActivity.setAttribute('class', 'news__activity');   
    var vybeSpan = document.createElement('span')
    vybeSpan.setAttribute('class', 'news__activity--icon')
    vybeImage = document.createElement('img')
    vybeImage.setAttribute('src', 'img/vybe.png')
    vybeImage.setAttribute('class','user-nav__icon')
    vybeSpan.appendChild(vybeImage)
    vybeButton.appendChild(vybeSpan)




    newsActivity.appendChild(vybeButton)
    newsActivity.appendChild(playButton)
    newsActivity.appendChild(optionButton)
    containerDiv.appendChild(feed)
    containerDiv.appendChild(userContent)
    containerDiv.appendChild(newsActivity)
    feed.appendChild(profileImage)
    feed.appendChild(label)

    li.appendChild(containerDiv)
    ul.appendChild(li)
}


function setChallengeVyberInfo(uid){
    let challenge_vyber_div = document.createElement('div');
    challenge_vyber_div.setAttribute('class', 'challenge-vyber');
    let challenge_vyber_img = document.createElement('img');
    challenge_vyber_img.setAttribute('class', 'challenge-vyber-img');
    let challenge_vyber_name = document.createElement('p');
    challenge_vyber_name.setAttribute('class', 'challenge-vyber-name')
    challenge_vyber_div.appendChild(challenge_vyber_img);
    challenge_vyber_div.appendChild(challenge_vyber_name);
    users_ref.doc(uid).get()
        .then(result => {
            challenge_vyber_img.src = result.data().photoURL;
            challenge_vyber_name.innerHTML = result.data().name;
        }).catch(error => {
        console.log(error.message);
    })
    return challenge_vyber_div
}

function createChallengeDiv(vybeChallenge) {
    questions_array = vybeChallenge.get("questions");
    console.log("questions array: ", vybeChallenge.get("questions"));

    for (question in questions_array){
        console.log("question exists: ", questions_array[question]);
        // now that we know the question exists we must grab it from our database
        question = getQuestion(questionsRef, questions_array[question])
            .then(q => {
            console.log(q);
        });

    }
    //
    // console.log(question.data());
    //
    // // Create a div to house the challenge
    // let challenge_div = document.createElement('div');
    // challenge_div.setAttribute('class', 'challenge');
    //
    // // Create a div to house the image and name of the vyber whose challenge it is
    // let challenge_vyber_div = set_challenge_vyber_info(question.uid);
    // challenge_div.appendChild(challenge_vyber_div);
    //
    // // Create a div to house the question
    // let question_div = set_challenge_question(question.uid);
    //
    // // Create a div to house the answer set and create answers within
    // //    Note:  answer_set_div has answer_div children
    // let answer_set_div = set_challenge_answer_set(question.uid);
    //
    // // Add a listener
    // option.addEventListener('click', function(){
    //     let curr_num = this.getAttribute('id').slice(-1);
    //     let curr_post_id = this.parentElement.parentElement.getAttribute('id');
    //     for (let j = 0; j < 4; j++){
    //         document.getElementById(curr_post_id +j).classList.remove('selected');
    //         document.getElementById(curr_post_id +j).classList.add('not_selected');
    //     }
    //     option.classList.add('selected');
    //     answers_ref.doc(post_id).set({answer: curr_num}, {merge: true});
    // })
    //
    //

}
// function set_challenge_question(question){
//     question_div = document.createElement('div');
//     question_div.setAttribute('class', 'question');
//     question_div.innerHTML = question.question;
//     return question_div
// }

// function set_challenge_answer_set(question){
//     let answer_set_div = document.createElement('div');
//     answer_set_div.setAttribute('class', 'answers');
//     for( let i = 0; i < question.answers.length; i++){
//         let answer_div = document.createElement('p');
//         if(post_answer == i){
//             answer_div.setAttribute('class', 'option selected');

//         } else{
//             answer_div.setAttribute('class', 'option not_selected');
//         }
//         answer_div.innerHTML = question.answers[i];
//         answer_set_div.appendChild(answer_div);
//     }
// }
// function create_feed(question_obj, post_answer){



//     option.addEventListener('click', function(){
//         let curr_num = this.getAttribute('id').slice(-1);
//         let curr_post_id = this.parentElement.parentElement.getAttribute('id');
//         for (let j = 0; j < 4; j++){
//             document.getElementById(curr_post_id +j).classList.remove('selected');
//             document.getElementById(curr_post_id +j).classList.add('not_selected');
//         }
//         option.classList.add('selected');
//         answers_ref.doc(post_id).set({answer: curr_num}, {merge: true});
//     })


//     feed_div.appendChild(question_div);
//     feed_div.appendChild(answer_div);

//     page.appendChild(feed_div);
// }
//function makeVybeChallenge(){};
// //answers_ref = firestore.collection('users').doc(uid).collection('answers');

//
// function get_answer_and_make_post(question_obj){


//     answers_ref.doc(question_obj.id).get()
//         .then(result=>{
//             if (result.exists){
//                 create_feed(question_obj, result.data().answer)

//             } else {
//                 create_feed(question_obj, null)
//             }
//         }).catch(error=>{
//         console.log(error.message);
//         create_feed(question_obj, null)
//     })
// }

// BIJESH: Fill out what this does please. (k).
// function validateQuestion(que, ans, idx){
//     return true;
// }

function toggleQuestion(questionObj){
    
    var questionDiv = document.createElement('div')
    questionDiv.setAttribute('style','text-align:center;')
    var questionAsked = document.createElement('div')
    questionAsked.innerHTML = questionObj.question

    var form = document.createElement('form')
    var radio = document.createElement('div')
    radio.setAttribute('class','radio')

    questionDiv.appendChild(questionAsked)
    questionDiv.appendChild(form)
    form.appendChild(radio)

    return questionDiv

}


// });

/* Adds an eventListenter to every play-btn and manipulates DOM when it pressed */
var isVybeClick = false;
var isPlayClick = false;
var isQuestionAnswered = false;

document.querySelectorAll(".play-btn").forEach(function (element) {
    element.addEventListener("click", function () {
    if (isVybeClick === false) {
    var re = element.parentNode.parentNode
    var newE = document.createElement('div');
    var submitBtn = document.createElement('button');
    submitBtn.innerHTML = " Submit me "
    newE.innerHTML = toggleQuestion(userId.question.question)
    console.log(re)
    var userContent = document.getElementById('userContent');
    console.log(userContent)
    re.replaceChild(newE, userContent)
    newE.appendChild(submitBtn)
    submitBtn.addEventListener('click',function(){
        var results = document.createElement('div')
        results.innerHTML = "results"
        re.replaceChild(results,newE)
    })
}
if (isVybeClick === true)
    window.alert("you already clicked dawg")
isVybeClick = true

});
});