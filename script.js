// Get references to the messages container and the message input form
const messages = document.getElementById("messages");
const messageForm = document.getElementById("message-form");
const messageInput = document.getElementById("message-input");

// Get the user name from the prompt
const userName = prompt("Please enter your name:");

// Connect to the WebSocket server
const socket = new WebSocket("ws://localhost:3000");

// Send the user name to the server
socket.addEventListener("open", () => {
	socket.send(JSON.stringify({
		type: "user",
		name: userName
	}));
});

// Listen for messages from the server
socket.addEventListener("message", (event) => {
	const data = JSON.parse(event.data);
	
	// If the message is a chat message, add it to the messages container
	if (data.type === "chat") {
		const message = document.createElement("div");
		message.classList.add("message");
		
		const sender = document.createElement("span");
		sender.classList.add("sender");
		sender.innerText = data.sender + ": ";
		message.appendChild(sender);
		
		const text = document.createElement("span");
		text.classList.add("text");
		text.innerText = data.text;
		message.appendChild(text);
		
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	}
});

// Listen for form submit events
messageForm.addEventListener("submit", (event) => {
	// Prevent the form from submitting normally
	event.preventDefault();
	
	// Get the message input value and clear the input field
	const messageText = messageInput.value;
	messageInput.value = "";
	
	// Send the message to the server
	socket.send(JSON.stringify({
		type: "chat",
		text: messageText
	}));
});
