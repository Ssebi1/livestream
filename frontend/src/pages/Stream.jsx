import {Link, useNavigate, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getStream, reset} from '../features/streams/streamSlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import Spinner from '../components/Spinner'
import StreamChat from '../components/StreamChat'


function Stream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const {user} = useSelector((state) => state.auth)
    const {stream, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams} = useSelector((state) => state.streams)

    useEffect(() => {
        if(isErrorStreams) {
            console.log(messageStreams)
            navigate('/')
        }

        dispatch(getStream(id))

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isErrorStreams, messageStreams, dispatch])

    if (isLoadingStreams) {
        return <Spinner />
    }

    return (
        <>
            <div className="stream-container">
                <div className="stream-chat-container">
                    <div className="stream-player">

                    </div>
                    <StreamChat />
                </div>
            </div>
        </>
    )
}

export default Stream