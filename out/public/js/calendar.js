
function setupCalendar(){
	var dateToday = Date.today();
	var dateLastMonth = new Date(dateToday);
	dateLastMonth.addMonths(-1);

	var daysThisMonth = Date.getDaysInMonth(dateToday.getFullYear(), dateToday.getMonth());
	var daysLastMonth = Date.getDaysInMonth(dateLastMonth.getFullYear(), dateLastMonth.getMonth());

	var thisMonthStartingDay = dateToday.moveToFirstDayOfMonth().getDay();
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
		$("#calendar-cell-" + i + " > .calendar-item").css("background-color", "#2D6159");
		$("#calendar-cell-" + i + " > .calendar-number").html(daysLastMonth - lastMonthEndingDay + i + 1);
		daysEnum.push(daysLastMonth - lastMonthEndingDay + i + 1);
	}
	for (var i = 0; i < daysThisMonth ; ++i){
		$("#calendar-cell-" + (i + thisMonthStartingDay - 1) + " > .calendar-number").html(i + 1);
		daysEnum.push(i + 1);
	}
	for (var i = 1; i < 6*7 - daysThisMonth - thisMonthStartingDay + 2; ++i){
		$("#calendar-cell-" + (i + daysThisMonth + thisMonthStartingDay - 2) + " > .calendar-item").css("background-color", "#2D6159");
		$("#calendar-cell-" + (i + daysThisMonth + thisMonthStartingDay - 2) + " > .calendar-number").html(i);
		daysEnum.push(i + 1);
	}

	console.log(JSON.stringify(daysEnum));
}

$( document).ready( setupCalendar);

console.log("Calendar.js works");