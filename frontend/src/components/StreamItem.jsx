import { Link } from "react-router-dom"

function StreamItem({stream, style}) {
    return (
        <div className="stream-item" style={style}>
            <Link to={{pathname: `/stream/${stream._id}`}}><div className="thumbnail" style={{backgroundImage: `url("/thumbnail-pictures/${stream._id}.png"), url(${stream.thumbnail_url}), url("https://q5n8c8q9.rocketcdn.me/wp-content/uploads/2019/09/YouTube-thumbnail-size-guide-best-practices-top-examples.png")`}}>
                    { stream.status === 'started' ? (
                        <div className="live-badge">LIVE</div>
                    ): (
                        <>
                        { stream.status === 'ended' ? (
                            <div className="vod-badge">{stream.vod_duration}</div>
                        ) : (
                            <></>
                        )
                        }
                        </>
                    )
                    }
                </div>
            </Link>
            <div className="stream-info">
                <div className="stream-info-left">
                    <Link to={{pathname: `/profile/${stream.user._id}`}}><div className="stream-author-image" style={{backgroundImage: `url('/profile-pictures/${stream.user._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}></div></Link>
                </div>
                <div className="stream-info-right">
                    <div className="stream-title">{stream.title}</div>
                    <Link to={{pathname: `/profile/${stream.user._id}`}} className="stream-author">{stream.user.name}</Link>
                    {  stream.hasOwnProperty("category") && stream.category !== null ? (
                            <div className="stream-category">{stream.category.name}</div>
                        ) : (
                            <div className="stream-category">GENERAL</div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default StreamItem