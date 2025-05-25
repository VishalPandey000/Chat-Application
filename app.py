from flask import Flask, render_template
from flask_socketio import SocketIO, join_room, leave_room, send, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")

users = {}  # Dictionary to store users and their rooms

@app.route('/')
def home():
    return render_template('index.html')

@socketio.on('join')
def handle_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    users[username] = room
    send(f"{username} has joined the room.", room=room)

@socketio.on('message')
def handle_message(data):
    room = users.get(data['username'])
    if room:
        emit('message', {'username': data['username'], 'message': data['message']}, room=room)

@socketio.on('typing')
def handle_typing(data):
    room = users.get(data['username'])
    if room:
        emit('typing', {'username': data['username']}, room=room, include_self=False)

@socketio.on('leave')
def handle_leave(data):
    username = data['username']
    room = users.get(username)
    if room:
        leave_room(room)
        send(f"{username} has left the room.", room=room)
        del users[username]


if __name__ == '__main__':
    socketio.run(app, debug=True)
