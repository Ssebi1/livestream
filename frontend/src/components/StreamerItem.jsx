function StreamerItem({streamer}) {
    return (
        <div className="streamer-item">
            <div className="profile-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}></div>
            <div className="stream-title">{streamer.name}</div>
        </div>
    )
}

export default StreamerItem