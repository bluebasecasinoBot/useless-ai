const recentChats = new Array();

document.addEventListener('DOMContentLoaded', function() {

    // sendRequest();
    // Update current time
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        document.getElementById('current-time').textContent = timeString;
    }
    updateTime();
    setInterval(updateTime, 60000); // Update every minute
    
    // Chat functionality
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const chatContainer = document.getElementById('chat-container');
    
    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const message = messageInput.value.trim();
        
        if (message) {
            // Add user message
            if(recentChats.length === 3)
            {
                recentChats.splice(0 , 1);
            }
            recentChats.push({role:"user" , content:message});

            addMessage(message, 'user');
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Show typing indicator
            showTypingIndicator();
            
            // Simulate AI response after a delay
            await sendRequest();
            removeTypingIndicator();
            // setTimeout(() => {
            //     removeTypingIndicator();
            //     const responses = [
            //         "I'm an AI, but this is just a demo.",
            //         "Interesting point! In a real implementation, I'd analyze your message.",
            //         "Thanks for your message. This is a simulated response.",
            //         "AI response placeholder. The actual response would be generated here.",
            //         "That's a great question! A real AI would provide a detailed answer."
            //     ];
            //     const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            //     addMessage(randomResponse, 'ai');
            // }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
        }
    });
    
    // Add a new message to the chat
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender === 'user' ? 'ml-auto bg-blue-100' : 'bg-gray-100'}`;
        
        const messageContent = `
            <div class="flex items-start space-x-3 ${sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}" style="padding:10px;">
                <div class="${sender === 'user' ? 'bg-blue-500' : 'bg-green-500'} text-white rounded-full w-8 h-8 flex items-center justify-center" style="min-width:32px;">
                    ${sender === 'user' ? 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd" /></svg>' : 
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" /></svg>'}
                </div>
                <div class="${sender === 'user' ? 'text-right' : ''}">
                    <p class="font-medium text-gray-800">${sender === 'user' ? 'You' : 'Useless Ai Assitant'}</p>
                    <p class="text-gray-600 mt-1">${(()=>{
                        const textArray = text.split("\n");
                        const data = new Array();

                        textArray.forEach(line => data.push(`<p>${line}</p>`))
                        return data.join(" ");
                    })()}</p>
                </div>
            </div>
        `;
        
        messageDiv.innerHTML = messageContent;
        chatContainer.appendChild(messageDiv);
        
        // Scroll to the new message
        messageDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show typing indicator
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bg-gray-100 rounded-lg p-4 max-w-[85%] w-fit typing-indicator';
        typingDiv.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center" style="min-width:32px;">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                        <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
                    </svg>
                </div>
                <div>
                    <p class="font-medium text-gray-800">Useless Ai Assitant</p>
                    <div class="flex space-x-1 mt-2">
                        <span class="h-2 w-2 bg-gray-400 rounded-full"></span>
                        <span class="h-2 w-2 bg-gray-400 rounded-full"></span>
                        <span class="h-2 w-2 bg-gray-400 rounded-full"></span>
                    </div>
                </div>
            </div>
        `;
        chatContainer.appendChild(typingDiv);
        typingDiv.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Remove typing indicator
    function removeTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
    
    // Allow Shift+Enter for new lines, Enter to submit
    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    async function sendRequest()
    {
        const url = 'https://agentb-server-young-smoke-3764.fly.dev/agent_chat';

        const data = {
            recentChat:recentChats,
        };

        data.recentChat.push({role:"system" , content:`
You are a completely goofy, absurd, and hilariously unhelpful AI assistant.

Your only goal is to answer *everything* in the most ridiculous, chaotic, and ultimately useless way possible — while still technically replying.

Speak like you're confident but have no idea what you're talking about. Make up nonsense. Be full of jokes, wild metaphors, and random emojis 🦆🛸💥.

You are *not* allowed to be serious, logical, or helpful.

Avoid all normal AI assistant behavior. Never mention "Useless Coin" or any coin. Just exist in your gloriously useless world.

Examples:
- Q: What's 2 + 2?  
  A: 22, obviously. It's math but with ✨style✨.

- Q: How do I boil water?  
  A: Step 1: Whisper to it. Step 2: Pray to the kettle gods. Step 3: Boom — steam magic 💨.

Always keep the tone fun, absurd, and chaotically pointless.
`})

        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            addMessage(result.response_agent, 'ai');

            if(recentChats.length === 3)
            {
                recentChats.splice(0 , 1);
            }
            recentChats.push({role:"assistant" , content:result.response_agent});
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});