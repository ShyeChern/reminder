const eventForm = document.querySelector('#event-form');
const eventModal = document.querySelector('#event-modal');
const bootstrapEventModal = new bootstrap.Modal(eventModal);
const errorMessage = document.querySelector('.error-message');
const deleteEventBtn = document.querySelector('.delete-event-btn');

eventForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const {
		id,
		title,
		description,
		frequency,
		'end-date': endDate,
		'start-date': startDate,
	} = e.target;
	if (!title.value || !description.value || !frequency.value || !startDate.value) {
		errorMessage.innerHTML = 'Please fill in all the field';
		return false;
	}
	if (new Date(startDate.value).getTime() > new Date(endDate.value).getTime()) {
		errorMessage.innerHTML = 'End date must be larger than start date';
		return false;
	}
	const data = {
		id: id.value,
		title: title.value,
		description: description.value,
		frequency: frequency.value,
		startDate: startDate.value,
		endDate: endDate.value,
	};

	const result = await window.myAPI.submitEvent(data);
	if (result) {
		eventForm.reset();
		errorMessage.innerHTML = '';
	} else {
		errorMessage.innerHTML = 'Something error.';
	}
	deleteEventBtn.style.display = 'none';
	bootstrapEventModal.hide();
	window.renderCalender();
	return true;
});

deleteEventBtn.addEventListener('click', async () => {
	const confirmed = confirm('Confirm to delete event?');
	if (confirmed) {
		const result = await window.myAPI.deleteEvent(eventForm.id.value);
		if (result) {
			eventForm.reset();
			errorMessage.innerHTML = '';
		} else {
			errorMessage.innerHTML = 'Something error.';
		}
		deleteEventBtn.style.display = 'none';
		bootstrapEventModal.hide();
		window.renderCalender();
	}
});

eventModal.addEventListener('hidden.bs.modal', () => {
	deleteEventBtn.style.display = 'none';
	eventForm.reset();
	errorMessage.innerHTML = '';
});

document.addEventListener(
	'click',
	async (e) => {
		if (e.target.matches('.events-items')) {
			const { id, title, description, frequency, startDate, endDate } = await window.myAPI.getEvent(
				e.target.getAttribute('data-event-id')
			);
			eventForm.id.value = id;
			eventForm.title.value = title;
			eventForm.description.value = description;
			eventForm.frequency.value = frequency;
			eventForm['start-date'].value = startDate;
			eventForm['end-date'].value = endDate;
			bootstrapEventModal.show();
			deleteEventBtn.style.display = 'block';
		}
	},
	false
);
