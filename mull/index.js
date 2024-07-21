document.addEventListener('DOMContentLoaded', () => {
    fetchAdventures();

    const adventureForm = document.getElementById('adventure-form');
    adventureForm.addEventListener('submit', handleFormSubmit);
});

function fetchAdventures() {
    fetch('http://localhost:3000/nationalParks')
        .then(response => response.json())
        .then(data => displayAdventures(data))
        .catch(error => console.error('Error fetching data:', error));
}

function displayAdventures(nationalParks) {
    const adventureList = document.getElementById('adventure-list');
    adventureList.innerHTML = ''; // Clear the list before displaying

    nationalParks.forEach(nationalPark => {
        const card = document.createElement('div');
        card.className = 'adventure-card';

        if (nationalPark.imageUrls && nationalPark.imageUrls.length > 0) {
            const img = document.createElement('img');
            img.src = nationalPark.imageUrls[0];
            card.appendChild(img);
        }

        if (nationalPark.videoUrls && nationalPark.videoUrls.length > 0) {
            const container = document.createElement('div');
            const iframe = document.createElement('iframe');
            iframe.src = nationalPark.videoUrls[0];
            iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
            iframe.allowFullscreen = true;
            iframe.frameBorder = 0;
            container.appendChild(iframe);
            card.appendChild(container);
        }

        const content = document.createElement('div');
        content.className = 'adventure-card-content';

        const title = document.createElement('h2');
        title.textContent = nationalPark.title;
        content.appendChild(title);

        const location = document.createElement('p');
        location.textContent = `Location: ${nationalPark.location}`;
        content.appendChild(location);

        // const description = document.createElement('p');
        // description.textContent = nationalPark.description;
        // content.appendChild(description);

        const entranceFee = document.createElement('p');
        entranceFee.textContent = `Entrance Fee: ${nationalPark.entranceFee}`;
        content.appendChild(entranceFee);

        // const activities = document.createElement('p');
        // activities.textContent = `Activities: ${nationalPark.activities.join(', ')}`;
        // content.appendChild(activities);

        // const facilities = document.createElement('p');
        // facilities.textContent = `Facilities: ${nationalPark.facilities.join(', ')}`;
        // content.appendChild(facilities);

        // const usefulInfo = document.createElement('p');
        // usefulInfo.textContent = `Useful Info: ${nationalPark.usefulInformation}`;
        // content.appendChild(usefulInfo);

        // Comments Section
        const commentsSection = document.createElement('div');
        commentsSection.className = 'comments-section';

        const commentForm = document.createElement('form');
        commentForm.className = 'comment-form';

        const commentInput = document.createElement('input');
        commentInput.type = 'text';
        commentInput.placeholder = 'Add a comment...';
        commentForm.appendChild(commentInput);

        const commentButton = document.createElement('button');
        commentButton.textContent = 'Comment';
        commentForm.appendChild(commentButton);

        commentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            addComment(nationalPark.id, commentInput.value);
            commentInput.value = '';
        });

        commentsSection.appendChild(commentForm);

        const commentList = document.createElement('ul');
        commentList.className = 'comment-list';

        if (nationalPark.comments) {
            nationalPark.comments.forEach(comment => {
                const commentItem = document.createElement('li');
                commentItem.textContent = comment;
                commentList.appendChild(commentItem);
            });
        }

        commentsSection.appendChild(commentList);
        content.appendChild(commentsSection);

        // Booking Section
        const bookingSection = document.createElement('div');
        bookingSection.className = 'booking-section';

        const bookingForm = document.createElement('form');
        bookingForm.className = 'booking-form';

        const ticketInput = document.createElement('input');
        ticketInput.type = 'number';
        ticketInput.placeholder = 'Number of tickets...';
        bookingForm.appendChild(ticketInput);

        const bookButton = document.createElement('button');
        bookButton.textContent = 'Book';
        bookingForm.appendChild(bookButton);

        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();
            bookTickets(nationalPark.id, ticketInput.value);
            ticketInput.value = '';
        });

        bookingSection.appendChild(bookingForm);

        const bookingInfo = document.createElement('p');
        bookingInfo.textContent = `Tickets Booked: ${nationalPark.bookings || 0}`;
        bookingSection.appendChild(bookingInfo);
        content.appendChild(bookingSection);

        // Like Button
        const likeButton = document.createElement('button');
        likeButton.textContent = `Like (${nationalPark.likes || 0})`;
        likeButton.addEventListener('click', (event) => {
            event.preventDefault();
            addLike(nationalPark.id);
        });
        content.appendChild(likeButton);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleEdit(nationalPark);
        });
        content.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', (event) => {
            event.preventDefault();
            handleDelete(nationalPark.id);
        });
        content.appendChild(deleteButton);

        card.appendChild(content);
        adventureList.appendChild(card);
    });
}

function handleFormSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const newAdventure = {
        title: formData.get('title'),
        location: formData.get('location'),
        description: formData.get('description'),
        imageUrls: formData.get('imageUrls').split(','),
        videoUrls: formData.get('videoUrls').split(','),
        entranceFee: formData.get('entranceFee'),
        activities: formData.get('activities').split(','),
        facilities: formData.get('facilities').split(','),
        usefulInformation: formData.get('usefulInformation'),
        comments: [],
        bookings: 0,
        likes: 0,
        likeDates: []
    };

    fetch('http://localhost:3000/nationalParks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newAdventure)
    })
    .then(response => response.json())
    .then(data => {
        displayAdventures([data]); // Display the new adventure
        event.target.reset(); // Clear the form
        fetchAdventures(); // Refresh the list
    })
    .catch(error => console.error('Error adding adventure:', error));
}

function handleDelete(id) {
    fetch(`http://localhost:3000/nationalParks/${id}`, {
        method: 'DELETE'
    })
    .then(() => fetchAdventures())
    .catch(error => console.error('Error deleting adventure:', error));
}

function handleEdit(nationalPark) {
    const adventureForm = document.getElementById('adventure-form');
    adventureForm.querySelector('[name="title"]').value = nationalPark.title;
    adventureForm.querySelector('[name="location"]').value = nationalPark.location;
    adventureForm.querySelector('[name="description"]').value = nationalPark.description;
    adventureForm.querySelector('[name="imageUrls"]').value = nationalPark.imageUrls.join(',');
    adventureForm.querySelector('[name="videoUrls"]').value = nationalPark.videoUrls.join(',');
    adventureForm.querySelector('[name="entranceFee"]').value = nationalPark.entranceFee;
    adventureForm.querySelector('[name="activities"]').value = nationalPark.activities.join(',');
    adventureForm.querySelector('[name="facilities"]').value = nationalPark.facilities.join(',');
    adventureForm.querySelector('[name="usefulInformation"]').value = nationalPark.usefulInformation;

    adventureForm.removeEventListener('submit', handleFormSubmit);
    adventureForm.addEventListener('submit', (event) => handleUpdate(event, nationalPark.id), { once: true });
}

function handleUpdate(event, id) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const updatedAdventure = {
        title: formData.get('title'),
        location: formData.get('location'),
        description: formData.get('description'),
        imageUrls: formData.get('imageUrls').split(','),
        videoUrls: formData.get('videoUrls').split(','),
        entranceFee: formData.get('entranceFee'),
        activities: formData.get('activities').split(','),
        facilities: formData.get('facilities').split(','),
        usefulInformation: formData.get('usefulInformation')
    };

    fetch(`http://localhost:3000/nationalParks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAdventure)
    })
    .then(() => {
        fetchAdventures(); // Refresh the list
        event.target.reset(); // Clear the form
        adventureForm.addEventListener('submit', handleFormSubmit); // Reset form event listener
    })
    .catch(error => console.error('Error updating adventure:', error));
}

function addComment(id, comment) {
    fetch(`http://localhost:3000/nationalParks/${id}`)
        .then(response => response.json())
        .then(nationalPark => {
            nationalPark.comments.push(comment);
            return fetch(`http://localhost:3000/nationalParks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nationalPark)
            });
        })
        .then(() => fetchAdventures())
        .catch(error => console.error('Error adding comment:', error));
}

function bookTickets(id, tickets) {
    fetch(`http://localhost:3000/nationalParks/${id}`)
        .then(response => response.json())
        .then(nationalPark => {
            nationalPark.bookings += parseInt(tickets, 10);
            return fetch(`http://localhost:3000/nationalParks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nationalPark)
            });
        })
        .then(() => fetchAdventures())
        .catch(error => console.error('Error booking tickets:', error));
}

function addLike(id) {
    fetch(`http://localhost:3000/nationalParks/${id}`)
        .then(response => response.json())
        .then(nationalPark => {
            nationalPark.likes += 1;
            nationalPark.likeDates.push(new Date().toISOString());
            return fetch(`http://localhost:3000/nationalParks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nationalPark)
            });
        })
        .then(() => fetchAdventures())
        .catch(error => console.error('Error adding like:', error));
}
