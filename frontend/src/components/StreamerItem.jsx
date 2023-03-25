function StreamerItem({streamer}) {
    return (
        <div className="streamer-item">
            <div className="profile-picture" background-image="url('https://q5n8c8q9.rocketcdn.me/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png')"></div>
            <div className="stream-title">{streamer.name}</div>
        </div>
    )
}

export default StreamerItem