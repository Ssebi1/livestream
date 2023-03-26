import {useSelector, useDispatch} from 'react-redux'
import { AiOutlineSend } from "react-icons/ai";
import StreamChatMessage from '../components/StreamChatMessage'

function StreamChat() {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="stream-chat">
            <div className="stream-chat-title">Stream chat</div>
            <div className="stream-chat-messages">
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />
                <StreamChatMessage />

            </div>
            <div className="stream-chat-input">
                {user ? (
                    <input type="text" name="stream-message" id="stream-message" placeholder="Send a message"/>
                ) : (
                    <input type="text" name="stream-message" id="stream-message" placeholder="Log in to send messages" disabled/>
                )}
                <button><AiOutlineSend size={25}/></button>
            </div>
        </div>
    )
}

export default StreamChat