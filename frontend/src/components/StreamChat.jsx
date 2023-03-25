import {useSelector, useDispatch} from 'react-redux'
import { AiOutlineSend } from "react-icons/ai";

function StreamChat() {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="stream-chat">
            <div className="stream-chat-title">Stream chat</div>
            <div className="stream-chat-messages"></div>
            <div className="stream-chat-input">
                <input type="text" name="stream-message" id="stream-message" placeholder="Send a message"/>
                <button><AiOutlineSend size={25}/></button>
            </div>
        </div>
    )
}

export default StreamChat