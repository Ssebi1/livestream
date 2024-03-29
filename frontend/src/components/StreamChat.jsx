import { useSelector, useDispatch } from 'react-redux'
import { AiOutlineSend } from "react-icons/ai";
import StreamChatMessage from '../components/StreamChatMessage'
import { useState, useEffect } from 'react';

function StreamChat(props) {
    const { user } = useSelector((state) => state.auth)
    const [messagesRecieved, setMessagesReceived] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        props.socket.on('receive_message', (data) => {
            setMessagesReceived((state) => [
                ...state,
                {
                    message: data.message,
                    username: data.username
                },
            ]);
            if (data.username != user.name)
                props.onSendMessage({ username: data.username, message: data.message })
        });

        return () => props.socket.off('receive_message');
    }, [props.socket]);

    const handleKeyDown = (event) => {
        if (event.keyCode == 13) {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (message !== '') {
            let username = user.name
            let room = props.stream._id
            props.socket.emit('send_message', { username, room, message });
            props.onSendMessage({ username: username, message: message })
            setMessage('');
        }
    };

    return (
        <div className="stream-chat">
            <div className="stream-chat-title">Stream chat</div>
            <div className="stream-chat-messages">
                {messagesRecieved.map((message, i) => (
                    <StreamChatMessage message={message.message} username={message.username} />
                ))}
            </div>
            <div className="stream-chat-input">
                {user ? (
                    <>
                        {props.stream.status === 'started' ? (
                            <input type="text" name="stream-message" id="stream-message" placeholder="Send a message" onKeyDown={handleKeyDown} onChange={(e) => setMessage(e.target.value)} value={message} />

                        ) : (
                            <input type="text" name="stream-message" id="stream-message" placeholder="Cannot send messages right now" disabled />
                        )
                        }
                    </>
                ) : (
                    <input type="text" name="stream-message" id="stream-message" placeholder="Login to send messages" disabled />
                )}
                <button onClick={sendMessage}><AiOutlineSend size={25} /></button>
            </div>
        </div>
    )
}

export default StreamChat