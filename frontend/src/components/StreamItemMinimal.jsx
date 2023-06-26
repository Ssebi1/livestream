import { Link } from "react-router-dom"

function StreamItemMinimal({ stream }) {
    return (
        <div className="stream-item">
            <Link to={{ pathname: `/stream/${stream._id}` }}><div className="thumbnail" style={{backgroundImage: `url("/thumbnail-pictures/${stream._id}.png"), url(${stream.thumbnail_url}), url("/defaults/thumbnail-image.png")`}}>
                <div className="thumbnail-labels">
                    {stream.status === 'started' ? (
                        <div className="live-badge">LIVE</div>
                    ) : (
                        <>
                            <div className="stream-date">{stream.createdAt.split('T')[0]}</div>
                            {stream.status === 'ended' ? (
                                <div className="vod-badge">{stream.vod_duration}</div>
                            ) : (
                                <></>
                            )
                            }
                        </>
                    )
                    }
                </div>
            </div>
            </Link><div className="stream-info">
                <div className="stream-info-right">
                    <div className="stream-title">{stream.title}</div>
                    <Link to={{ pathname: `/profile/${stream.user._id}` }} className="stream-author">{stream.user.name}</Link>
                    {stream.hasOwnProperty("category") && stream.category !== null ? (
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

export default StreamItemMinimal