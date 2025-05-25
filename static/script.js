const socket = io();
let username, room;

function joinRoom() {
    username = document.getElementById('username').value;
    room = document.getElementById('room').value;
    if (username && room) {
        socket.emit('join', { username, room });
    }
}

function sendMessage() {
    const message = document.getElementById('message').value;
    if (message.trim() !== '') {
        socket.emit('message', { username, message });
        document.getElementById('message').value = '';
    }
}

// Emit typing event when user types
document.getElementById('message').addEventListener('input', () => {
    if (username && room) {
        socket.emit('typing', { username });
    }
});

function leaveRoom() {
    if (username && room) {
        socket.emit('leave', { username });
        document.getElementById('chat-box').innerHTML += `<p style="color:red;">You have left the room.</p>`;
    }
}


// Handle incoming messages
socket.on('message', data => {
    const chatBox = document.getElementById('chat-box');

    if (typeof data === 'string') {
        chatBox.innerHTML += `<p>${data}</p>`;
    } else {
        chatBox.innerHTML += `<p><strong>${data.username}:</strong> ${data.message}</p>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById('typing').textContent = '';
});


// Handle typing indicator
socket.on('typing', data => {
    const typingElem = document.getElementById('typing');
    typingElem.textContent = `${data.username} is typing...`;
    typingElem.style.display = 'block'; // Show the element

    clearTimeout(typingElem.timer);
    typingElem.timer = setTimeout(() => {
        typingElem.style.display = 'none'; // Hide the element
    }, 1000); 
});

