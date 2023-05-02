import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStreams, reset } from '../features/streams/streamSlice'
import { getStreamers, reset as resetStreamers } from '../features/streamers/streamerSlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import Spinner from '../components/Spinner'
import '../home-streamers.css'

function Streamers() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { streamers, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)

    useEffect(() => {
        if (isErrorStreamers) {
            console.log(messageStreamers)
            navigate('/')
        }

        dispatch(getStreamers())

        return () => {
            dispatch(reset())
            dispatch(resetStreamers())
        }
    }, [user, navigate, isErrorStreamers, messageStreamers, dispatch])

    if (isLoadingStreamers) {
        return <Spinner />
    }

    return (
        <>
            <section className="streamers" style={{ flexWrap: 'wrap', marginTop: 30 }}>
                {streamers.map((streamer) => (
                    <StreamerItem key={streamer._id} streamer={streamer} style={{ flexGrow: 1, flexShrink: 1, flexBasis: "50%" }}/>
                ))}
            </section>
        </>
    )
}

export default Streamers