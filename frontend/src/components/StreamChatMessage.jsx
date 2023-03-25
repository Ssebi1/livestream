import {useSelector, useDispatch} from 'react-redux'

function StreamChatMessage() {
    const { user } = useSelector((state) => state.auth)

    return (
        <div className="stream-chat-message">
            <span className="username">User123</span>:&nbsp;
            <span className="message">Hello there! This is my first time here</span>
        </div>
    )
}

export default StreamChatMessage