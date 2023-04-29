import { Link } from "react-router-dom"

function StreamItemMinimal({stream}) {
    return (
        <div className="stream-item">
            <Link to={{pathname: `/streams/${stream._id}`}}><div className="thumbnail" background-image="url('https://q5n8c8q9.rocketcdn.me/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png')"></div></Link>
            <div className="stream-info">
                <div className="stream-info-right">
                    <div className="stream-title">{stream.title}</div>
                    <Link to={{pathname: `/profile/${stream.user._id}`}} className="stream-author">{stream.user.name}</Link>
                    <div className="stream-category">{stream.category.name}</div>
                </div>
            </div>
        </div>
    )
}

export default StreamItemMinimal