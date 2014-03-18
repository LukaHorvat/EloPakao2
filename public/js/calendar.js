
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

	$(".last-month, .next-month").css("background-color", "#415262");

	// ADD OPACITY FOR TODAY
	$("#calendar-cell-" + (lastMonthEndingDay + dateToday.getDate() - 1)).css("background-color", "#415262");

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
	events.push(new newEvent("trinaesti", 17, 3, 2014, 11, 00));
	events.push(new newEvent("sedamnaesti", 17, 3, 2014, 15, 00));
	events.push(new newEvent("sedamnaestasti", 17, 3, 2014, 16, 00));

	events.sort( function (a,b){
		if 		(a.year   > b.year) return 1;
		else if (a.year   < b.year) return -1;
		else if (a.month  > b.month) return 1;
		else if (a.month  < b.month) return -1;
		else if (a.day    > b.day) return 1;
		else if (a.day    < b.day) return -1;
		else if (a.hour   > b.hour) return 1;
		else if (a.hour   < b.hour) return -1;
		else if (a.minute > b.minute) return 1;
		else if (a.minute < b.minute) return -1;
		else if (a.name   > b.name) return 1;
		else return -1;
	});

	console.log(JSON.stringify(events));


	for (var i = 0; i < events.length; ++i){
		var color = "primary";
		if (i > 0) 
			if (events[i].day == events[i-1].day && events[i].month == events[i-1].month && events[i].year == events[i-1].year)
				color = "success";
		if (i > 1)
			if (events[i].day == events[i-2].day && events[i].month == events[i-2].month && events[i].year == events[i-2].year)
				color = "info";
		if (i > 2)
			if (events[i].day == events[i-3].day && events[i].month == events[i-3].month && events[i].year == events[i-3].year)
				color = "warning";
		if (i > 3)
			if (events[i].day == events[i-4].day && events[i].month == events[i-4].month && events[i].year == events[i-4].year)
				color = "danger";

		$(".date-" + events[i].day + "-" + events[i].month + "-" + events[i].year + " > .calendar-item")
			.append("<div class=\"btn-group\">" + 
						"<button type=\"button\" class=\"btn btn-" + color + " dropdown-toggle\" data-toggle=\"dropdown\">" +
							events[i].hour + ":" + events[i].minute + " " + events[i].name + "<span class=\"caret\"></span>" +
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