//For maintainability, we go for classes
class TimePicker {
  constructor(config) {
    //Setting Default options
    this.defaultOptions = {
      Is12HourFormat: false,
      ShowMeridiem: true,
      IntervalTime: 30, //in minutes
      IncludeSeconds: false,
      HideOnOutsideClick: true,
      DropdownWidth: 0,
      DropdownHeight: 350,
      DisabledTimes: ["00:00 AM", "16:30 PM"]
    };  

    if (typeof config == "object")
      this.defaultOptions = { ...this.defaultOptions, ...config };

    //Calling init function
    this.init();
  }

  //init function
  init() {
    //Set dropdown height & weight
    setDropdownProperty(
      this.defaultOptions.DropdownHeight,
      this.defaultOptions.DropdownWidth
    );

    //Settings default start & end time
    let timeIntervals = this.generateTimeIntervals(
      this.defaultOptions.IntervalTime,
      this.defaultOptions.Is12HourFormat
    );

    //Display the time entries
    this.setTimeIntervals(timeIntervals);

    //Disabling the time entries 
    if(this.defaultOptions.DisabledTimes && this.defaultOptions.DisabledTimes.length > 0){
      disableTime(this.defaultOptions.DisabledTimes);
    }

    //Highlight the value based on the input
    setHighlightDropdown();
  }

  generateTimeIntervals(interval,is12HourFormat) {
    let times = [];
    let startHourInMinute = 0;
    let formatTime = is12HourFormat ? 12 : 24;
    const meridiems = ["AM", "PM"];

    //loop to increment the time and push results in array
    for (let i = 0; startHourInMinute < 24 * 60; i++) {
      var hh = Math.floor(startHourInMinute / 60); // getting hours of day in 0-24 format
      var mm = startHourInMinute % 60; // getting minutes of the hour in 0-55 format
      times[i] =
        ("0" + (hh % formatTime)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        " " +
        meridiems[Math.floor(hh / 12)];
      startHourInMinute = startHourInMinute + interval;
    }
    return times;
  }

  setTimeIntervals(intervals) {
    const input = document.getElementById("timeValue");
    const pickerULElement = document.getElementById("pickerUL");
    const timeDropdown = document.getElementById("myDropdown");

    if (pickerULElement && intervals && intervals.length > 0) {
      intervals.forEach(function (item) {
        var li = document.createElement("li");
        li.classList.add("time-hover");

        //On select of value, appending to input
        li.addEventListener("click", function (event) {
          if(!event.target.classList.contains("disabled")){
            input.value = event.target.innerText;
            timeDropdown.classList.add("hide");
            return;
          }
        });

        var text = document.createTextNode(item);
        li.appendChild(text);
        pickerULElement.appendChild(li);
      });
    } 

    // Close the dropdown menu if the user clicks outside of it
    const targetDiv = document.querySelector(".main-container");
    document.addEventListener("click", (event) => {
      if (
        this.defaultOptions.HideOnOutsideClick &&
        event.target.contains(targetDiv)
      ) {
        const timeDropdown = document.getElementById("myDropdown");
        timeDropdown.classList.add("hide");
      }
    });

    //On hovering the li of time, calling function
    const liElements = document.getElementsByTagName("li");
    Object.keys(liElements).forEach((i) => {
      //Need to find work around for not adding hover to elements containing class
        liElements[i].addEventListener("mouseenter", function (e) {
          onTimeHoverCallback(e, e.target.innerText);
        });
    });
  }
}

//On click of input toggle dropdown
function showDropdown() {
  const timeDropdown = document.getElementById("myDropdown");

  //Calling when showing the dropdown & removes the already selected dropdown value
  setHighlightDropdown();

  if (timeDropdown && timeDropdown.classList.contains("hide")) {
    //Calling a function before opening the dropdown
    beforeDropdownOpenCallback();
    timeDropdown.classList.remove("hide");
    return;
  }
  timeDropdown.classList.add("hide");
}

//Highlight the value based on value in the input
function setHighlightDropdown() {
  const input = document.getElementById("timeValue").value;
  if (input) {
    const liElements = document.getElementsByTagName("li");
    var arr = [...liElements]; //Converting to array
    arr.forEach((i) => {
      if (i.innerText.match(input)) {
        i.classList.add("selected");
        return;
      }
      i.classList.remove("selected");
    });
  }
} 


//Settings Dropdown CSS height & width
function setDropdownProperty(height, width) {
  const timeDropdown = document.getElementById("myDropdown");
  if(width != 0){
    timeDropdown.style.width = width + "px";
  }

  if(height != 0){
    timeDropdown.style.height = height + "px";
  }
} 

//On Hovering the time callback function
function onTimeHoverCallback(element, selectedTime){
  element.target.style.color = "red";

  // reset the color after a short delay
  setTimeout(function () {
    element.target.style.color = "";
  }, 500);
} 

//Before opening the dropdown
function beforeDropdownOpenCallback() {
  console.log("before Dropdown Open Callback");
} 

//To disable the time 
function disableTime(entries){
  if(entries && entries.length > 0){
    const liElements = document.getElementsByTagName("li");
    var arr = [...liElements]; //Converting to array
    entries.forEach((i) => {
      for (let index = 0; index < arr.length; index++) {
        const element = arr[index];
        if(element.textContent == i){
          element.classList.add("disabled");
          return;
        }
      }
    });
  }
}
