export { createFeedPost }
// Initialize Cloud Firestore through Firebase
var db = firebase.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

window.onload = function () {

    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user)
        if (user) {
            // User is signed in.

            if (user != null) {
                var navPhoto = document.getElementById("navPhoto")
                var navName = document.getElementById("nav-name")
                var postAreaPhoto = document.getElementById("postarea-photo")
                navPhoto.setAttribute('src', user.photoURL);
                postAreaPhoto.setAttribute('src', user.photoURL)

                navName.innerHTML = user.displayName
                navName.setAttribute('style', 'color: #fff;')
                console.log(navPhoto)


            }
            else
                console.log('user not logged in')
        }

        
    });




    var breakpoint = 1199;
    var streakContainer = document.querySelector('div.streaks')
    console.log(window.outerWidth)
    if (window.outerWidth < breakpoint)
        streakContainer.style.cssText = "display: none;";
    else
        /* try to make the layout more responsive, still trying to read docs to find a better way */
        window.onresize = function () {
            if (window.outerWidth < breakpoint) {

                streakContainer.style.cssText = "display: none;";
            }

            else if (window.outerWidth > breakpoint) {
                streakContainer.style.cssText = "display: block;";
            }

        }
}

document.addEventListener("DOMContentLoaded", event => {
    const firestore = firebase.firestore();
    const settings = {/* your settings... */ timestampsInSnapshots: true };
    firestore.settings(settings);


    firebase.auth().onAuthStateChanged(function (user) {
        console.log(user)
        if (user) {
            // User is signed in.

            if (user != null) {
                var navPhoto = document.getElementById("navPhoto")
                var navName = document.getElementById("nav-name")

                navPhoto.setAttribute('src', user.photoURL);
                navName.innerHTML = user.displayName
                console.log(navPhoto)

            }
            else
                console.log('user not logged in')




            // ...

        } else {
            window.location = '/'; //If not logged in, routes you back to login page
            console.log("youred logged out")

        }


        var userId = {
            photo: "",
            name: "",
            content: ""

        }



        var user = firebase.auth().currentUser;
        var name, email, photoUrl, uid, emailVerified;

        if (user != null) {
            name = user.displayName;
            email = user.email;
            photoUrl = user.photoURL;
            emailVerified = user.emailVerified;
            uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
            // this value to authenticate with your backend server, if
            // you have one. Use User.getToken() instead.
            userId.name = name;
            userId.photo = photoUrl
            userId.content = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. Asperiore orem ipsum dolor sit amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. Aorem ipsum dolor sit amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. A orem ipsum dolor sit amet consectetur adipisicing elit. Asperiore it amet consectetur adipisicing elit. A"
            createFeedPost(userId);
            scaleContainerHeight(vybeView);
        }

    });

});

/* Adds an eventListenter to every vybe-btn and manipulates DOM when it pressed */
var isVybeClick = false;
document.querySelectorAll(".vybe-btn").forEach(function (element) {
    element.addEventListener("click", function () {
        // Increase  Vybe(Like counter)

    });
});

/* Adds an eventListenter to every play-btn and manipulates DOM when it pressed */
var isPlayClick = false;
var isQuestionAnswered = false;
document.querySelectorAll(".play-btn").forEach(function (element) {
    element.addEventListener("click", function () {
        if (isVybeClick === false) {
            var re = element.parentNode.parentNode
            var newE = document.createElement('div');
            var submitBtn = document.createElement('button');
            submitBtn.innerHTML = " Submit me "
            newE.innerHTML = '<div> question</div>'
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

/* Adds an eventListenter to every options-btn and manipulates DOM when it pressed */
document.querySelectorAll(".option-btn").forEach(function (element) {
    element.addEventListener("click", function () {

    });
});

/*
Create Feed Post to populate feed (vybeView is container for the feed)
takes a user Object as parameter and extracts properties 
*/
function createFeedPost(userId) {
    var ul = document.getElementById('feed-list')
    var li = document.createElement('li');

    var label = document.createElement('label')
    label.setAttribute('class', 'name-title  news__header--title')
    label.innerHTML = userId.name;


    var containerDiv = document.createElement('div')
    containerDiv.setAttribute('class', 'news')
    var feed = document.createElement('div')
    feed.setAttribute('class', 'news__header')
    var profileImage = document.createElement('img')
    profileImage.setAttribute('src', userId.photo)
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
    userContent.innerHTML = '<p> ' + userId.content + '</p>'
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

//For testing purposes only, dont forget to erase

var vybeView = document.getElementById('vybeView')

//create method that automates the height of vybeView when contents are added or pulled from the DB for a certain number of posts
function scaleContainerHeight(element) {
    if (element.offsetHeight < element.scrollHeight) {
        var height = element.offsetHeight
        var newHeight = height + element.scrollHeight;
        element.style.height = newHeight + 'px'
    }
}




function deleteFeedPost(x) {
    x.removeChild(x.li);
}

// document.getElementById("options-btn").addEventListener("click", function(){

// }); 

// let deleteBtn = document.getElementsByClassName("news__activity__btn")

// Array.prototype.slice.call(deleteBtn).forEach(function(item) {
//     // iterate and add the event handler to it
//     item.addEventListener("click", function(e) {
//           var feed = document.querySelector('news')
//         //   var children = Array.prototype.slice.call(feed.children);



//          feed.parentNode.removeChild(feed);

//   })
// })

// postQuesttion(){

// }