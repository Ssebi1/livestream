import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStream, reset } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import StreamChat from '../components/StreamChat'
import { AiOutlineStar } from "react-icons/ai";
import io from 'socket.io-client';
import '../stream-page.css'
import { followUser, unfollowUser } from '../features/auth/authSlice'
import ReactHlsPlayer from 'react-hls-player';
import React from 'react';
import ReactDOM from 'react-dom';

const socket = io.connect('http://localhost:4000');

function Stream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { stream, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)

    const [currentTab, setTab] = useState('info')
    const infoTabRef = useRef(null)
    const settingsTabRef = useRef(null)
    const statsTabRef = useRef(null)

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

    const changeTab = (tab) => {
        infoTabRef.current.style.backgroundColor = "#E2E2E2"
        settingsTabRef.current.style.backgroundColor = "#E2E2E2"
        statsTabRef.current.style.backgroundColor = "#E2E2E2"

        if (tab == 'info')
            infoTabRef.current.style.backgroundColor = "#cacaca"
        else if (tab == 'settings')
            settingsTabRef.current.style.backgroundColor = "#cacaca"
        else if (tab == 'stats')
            statsTabRef.current.style.backgroundColor = "#cacaca"

        setTab(tab)
    }

    return (
        <>
            <div className="stream-container">
                <div className="stream-player-container">
                    <ReactHlsPlayer className='stream-player'
                        src={stream.hls_url}
                        autoPlay={false}
                        controls={true}
                        width="100%"
                        height="auto"
                    />
                    <div className="stream-info-container">
                        <div className="stream-tabs">
                            <div ref={infoTabRef} onClick={() => { changeTab('info') }}>Info</div>
                            <div ref={settingsTabRef} onClick={() => { changeTab('settings') }}>Settings</div>
                            <div ref={statsTabRef} onClick={() => { changeTab('stats') }}>Stats</div>
                        </div>

                        {currentTab === 'info' ? (
                            <div className="info-tab">
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
                        ) : (
                            <>
                                {currentTab === 'settings' ? (
                                    <div className='settings'>
                                        <div className="settings-left">
                                            <div className="settings-info-element">
                                                <div className="settings-info-element-title">Publish server</div>
                                                <input type="text" value={stream.primary_server} disabled />
                                            </div>
                                            <div className="settings-info-element">
                                                <div className="settings-info-element-title">Status</div>
                                                <input type="text" value={stream.status} disabled />
                                            </div>
                                        </div>
                                        <div className="settings-right">
                                            <button className="start-button settings-button">Start</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>Stats</div>
                                )

                                }
                            </>
                        )

                        }
                    </div>
                </div>
                <StreamChat socket={socket} stream={stream} />
            </div>
        </>
    )
}

export default Stream