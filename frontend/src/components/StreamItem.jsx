import { Link } from "react-router-dom"

function StreamItem({stream}) {
    return (
        <div className="stream-item">
            <Link to={{pathname: `/streams/${stream._id}`}}><div className="thumbnail" background-image="url('https://q5n8c8q9.rocketcdn.me/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png')"></div></Link>
            <div className="stream-info">
                <div className="stream-info-left">
                    <div className="stream-author-image"></div>
                </div>
                <div className="stream-info-right">
                    <div className="stream-title">{stream.title}</div>
                    <div className="stream-author">{stream.user.name}</div>
                    <div className="stream-category">Minecraft</div>
                </div>
            </div>
        </div>
    )
}

export default StreamItem