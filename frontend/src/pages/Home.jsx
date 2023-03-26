import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStreams, reset } from '../features/streams/streamSlice'
import { getStreamers, reset as resetStreamers } from '../features/streamers/streamerSlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import Spinner from '../components/Spinner'

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    const { streamers, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)

    useEffect(() => {
        if (isErrorStreams) {
            console.log(messageStreams)
            navigate('/')
        }

        if (isErrorStreamers) {
            console.log(messageStreamers)
            navigate('/')
        }

        dispatch(getStreams())
        dispatch(getStreamers())

        return () => {
            dispatch(reset())
            dispatch(resetStreamers())
        }
    }, [user, navigate, isErrorStreams, messageStreams, isErrorStreamers, messageStreamers, dispatch])

    if (isLoadingStreams || isLoadingStreamers) {
        return <Spinner />
    }

    return (
        <>
            {user && user.streamerMode ?
                (<Link to="/create-stream"><div class="button-start-stream">Start stream</div></Link>) :
                (<></>)
            }

            <div className="home-section-title">Recommended streams</div>
            <section className="streams">
                {streams.map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}
            </section>

            <div className="home-section-title">Popular categories</div>
            <section className="streams">
                {streams.map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}
            </section>

            <div className="home-section-title">Popular streamers</div>
            <section className="streamers">
                {streamers.map((streamer) => (
                    <StreamerItem key={streamer._id} streamer={streamer} />
                ))}
            </section>
        </>
    )
}

export default Home