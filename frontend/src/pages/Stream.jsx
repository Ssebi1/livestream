import {Link, useNavigate, useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getStream, reset} from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import StreamChat from '../components/StreamChat'
import {AiOutlineStar} from "react-icons/ai";


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
                <div className="stream-player-container">
                    <div className="stream-player"></div>
                    <div className="stream-info">
                        <div className="stream-info-container-1">
                            <div className="stream-author-profile-picture"></div>
                        </div>
                        <div className="stream-info-container-2">
                            <div className="stream-title">{stream.title}</div>
                            <div className="stream-author-username">{stream.user.name}</div>
                            <div className="stream-category">Category</div>
                        </div>
                        <div className="stream-info-container-3">
                            <div className="stream-author-follow">FOLLOW <AiOutlineStar size={20}/></div>
                        </div>
                    </div>
                </div>
                <StreamChat />
            </div>
        </>
    )
}

export default Stream