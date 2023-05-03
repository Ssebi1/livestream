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
            <section className="streamers" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: 30 }}>
                {streamers.map((streamer) => (
                    <StreamerItem key={streamer._id} streamer={streamer}/>
                ))}
            </section>
        </>
    )
}

export default Streamers