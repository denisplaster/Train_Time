
//  Firebase database access
var config = {
  apiKey: "AIzaSyDDk9pc5gPeVyc52nTuuTDdofpUdA5s__I",
  authDomain: "train-time-7291c.firebaseapp.com",
  databaseURL: "https://train-time-7291c.firebaseio.com",
  projectId: "train-time-7291c",
  storageBucket: "train-time-7291c.appspot.com",
  messagingSenderId: "383434942977"
};
firebase.initializeApp(config);

var dataRef = firebase.database();

// set up variables for train tracking
var Train = "";
var destination = "";
var firstTime = "";
var Frequency = "";

// Capture Button Click
$("#add-train").on("click", function () {

  Train = $("#train-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTime = moment($("#time-input").val().trim(), "HH:mm").subtract(10, "years").format("X");
  Frequency = $("#frequency-input").val().trim();

  // Push data to database
  dataRef.ref().push({

    Train: Train,
    Destination: destination,
    firstTime: firstTime,
    Frequency: Frequency,
  });

  // after submit button has been pushed, reset the values w/o refreshing the page
  $("#train-input").val("Select");
  $("#destination-input").val("Select");
  $("#time-input").val("");
  $("#frequency-input").val("");

});

// create firebase event for when user adds train data
dataRef.ref().on("child_added", function (childSnapshot) {


  // store firebase variables
  var storeTrain = childSnapshot.val().Train;
  var storeDestination = childSnapshot.val().Destination;
  var storeFrequency = childSnapshot.val().Frequency;
  var storeFirstTime = childSnapshot.val().firstTime;

  // calculate the frequency time
  var storeRemainder = moment().diff(moment.unix(storeFirstTime), "minutes") % storeFrequency;
  var storeMinutes = storeFrequency - storeRemainder;

  // calculate arrival time
  var arrivalTime = moment().add(storeMinutes, "m").format("hh:mm A");


  // add train status to html table
  $("#Schedule > tbody").append("<tr><td>" + storeTrain + "</td><td>"
    + storeDestination + "</td><td>" + storeFrequency + " min</td><td>"
    + arrivalTime + "</td><td>" + storeMinutes + "</td></tr>");

});

// Clock funtion java
var clock = new Vue({
  el: '#clock',
  data: {
    time: '',
    date: ''
  }
});

var week = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
var timerID = setInterval(updateTime, 1000);
updateTime();
function updateTime() {
  var cd = new Date();
  clock.time = zeroPadding(cd.getHours(), 2) + ':' +
    zeroPadding(cd.getMinutes(), 2) + ':' + zeroPadding(cd.getSeconds(), 2);
  clock.date = zeroPadding(cd.getFullYear(), 4) + '-' +
    zeroPadding(cd.getMonth() + 1, 2) + '-' + zeroPadding(cd.getDate(), 2) + ' ' + week[cd.getDay()];
};

function zeroPadding(num, digit) {
  var zero = '';
  for (var i = 0; i < digit; i++) {
    zero += '0';
  }
  return (zero + num).slice(-digit);
}
