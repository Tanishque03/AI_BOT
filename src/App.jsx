import { useState } from 'react';
import axios from 'axios';
import './App.css'

const App = () => {
  const [input, setInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if input is not empty before sending
    if (input.trim()) {
      sendMessage(input);
      setChatLog((prevChatLog) => [...prevChatLog, { role: 'user', message: input }]);
      setInput('');
    }
  };

  const sendMessage = async (message) => {
    setIsLoading(true); // Set loading before the API call

    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=YOUR_API_KEY",
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          contents: [
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        },
      });
      {isLoading && <p>Loading...</p>}


      // Assuming the structure of the response is correct
      const botMessage = response.data.candidates[0]?.content?.parts[0]?.text || 'No Reply!';
      setChatLog((prevChatLog) => [
        ...prevChatLog,
        { role: 'bot', message: botMessage },
      ]);
    } catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      alert(error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
    } finally {
      setIsLoading(false); // Ensure loading state is reset
    }
  };

  const handleChange = (e) => setInput(e.target.value);

  return (
    <>
      <div className = 'background'>
      <h1 className='title'>AI App</h1>
      <div className='chatbox'>
      {chatLog.map((message, index) => (
        <div key={index} className={'message-wrapper' + (message.role === 'user' ? ' sent' : ' received')}>
          <div className={'message-bubble' + (message.role === 'user' ? ' sent' : ' received')}>
            {message.message}
          </div>
        </div>
    ))}
      </div>

    <form onSubmit={handleSubmit} className='textform'>
      <input 
        className='textarea'
        type="text" 
        placeholder="Ask something..." 
        value={input} 
        onChange={handleChange} 
      />
      <button type="submit" disabled={isLoading} className='submitbutton'>Send</button>
    </form>
      </div>
    </>
  );
};

export default App;


