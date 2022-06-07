$(() => {
	renderCalender();
});
let selectedDate = '';
const renderCalender = async () => {
	const data = await window.myAPI.initData();
	const events = [];

	for (const value of data.oneTime) {
		events.push({
			id: value.id,
			start: value.startDate,
			display: 'background',
			rawData: value,
		});
	}
	const pushEvents = (arr, freq) => {
		for (const value of arr) {
			events.push({
				id: value.id,
				display: 'background',
				rawData: value,
				rrule: {
					freq,
					dtstart: value.startDate,
					until: value.endDate,
				},
			});
		}
	};
	pushEvents(data.daily, rrule.RRule.DAILY);
	pushEvents(data.weekly, rrule.RRule.WEEKLY);
	pushEvents(data.monthly, rrule.RRule.MONTHLY);
	pushEvents(data.yearly, rrule.RRule.YEARLY);

	const calendarEl = document.getElementById('calendar-view');
	const calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: 'dayGridMonth',
		eventClick: (info) => {
			info.jsEvent.preventDefault(); // don't let the browser navigate to detail
		},
		events,
		eventColor: '#FFFF00',
		select: function (info) {
			info.jsEvent?.preventDefault();
			const eventIds = [...new Set(calendar.getEvents().map((v) => v.id))];
			const events = [];
			selectedDate = new Date(info.startStr).getTime();
			for (const eventId of eventIds) {
				const eventDetails = calendar.getEventById(eventId).extendedProps.rawData;
				const startDate = new Date(eventDetails.startDate).getTime();
				const endDate = new Date(eventDetails.endDate).getTime() || Infinity;
				switch (eventDetails.frequency) {
					case '0': {
						if (startDate === selectedDate) {
							events.push(eventDetails);
						}
						break;
					}
					case '1': {
						if (selectedDate >= startDate && selectedDate <= endDate) {
							events.push(eventDetails);
						}
						break;
					}
					case '2': {
						if (
							selectedDate >= startDate &&
							selectedDate <= endDate &&
							new Date(selectedDate).getDay() === new Date(startDate).getDay()
						) {
							events.push(eventDetails);
						}
						break;
					}
					case '3': {
						if (
							selectedDate >= startDate &&
							selectedDate <= endDate &&
							new Date(selectedDate).getDate() === new Date(startDate).getDate()
						) {
							events.push(eventDetails);
						}
						break;
					}
					case '4': {
						if (
							selectedDate >= startDate &&
							selectedDate <= endDate &&
							new Date(selectedDate).getMonth() === new Date(startDate).getMonth() &&
							new Date(selectedDate).getDate() === new Date(startDate).getDate()
						) {
							events.push(eventDetails);
						}
						break;
					}
				}
			}
			window.renderEvent(events);
		},
		selectable: true,
		headerToolbar: {
			start: 'title',
			center: 'prev,next',
			end: 'today',
		},
	});
	calendar.render();
	calendar.select(selectedDate || new Date().toISOString().split('T')[0]);
};

window.renderCalender = renderCalender;
