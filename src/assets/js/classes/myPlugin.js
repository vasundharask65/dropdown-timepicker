(function()
{
	/* Register plugin in window object */	
	this.myPlugin = function()
	{
		const defaults = {
			ElementId: "timeInput",
			DropdownWidth: 0,
			DropdownHeight: 350,
			PickerSettings:{
				Is12HourFormat: false,
				ShowMeridiem: true,
				IntervalTime: 30, //in minutes
				IncludeSeconds: false,
				HideOnOutsideClick: true,
				DisabledTimes: [],
				beforeRender: function() {

				},
				afterRender: function() {

				},
			}
		}; 

		this.styleProperties = {
			ClassName: "picker-dropdown",
			DisabledClass: "disabled",
			HoverClass: "time-hover"
		}
		
		this.settings = (arguments[0] && typeof arguments[0] === 'object') ? extendDefaults(defaults, arguments[0]) : defaults;
		
		this.init();
	}
	
	/* PUBLIC METHODS */
	myPlugin.prototype.init = function(){

		//Create dropdown and Set dropdown height & width for that passed element
		build.call(this);

		//Generating Time intervals based on user input
		let timeIntervals = this.generateTimeIntervals(this.settings.PickerSettings.IntervalTime,
								   this.settings.PickerSettings.Is12HourFormat);

		//Display the time entries
		this.setTimeIntervals.call(this,timeIntervals);

		this.getElement("myDropdown ul").addEventListener("click", function(e) {
			if (e.target && e.target.matches("li.item")) {
			  e.target.className = "foo"; // new class name here
			  alert("clicked " + e.target.innerText);
			}
		  });
	}
	
	myPlugin.prototype.generateTimeIntervals = function(interval, is12HourFormat){
		const meridiems = ["AM", "PM"];

		let times = [];
		let startHourInMinute = 0;
		let formatTime = is12HourFormat ? 12 : 24;

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


	myPlugin.prototype.setTimeIntervals = function(intervals) {
		let timeDropdown = document.getElementsByClassName(this.styleProperties.ClassName);
		let pickerULElement = document.createElement("ul");
		timeDropdown[0].appendChild(pickerULElement);

		if (timeDropdown[0] && intervals && intervals.length > 0) {
			intervals.forEach((item) => {
			  let li = createLIElement.call(this, timeDropdown, item);
			  this.validateIntervalHandler(li); //To validate the interval created
			  pickerULElement.appendChild(li);
			});
		} 
	}


	myPlugin.prototype.validateIntervalHandler = function(interval) {
		//Method to modify/validate the li created
	}


	/* PRIVATE METHODS*/
	//Combining default options, user given options
	function extendDefaults(defaults, properties)
	{
		Object.keys(properties).forEach(property => {
			if(properties.hasOwnProperty(property))
			{
				defaults[property] = properties[property];
			}
		});
		return defaults;
	} 


	//Setting Dropdown CSS height & width
	function build() {
		let pickerDropdown = document.createElement("div");
		pickerDropdown.setAttribute("id", "myDropdown");
		pickerDropdown.classList.add(this.styleProperties.ClassName);
		
		//To show the dropdown below the input div
		let ele = getElement(this.settings.ElementId);
		if(ele) {
			ele.appendChild(pickerDropdown);
		}

		let width = this.settings.DropdownWidth;
		let height = this.settings.DropdownHeight;

		if(width != 0){
			pickerDropdown.style.width = width + "px";
		}
	
		if(height != 0){
			pickerDropdown.style.height = height + "px";
		}

		//TODO: To set Bg color
	} 


	//Method to get element Info
	function getElement(elementId){
		return document.getElementById(`${elementId}`);
	}
	

	//Method to create li element for each time interval
	function createLIElement(timeDropdown, item) {
		var li = document.createElement("li");
		li.classList.add(this.styleProperties.HoverClass);
	
		//On select of value, appending to input
		li.addEventListener("click", function (event) {
			if (!event.target.classList.contains(this.styleProperties.DisabledClass)) {
				input.value = event.target.innerText;
				timeDropdown.classList.add("hide");
				return;
			}
		});
	
		var text = document.createTextNode(item);
		li.appendChild(text);
		return li;
	}
}());

