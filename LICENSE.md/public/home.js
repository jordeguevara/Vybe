
const page = document.querySelector("#feed-container");
let uid;
let answers_ref;
let questions_ref;
let submit_question = document.querySelector('#submit-question');
let users_ref;


window.onload = function(){
    let firestore = firebase.firestore();
    firestore.settings({/* your settings... */ timestampsInSnapshots: true});

    firebase.auth().onAuthStateChanged(user => {
        if (user){
            uid = user.uid;
            answers_ref = firestore.collection('users').doc(uid).collection('answers');
        } else {
        //    document.location.href = "index.html";
        }
    });


    questions_ref = firestore.collection('questions');
    users_ref = firestore.collection('users');

    questions_ref.onSnapshot(snapshot => {
        let changes = snapshot.docChanges();
        changes.forEach(change => {
            if(change.type === 'added'){
                get_answer_and_make_post(change.doc);
            }
        });
    });

}


function create_feed(question_obj, post_answer){

    console.log(question_obj.data());

    let question = question_obj.data();
    let post_id = question_obj.id;


    // Create a div to house the question
    let feed_div = document.createElement('div');
    feed_div.setAttribute('class', 'feed');
    feed_div.setAttribute('id', post_id);

    // Create a div to get the image and name of the posting user
    let user_info = document.createElement('div');
    user_info.setAttribute('class', 'posting-user-info');

    let user_img = document.createElement('img');
    user_img.setAttribute('class', 'posting-user-img');

    let user_name = document.createElement('p');
    user_name.setAttribute('class', 'posting-user-name');

    user_info.appendChild(user_img);
    user_info.appendChild(user_name);

    get_posting_user_profile(user_img, user_name, question.uid);

    feed_div.appendChild(user_info);

    // Create a question element
    let question_div = document.createElement('div');
    question_div.setAttribute('class', 'question');
    question_div.innerHTML = question.question;

    // Create answer div
    let answer_div = document.createElement('div');
    answer_div.setAttribute('class', 'answers');

    // Create different options
    for (let i = 0; i < question.answers.length; i++){
        // Create an option


        let option = document.createElement('p');
        option.setAttribute('id', post_id + i);


        if (post_answer == i){
            option.setAttribute('class', 'option selected');
        } else {

            option.setAttribute('class', 'option not_selected');
        }

        option.innerHTML = question.answers[i];
        answer_div.appendChild(option);


        option.addEventListener('click', function(){
            let curr_num = this.getAttribute('id').slice(-1);
            let curr_post_id = this.parentElement.parentElement.getAttribute('id');
            for (let j = 0; j < 4; j++){
                document.getElementById(curr_post_id +j).classList.remove('selected');
                document.getElementById(curr_post_id +j).classList.add('not_selected');
            }
            option.classList.add('selected');
            answers_ref.doc(post_id).set({answer: curr_num}, {merge: true});
        })
    }

    feed_div.appendChild(question_div);
    feed_div.appendChild(answer_div);

    page.appendChild(feed_div);
}


function get_answer_and_make_post(question_obj){
    let answer = -1;
    answers_ref.doc(question_obj.id).get()
        .then(result=>{
            if (result.exists){
                create_feed(question_obj, result.data().answer)

            } else {
                create_feed(question_obj, null)
            }
        }).catch(error=>{
            console.log(error.message);
            create_feed(question_obj, null)
    })
}

function validate_question(que, ans, idx){
    return que && ans[0] && ans[1] && ans[2] && ans[3] && idx !== 0;
}


submit_question.addEventListener('click', function(){
    let question = document.querySelector('#upload');
    let option0 = document.querySelector('#option0');
    let option1 = document.querySelector('#option1');
    let option2 = document.querySelector('#option2');
    let option3 = document.querySelector('#option3');
    let correct = document.querySelector('#answer');
    let answers = [option0.value, option1.value, option2.value, option3.value];


    if (validate_question(question.value, answers, correct.selectedIndex)){
        questions_ref.add({
            question: question.value,
            answers: answers,
            correct: (correct.selectedIndex + 1).toString(),
            uid: uid
        })

        // Reset all the fields
        question.value = '';
        option0.value = '';
        option1.value = '';
        option2.value = '';
        option3.value = '';
        correct.selectedIndex = 0;
    } else {
        window.alert('One or more fields are invalid');
    }

});


function get_posting_user_profile(user_img, user_name, uid){
    users_ref.doc(uid).get()
        .then(result => {
            user_img.src = result.data().photoURL;
            user_name.innerHTML = result.data().name;
        }).catch(error => {
            console.log(error.message);
    })
}


