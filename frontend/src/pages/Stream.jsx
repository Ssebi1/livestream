import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStream, reset } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import StreamChat from '../components/StreamChat'
import { AiOutlineStar } from "react-icons/ai";
import io from 'socket.io-client';
import '../stream-page.css'
import { followUser, unfollowUser } from '../features/auth/authSlice'

const socket = io.connect('http://localhost:4000');

function Stream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { stream, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)

    useEffect(() => {
        if (isErrorStreams) {
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

    if (isSuccessStreams) {
        // join chat room
        const room = stream._id
        if (room !== "") {
            let username
            if (user)
                username = user.name
            else
                username = 'guest-user'
            socket.emit('join_room', { username, room })
        }
    }

    const follow = () => {
        dispatch(followUser({
            'source': user._id,
            'destination': stream.user._id
        }))
    }

    const unfollow = () => {
        dispatch(unfollowUser({
            'source': user._id,
            'destination': stream.user._id
        }))
    }

    return (
        <>
            <div className="stream-container">
                <div className="stream-player-container">
                    <div className="stream-player"></div>
                    <div className="stream-info">
                        <div className="stream-info-container-1">
                            <div className="stream-author-profile-picture" style={{ backgroundImage: `url('/profile-pictures/${stream.user._id}.png'), url('/profile-pictures/blank-profile-picture.png')` }}></div>
                        </div>
                        <div className="stream-info-container-2">
                            <div className="stream-title">{stream.title}</div>
                            <div className="stream-author-username">{stream.user.name}</div>
                            <div className="stream-category">{stream.category.name}</div>
                        </div>
                        <div className="stream-info-container-3">
                            {(() => {
                                if (!user || stream.user._id !== user._id) {
                                    return (
                                        <>
                                            {user.following.includes(stream.user._id) ? (
                                                <div className="follow-button-wrapper">
                                                    <div className="follow-button unfollow-button" onClick={unfollow}>UNFOLLOW <AiOutlineStar size={20} /></div>
                                                </div>
                                            ) : (
                                                <div className="follow-button-wrapper">
                                                    <div className="follow-button" onClick={follow}>FOLLOW <AiOutlineStar size={20} /></div>
                                                </div>
                                            )
                                            }
                                        </>
                                    )
                                } else {
                                    return (<></>)
                                }
                            })()}

                        </div>
                    </div>
                </div>
                <StreamChat socket={socket} stream={stream} />
            </div>
        </>
    )
}

export default Stream