import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStreams, reset } from '../features/streams/streamSlice'
import { getStreamers, reset as resetStreamers } from '../features/streamers/streamerSlice'
import { getCategories, reset as resetCategories } from '../features/categories/categorySlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import CategoryItem from '../components/CategoryItem'
import Spinner from '../components/Spinner'
import {FaChevronRight} from 'react-icons/fa'
import '../home-streamers.css'

function Following() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    const { streamers, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)
    const [streamsNumber, setStreamsNumber] = useState(8)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setStreamsNumber(window.innerWidth/240)
            } else {
                setStreamsNumber(10)
            }
            
        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)

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
            <div className="home-section-title-container">
                <div className="home-section-title">Streamers</div>
            </div>
            <section className="streamers">
                {streamers.map((streamer) => (
                    <>
                        {user.following.includes(streamer._id) ? (
                            <StreamerItem key={streamer._id} streamer={streamer} />
                        ) : (
                            <></>
                        )
                        }
                    </>
                ))}
            </section>

            <div className="home-section-title-container">
                <div className="home-section-title">Streams</div>
            </div>
            <section className="streams">
                {streams.slice(0, (streamsNumber)).map((stream) => (
                    <>
                        {user.following.includes(stream.user._id) ? (
                            <StreamItem key={stream._id} stream={stream} />
                        ) : (
                            <></>
                        )
                        }
                    </>
                ))}
            </section>

        </>
    )
}

export default Following