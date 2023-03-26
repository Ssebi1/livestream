import {useSelector, useDispatch} from 'react-redux'

function StreamChatMessage(props) {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="stream-chat-message">
            <span className="username">{props.username}</span>:&nbsp;
            <span className="message">{props.message}</span>
        </div>
    )
}

export default StreamChatMessage