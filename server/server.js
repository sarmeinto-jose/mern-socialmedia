require('dotenv').config();
require('express-async-errors');

const path = require('path');
const http = require('http');
const express = require('express');
const { Server } = require('socket.io')
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');
const connectDB = require('./db/connect');
const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler');
const users = require('./routes/users');
const posts = require('./routes/posts');
const auth = require('./routes/auth');
const conversations = require('./routes/conversations');
const messages = require('./routes/messages');
const notifications = require('./routes/notifications');
const photos = require('./data/photos');

const app = express();
const server = http.createServer(app)
const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000"
	}
}) 

app.use(
	cors({
		origin: 'http://localhost:3000',
		exposedHeaders: 'x-auth-token',
	})
);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);
app.use('/api/v1/posts', posts);
app.use('/api/v1/conversations', conversations);
app.use('/api/v1/messages', messages);
app.use('/api/v1/notifications', notifications);

app.use(notFound);
app.use(errorHandler);

const state = {
	users: [] 
}

const addUser = (userId, socketId) => {
	!state.users.some(user => user.userId === userId) 
		&& state.users.push({userId, socketId})
}

const removeUser = socketId => {
	state.users = state.users.filter(user => user.socketId !== socketId);
}

const getUser = userId => {
	return state.users.find(user => user.userId === userId)
}


io.on("connection", (socket) => {
	socket.on("addUser", userId => {
		addUser(userId, socket.id);
		io.emit("getUsers", state.users)
	})

	socket.on("disconnect", () => {
		io.emit("getUsers", state.users)
	})

	socket.on("sendFriends", (friends) => {
		const activeUsers = state.users.filter(user => friends.includes(user.userId))
		io.emit("getActiveFriends", activeUsers)
	})

	socket.on("sendMessage", ({chat, receiverId}) => {
		const user = getUser(receiverId);
		if(user) {
			io.to(user.socketId).emit("getMessage", {...chat})
		}
	})

	socket.on("sendNotification", ({receiverId, payload}) => {
		const user = getUser(receiverId);
		console.log(user)
		if(user) {
			// io.to('socket#id').emit('hey')
			io.to(user.socketId).emit("receiveNotification", {payload})
		}
	})

	socket.on("disconnect", () => {
		removeUser(socket.id)
		io.emit("getUsers", state.users)
	})
})

const port = process.env.PORT || 8000;
const start = async () => {
	try {
		await connectDB(process.env.MONGODB_URI);
		server.listen(port, () =>
			console.log(`Server is listening on port ${port}...`)
		);
	} catch (error) {
		console.log(error);
	}
};

start();
