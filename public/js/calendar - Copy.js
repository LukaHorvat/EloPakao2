
function setupCalendar(){
	var dateDate = new Date();

	var dateToday = new Date(dateDate);
	var dateLastMonth = new Date(dateToday);
	var dateNextMonth = new Date(dateToday);
	dateLastMonth.addMonths(-1);
	dateNextMonth.addMonths(1);

	var daysThisMonth = Date.getDaysInMonth(dateToday.getFullYear(), dateToday.getMonth());
	var daysLastMonth = Date.getDaysInMonth(dateLastMonth.getFullYear(), dateLastMonth.getMonth());

	var thisMonthStartingDay = dateToday.moveToFirstDayOfMonth().getDay();
	dateToday = new Date(dateDate);
	if (thisMonthStartingDay == 0) thisMonthStartingDay = 7;
	var lastMonthEndingDay = thisMonthStartingDay - 1;

	console.log(thisMonthStartingDay);
	console.log(dateToday);
	console.log(daysLastMonth);
	console.log(dateLastMonth);
	console.log(daysThisMonth);
	console.log();

	var daysEnum = new Array();
	
	for (var i = 0; i < lastMonthEndingDay; ++i){
		$("#calendar-cell-" + i).addClass("last-month").addClass("date-" + (daysLastMonth - lastMonthEndingDay + i + 1) + "-" + (dateLastMonth.getMonth()+1) + "-" + dateLastMonth.getFullYear());
		$("#calendar-cell-" + i + " > .calendar-number").html(daysLastMonth - lastMonthEndingDay + i + 1);
		daysEnum.push(daysLastMonth - lastMonthEndingDay + i + 1);
	}
	for (var i = 0; i < daysThisMonth ; ++i){
		$("#calendar-cell-" + (i + thisMonthStartingDay - 1)).addClass("current-month").addClass("date-" + (i+1) + "-" + (dateToday.getMonth()+1) + "-" + dateToday.getFullYear());
		$("#calendar-cell-" + (i + thisMonthStartingDay - 1) + " > .calendar-number").html(i + 1);
		daysEnum.push(i + 1);
	}
	for (var i = 1; i < 6*7 - daysThisMonth - thisMonthStartingDay + 2; ++i){
		$("#calendar-cell-" + (i + daysThisMonth + thisMonthStartingDay - 2)).addClass("next-month").addClass("date-" + i + "-" + (dateNextMonth.getMonth()+1) + "-" + dateNextMonth.getFullYear());
		$("#calendar-cell-" + (i + daysThisMonth + thisMonthStartingDay - 2) + " > .calendar-number").html(i);
		daysEnum.push(i + 1);
	}

	$(".last-month > .calendar-item, .next-month > .calendar-item").css("background-color", "#415262");

	// ADD OPACITY FOR TODAY
	$("#calendar-cell-" + (lastMonthEndingDay + dateToday.getDate() - 1) + " > .calendar-item").css("background-color", "#415262");

	console.log(JSON.stringify(daysEnum));


	/// ADD DATES

	var events = new Array();
	function newEvent(name, day, month, year, hour, minute){
		this.name = name;
		this.day = day;
		this.month = month;
		this.year = year;
		this.hour = hour;
		this.minute = minute;
	}
	events.push(new newEvent("dvanaesti", 12, 3, 2014, 12, 00));
	events.push(new newEvent("trinaesti", 13, 3, 2014, 11, 00));
	events.push(new newEvent("sedamnaesti", 17, 3, 2014, 15, 00));
	events.push(new newEvent("sedamnaestasti", 17, 3, 2014, 16, 00));

	console.log(JSON.stringify(events));


	for (var i = 0; i < events.length; ++i){
		$(".date-" + events[i].day + "-" + events[i].month + "-" + events[i].year + " > .calendar-item")
			.append("<div class=\"btn-group\">" + 
						"<button type=\"button\" class=\"btn btn-primary dropdown-toggle\" data-toggle=\"dropdown\">" +
							events[i].name + "<span class=\"caret\"></span>" +
						"</button>" +
						"<ul class=\"dropdown-menu\" role=\"menu\">" +
							"<li><a href=\"#\">Action</a></li>" +
							"<li><a href=\"#\">Another action</a></li>" +
							"<li><a href=\"#\">Something else here</a></li>" +
							"<li class=\"divider\"></li>" +
							"<li><a href=\"#\">Separated link</a></li>" +
						"</ul>" +
					"</div>");
	}
	
	//$("#calendar-cell-" + 0 + " > .calendar-item").append("<div class=\"event \"></div>");

}

$( document).ready( setupCalendar);

console.log("Calendar.js works");