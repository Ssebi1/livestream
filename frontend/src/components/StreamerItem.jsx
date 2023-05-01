import { Link } from "react-router-dom"

function StreamerItem({streamer}) {
    return (
        <Link to={{pathname: `/profile/${streamer._id}`}} className="streamer-item">
            <div className="profile-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}></div>
            <div className="streamer-title">{streamer.name}</div>
            <div className="streamer-followers">{streamer.followersNr} followers</div>
        </Link>
    )
}

export default StreamerItem