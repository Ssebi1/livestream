import { Link } from "react-router-dom"

function StreamerItem({streamer, style}) {
    return (
        <Link to={{pathname: `/profile/${streamer._id}`}} className="streamer-item" style={style}>
            <div className="profile-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/defaults/profile-image.png')`}}></div>
            <div className="streamer-title">{streamer.name}</div>
            <div className="streamer-followers">{streamer.followersNr} followers</div>
        </Link>
    )
}

export default StreamerItem