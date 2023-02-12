import {Link, useNavigate} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getStreams, reset} from '../features/streams/streamSlice'
import {getStreamers, reset as resetStreamers} from '../features/streamers/streamerSlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user} = useSelector((state) => state.auth)
    const {streams, isError, message} = useSelector((state) => state.streams)
    const {streamers} = useSelector((state) => state.streamers)

    useEffect(() => {
        if(isError) {
            console.log(message)
            navigate('/')
        }

        dispatch(getStreams())
        dispatch(getStreamers())

        return () => {
            dispatch(reset())
            dispatch(resetStreamers())
        }
    }, [user, navigate, isError, message, dispatch])

    return (
        <>
            {user && user.streamerMode ?
                (<Link to="/create-stream"><div class="button-start-stream">Start stream</div></Link>):
                (<></>)
            }

            <div className="home-section-title">Latest streams</div>
            <section className="streams">
                {streams.map((stream) => (
                    <StreamItem key={stream._id} stream={stream}/>
                ))}
            </section>
            
            <div className="home-section-title">Popular streamers</div>
            <section className="streamers">
                {streamers.map((streamer) => (
                    <StreamerItem key={streamer._id} streamer={streamer}/>
                ))}
            </section>
        </>
    )
}

export default Home