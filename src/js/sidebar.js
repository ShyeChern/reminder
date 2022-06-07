const sidebarContent = document.querySelector('.sidebar-content');

const renderEvent = (events) => {
	const elements = events.map(
		(value) =>
			`
      <li class="list-group-item">
        <div class="media-body event-items">
          <strong>${value.title}</strong>
          <p>${value.description}</p>
          <button class="btn btn-mini btn-default pull-right events-items" data-event-id="${value.id}">View</button>
        </div>
      </li>
      `
	);

	sidebarContent.innerHTML = elements.join('');
};

window.renderEvent = renderEvent;
