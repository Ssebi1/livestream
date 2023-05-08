import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteStream, endStream, getStream, reset, setThumbnail, startStream } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import StreamChat from '../components/StreamChat'
import { AiOutlineStar } from "react-icons/ai";
import io from 'socket.io-client';
import '../stream-page.css'
import { followUser, unfollowUser } from '../features/auth/authSlice'
import React from 'react';
import Player from '../components/play/Player'
import Flowplayer, { useFlowplayer } from "@flowplayer/react-flowplayer"
import HLSPlugin from "@flowplayer/player/plugins/hls"
import flowplayer from "@flowplayer/player"
import "@flowplayer/player/flowplayer.css";

flowplayer(HLSPlugin)

const socket = io.connect('http://localhost:4000');

function Stream() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { stream, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    let stream_primary_server = stream.primary_server + ':' + stream.host_port

    const [currentTab, setTab] = useState('info')
    const infoTabRef = useRef(null)
    const settingsTabRef = useRef(null)
    const statsTabRef = useRef(null)

    let config = {
        WEBRTC_SDP_URL: stream.webrtc_url,
        WEBRTC_APPLICATION_NAME: 'myWebRTCApp',
        WEBRTC_FRAME_RATE: 29,
        WEBRTC_AUDIO_BIT_RATE: 64,
        WEBRTC_VIDEO_BIT_RATE: 360,
    }

    useEffect(() => {
        if (isErrorStreams) {
            console.log(messageStreams)
            navigate('/')
        }

        dispatch(getStream(id))
        dispatch(setThumbnail(id))

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

    const startStreamClick = () => {

    }

    return (
        <>
            <div className="stream-container">
                <div className="stream-player-container">
                    {stream.status === 'started' ? (
                        <>
                            {stream.engine === 'personal' ? (
                                <div className="stream-player" style={{ position: "relative" }}>
                                    <Flowplayer id="flow-player" src={stream.hls_url} opts={{ controls: true, live: true, retry: true, seekable: false }} />
                                </div>
                            ) : (
                                <Player stream={stream} />
                            )
                            }
                        </>
                    ) : (
                        <>
                            {stream.status === 'ended' ? (
                                <div className="stream-player" style={{ position: "relative" }}>
                                    <Flowplayer id="flow-player" className="use-play-2 use-drag-handle" src={stream.vod_recording_hls_url} opts={{ controls: true }} />
                                </div>
                            ) : (
                                <div className="stream-player"></div>
                            )
                            }
                        </>
                    )
                    }

                    <div className="stream-info-container">
                        {user && stream.user._id === user._id ? (
                            <div className="stream-tabs">
                                <div ref={infoTabRef} onClick={() => { changeTab('info') }}>Info</div>
                                <div ref={settingsTabRef} onClick={() => { changeTab('settings') }}>Settings</div>
                                <div ref={statsTabRef} onClick={() => { changeTab('stats') }}>Stats</div>
                            </div>
                        ) : (
                            <></>
                        )
                        }
                        {currentTab === 'info' ? (
                            <div className="info-tab">
                                <div className="stream-info-container-1">
                                    <Link to={{ pathname: `/profile/${stream.user._id}` }}><div className="stream-author-profile-picture" style={{ backgroundImage: `url('/profile-pictures/${stream.user._id}.png'), url('/profile-pictures/blank-profile-picture.png')` }}></div></Link>
                                </div>
                                <div className="stream-info-container-2">
                                    <div className="stream-title">{stream.title}</div>
                                    <Link to={{ pathname: `/profile/${stream.user._id}` }}><div className="stream-author-username">{stream.user.name}</div></Link>
                                    <Link to={{ pathname: `/streams/${stream.category._id}` }}><div className="stream-category">{stream.category.name}</div></Link>
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
                                        <div className="settings-top">
                                            <div className="settings-left">
                                                {stream.engine === 'personal' ? (
                                                    <>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Publish server</div>
                                                            <input type="text" value={stream_primary_server} disabled />
                                                        </div>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Status</div>
                                                            <input type="text" value={stream.status} disabled />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Video source 1</div>
                                                            <select>
                                                                <option value="camera">Camera</option>
                                                                <option value="camera">Screenshare</option>
                                                            </select>
                                                        </div>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Video source 2</div>
                                                            <select>
                                                                <option value="camera">Camera</option>
                                                                <option value="camera">Screenshare</option>
                                                            </select>
                                                        </div>
                                                    </>
                                                )
                                                }

                                            </div>
                                            <div className="settings-right">
                                                {stream.status === 'created' ? (
                                                    <div className="start-button settings-button" onClick={() => { dispatch(startStream(stream._id)) }}>Start</div>
                                                ) : (
                                                    <>
                                                        {stream.status === 'started' ? (
                                                            <div className="end-button settings-button" onClick={() => { dispatch(endStream(stream._id)) }}>End</div>
                                                        ) : (
                                                            <div className="end-button settings-button" onClick={() => { dispatch(deleteStream(stream._id)); navigate('/') }}>Delete</div>
                                                        )
                                                        }
                                                    </>
                                                )
                                                }
                                            </div>
                                        </div>
                                        {stream.engine === 'personal' ? (
                                            <></>
                                        ) : (
                                            <div className="settings-bottom">
                                                <div className="settings-bottom-title">Layout</div>
                                                <div className="layouts-container">
                                                    <div className="layout-item">
                                                        <div className="layout-main">1</div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">2</div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ top: 10, right: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ bottom: 10, right: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ bottom: 10, left: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ top: 10, left: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ top: 10, right: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ bottom: 10, right: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ bottom: 10, left: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ top: 10, left: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main layout-halfs">
                                                            <div className="layout-half-left">1</div>
                                                            <div className="layout-half-right">2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item">
                                                        <div className="layout-main layout-halfs">
                                                            <div className="layout-half-left">2</div>
                                                            <div className="layout-half-right">1</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                        }
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