const socket = io();

const messages = document.getElementById('messages');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');

socket.on('chat message', (data) => {
    const li = document.createElement('li');
    li.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(li);
});

socket.on('chat history', (msgs) => {
    msgs.forEach(data => {
        const li = document.createElement('li');
        li.textContent = `${data.username}: ${data.message}`;
        messages.appendChild(li);
    });
});

function sendMessage() {
    const username = usernameInput.value || 'Anonymous';
    const message = messageInput.value;
    if (!message) return;
    socket.emit('chat message', { username, message });
    messageInput.value = '';
}
