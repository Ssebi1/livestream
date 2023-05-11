import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
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
import getDevices from '../webrtc/getDevices'
import getUserMedia from '../webrtc/getUserMedia'
import startPublish from '../webrtc/startPublish';

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

    const [layoutSelected, setLayout] = useState(1)
    const [devicesLoading, setDevicesLoading] = useState(false)
    const [cameras, setCameras] = useState([])
    const [microphones, setMicrophones] = useState([])
    const [gotPermissions, setGotPermissions] = useState(false)

    const [videoSelected1, setVideoSelected1] = useState(0)
    const [videoSelected2, setVideoSelected2] = useState(0)
    const [microphoneSelected, setMicrophoneSelected] = useState()
    const [publish, setPublish] = useState(false)
    const [publishStarting, setPublishStarting] = useState(false)

    const [websocket, setWebsocket] = useState(undefined)
    const [peerConnection, setPeerConnection] = useState(undefined)
    const [audioTrack, setAudioTrack] = useState(undefined)
    const [videoTrack, setVideoTrack] = useState(undefined)
    const [connected, setConnected] = useState(undefined)
    const [publishAudioSender, setPublishAudioSender] = useState(undefined)
    const [publishVideoSender, setPublishVideoSender] = useState(undefined)
    const [videoTracksMap, setVideoTracksMap] = useState(undefined)
    const [audioTracksMap, setAudioTracksMap] = useState(undefined)
    const [compositeAudioTrack, setCompositeAudioTrack] = useState(undefined)
    const [compositeVideoTrack, setCompositeVideoTrack] = useState(undefined)

    const video1Element = useRef(null);
    const video1ScaleMode = useRef('fill');
    const video2Element = useRef(null);
    const canvasElement = useRef(null);
    const layoutRef = useRef(null);
    const layoutSelectedRef = useRef(null)

    const [running, setRunning] = useState(false);

    let config = {
        WEBRTC_SDP_URL: stream.webrtc_url,
        WEBRTC_APPLICATION_NAME: 'myWebRTCApp',
        WEBRTC_FRAME_RATE: 29,
        WEBRTC_AUDIO_BIT_RATE: 64,
        WEBRTC_VIDEO_BIT_RATE: 360,
    }

    useEffect(() => {
        if (isErrorStreams) {
            navigate('/')
        }

        if (!gotPermissions) {
            dispatch(getPermissions)
        }

        dispatch(getStream(id))
        dispatch(setThumbnail(id))
        dispatch(loadDevices)

        // Publish video and audio
        if (publish && !publishStarting && !connected) {
            startPublish({
                signalingURL: stream.webrtc_url,
                applicationName: stream.webrtc_application_name,
                streamName: stream.webrtc_stream_name
            }, websocket, {
                onError: (error) => {
                    console.log(error)
                },
                onConnectionStateChange: (result) => {
                    setConnected(result.connected)
                },
                onSetPeerConnection: (result) => {
                    setPeerConnection(result.peerConnection)
                },
                onSetWebsocket: (result) => {
                    setWebsocket(result.websocket)
                },
                onSetSenders: (senders) => {
                    setPublishAudioSender(senders.audioSender)
                    setPublishVideoSender(senders.videoSender)
                }
            });
        }
        if (publishStarting && connected) {
            setPublishStarting(false)
        }

        return () => {
            dispatch(reset())
        }
    }, [user, navigate, isErrorStreams, messageStreams, dispatch, connected, publish, publishStarting])

    // Handle videoTrack1 changes
    useEffect(() => {
        let video1Stream = undefined;
        try {
            video1Stream = new MediaStream();
            video1Stream.addTrack(videoTracksMap[videoSelected1]);
            video1ScaleMode.current = 'fill';
        } catch { }
        if (video1Element != null && video1Element.current != null)
            video1Element.current.srcObject = video1Stream;

    }, [videoTracksMap, videoSelected1, video1Element])

    // Handle videoTrack2 changes
    useEffect(() => {
        let video2Stream = undefined;
        try {
            video2Stream = new MediaStream();
            video2Stream.addTrack(videoTracksMap[videoSelected2]);
        } catch { }
        if (video2Element != null && video2Element.current != null)
            video2Element.current.srcObject = video2Stream;

    }, [videoTracksMap, videoSelected2, video2Element])

    // Handle microphone changes
    useEffect(() => {

        let audioTrack = undefined;
        try {
            audioTrack = audioTracksMap[microphoneSelected];
        } catch { }
        if (audioTrack != null) {
            setCompositeAudioTrack(audioTrack)
        }
    }, [dispatch, audioTracksMap, microphoneSelected]);

    // Set up canvas rendering loop.
    // Using an audio oscillator instead of requestAnimationFrame allows us to keep streaming when backgrounded.
    // Using useRef() lets us touch stateful objects without triggering React renders.

    const audioContextRef = useRef(new (window.AudioContext || window.webkitAudioContext)());
    const oscillatorRef = useRef();

    const renderLoop = useCallback(() => {
        if (video1Element.current != null && video2Element.current != null && canvasElement.current != null) {
            oscillatorRef.current = audioContextRef.current.createOscillator();
            oscillatorRef.current.onended = () => { renderLoop(); };
            oscillatorRef.current.start();
            oscillatorRef.current.stop(1 / 30);
            renderFrame(video1Element.current, video2Element.current, canvasElement.current, layoutSelectedRef.current.value, video1ScaleMode.current);
        } else {
            setRunning(false)
        }
    }, []);

    // The audioContext will be suspended until a user gesture.
    // In our case, start it when a video or audio track is selected.
    // This also re-starts rendering when the component re-mounts from a react-router navigation.

    useEffect(() => {
        audioContextRef.current.resume().then(() => {
            if (!running) {
                setRunning(true)
                renderLoop();
            }
        });
    }, [running, renderLoop, videoSelected1, videoSelected2, microphoneSelected]);

    // Set up canvas captureStream when component mounts.
    useEffect(() => {
        let ctx = canvasElement.current.getContext('2d');
        let canvasStream = canvasElement.current.captureStream(30);
        setCompositeVideoTrack(canvasStream.getTracks()[0])
    }, [dispatch]);

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

    const selectLayout = (index) => {
        const layouts = document.querySelectorAll('.layout-item .layout-main')
        layouts.forEach((layout) => {
            layout.style.color = 'black'
            layout.style.borderColor = '#E2E2E2'
        })

        layouts[index - 1].style.color = '#2d806f'
        layouts[index - 1].style.borderColor = '#2d806f'
        setLayout(index)
    }

    const loadDevices = async () => {
        if (stream.engine === 'browser' && stream.status !== 'ended' && user && stream.user._id === user._id)
            return
        setDevicesLoading(true)
        try {
            let { cameras, microphones } = await getDevices();
            setCameras(cameras)
            setMicrophones(microphones)
            setDevicesLoading(false)
            await loadUserMediaForCameras(cameras)
            await loadUserMediaForMicrophones(microphones)
        }
        catch (error) {
            console.log(error);
        }
    }

    const getPermissions = async () => {
        let gotPermissionsBool = false;
        try {
            await getUserMedia({
                video: {
                    width: { min: "640", ideal: "1280", max: "1920" },
                    height: { min: "360", ideal: "720", max: "1080" },
                    frameRate: "30"
                }, audio: true
            });
            gotPermissionsBool = true;
        }
        catch { }
        setGotPermissions(gotPermissionsBool)
    }

    const pipScale = (1 / 4);
    const padding = (1 / 16);

    const fillSize = (srcSize, dstSize, scale = 1) => {

        let heightRatio = dstSize.height / srcSize.height;
        let widthRatio = dstSize.width / srcSize.width;
        let fillRatio = Math.max(heightRatio, widthRatio);
        return {
            width: srcSize.width * fillRatio * scale,
            height: srcSize.height * fillRatio * scale
        }
    }

    const fitSize = (srcSize, dstSize, scale = 1) => {

        let heightRatio = dstSize.height / srcSize.height;
        let widthRatio = dstSize.width / srcSize.width;
        let fillRatio = Math.min(heightRatio, widthRatio);
        return {
            width: srcSize.width * fillRatio * scale,
            height: srcSize.height * fillRatio * scale
        }
    }

    const pipOffset = (layout, canvasSize, pipSize, padding) => {

        let paddingVert = canvasSize.height * padding;
        let paddingHorz = canvasSize.width * padding;

        // PIP Top-Right
        if (layout === 2 || layout === 3) {
            return {
                top: paddingVert,
                left: canvasSize.width - pipSize.width - paddingHorz
            }
        }
        // PIP Top-Left
        if (layout === 4) {
            return {
                top: paddingVert,
                left: paddingHorz
            }
        }
        // PIP Bottom-Left
        if (layout === 5) {
            return {
                top: canvasSize.height - pipSize.height - paddingVert,
                left: paddingHorz
            }
        }
        // PIP Bottom-Right
        if (layout === 6) {
            return {
                top: canvasSize.height - pipSize.height - paddingVert,
                left: canvasSize.width - pipSize.width - paddingHorz
            }
        }

        return { top: 0, left: 0 };
    }

    // Grab frames from video1 and video2, composite on the canvas
    const renderFrame = (video1, video2, canvas, layout, video1ScaleMode) => {
        try {
            layout = parseInt(layout)
        } catch {}
        let context = canvas.getContext('2d');

        // set canvas size to 720p
        canvas.width = 1280;
        canvas.height = 720;

        context.fillStyle = "gray";
        context.fillRect(0, 0, canvas.width, canvas.height);

        let video1Full = layout === 0 || layout === 2 || layout === 4 || layout === 5 || layout === 6;
        let video1Pip = layout === 3;
        let video2Full = layout === 1 || layout === 3;
        let video2Pip = layout === 2 || layout === 4 || layout === 5 || layout === 6;

        let canvasSize = { width: canvas.width, height: canvas.height };
        let video1Size = { width: video1.videoWidth, height: video1.videoHeight };
        let video2Size = { width: video2.videoWidth, height: video2.videoHeight };

        // render video1 to fill canvas
        if (video1Full && video1.readyState === video1.HAVE_ENOUGH_DATA) {
            let renderSize = (video1ScaleMode === 'fill') ? fillSize(video1Size, canvasSize, 1) : fitSize(video1Size, canvasSize, 1);
            let xOffset = (canvasSize.width - renderSize.width) / 2;
            let yOffset = (canvasSize.height - renderSize.height) / 2;
            context.drawImage(video1, xOffset, yOffset, renderSize.width, renderSize.height);
        }

        // render video2 to fill canvas
        if (video2Full && video2.readyState === video2.HAVE_ENOUGH_DATA) {
            let renderSize = fillSize(video2Size, canvasSize, 1);
            let xOffset = (canvasSize.width - renderSize.width) / 2;
            let yOffset = (canvasSize.height - renderSize.height) / 2;
            context.drawImage(video2, xOffset, yOffset, renderSize.width, renderSize.height);
        }

        // render video1 as pip
        if (video1Pip && video1.readyState === video1.HAVE_ENOUGH_DATA) {
            let renderSize = fitSize(video1Size, canvasSize, pipScale);
            let offset = pipOffset(layout, canvasSize, renderSize, padding);
            context.drawImage(video1, offset.left, offset.top, renderSize.width, renderSize.height);
        }

        // render video2 as pip
        if (video2Pip && video2.readyState === video2.HAVE_ENOUGH_DATA) {
            let renderSize = fitSize(video2Size, canvasSize, pipScale);
            let offset = pipOffset(layout, canvasSize, renderSize, padding);
            context.drawImage(video2, offset.left, offset.top, renderSize.width, renderSize.height);
        }

        // 2-up
        if (layout === 7) {
            if (video1.readyState === video1.HAVE_ENOUGH_DATA) {
                let renderSize = fitSize(video1Size, canvasSize, 0.5);
                let xOffset = (canvasSize.width / 2 - renderSize.width) / 2;
                let yOffset = canvasSize.height / 2 - renderSize.height / 2;
                context.drawImage(video1, xOffset, yOffset, renderSize.width, renderSize.height);
            }
            if (video2.readyState === video2.HAVE_ENOUGH_DATA) {
                let renderSize = fitSize(video2Size, canvasSize, 0.5);
                let xOffset = (canvasSize.width - renderSize.width) + ((canvasSize.width / 2 - renderSize.width) / 2);
                let yOffset = canvasSize.height / 2 - renderSize.height / 2;
                context.drawImage(video2, xOffset, yOffset, renderSize.width, renderSize.height);
            }
        }

    }

    const loadUserMediaForCameras = async (cameras) => {

        let newVideoTracksMap = { ...videoTracksMap };
        for (let i = 0; i < cameras.length; i++) {
            let constraints = {
                video: {
                    width: { min: "640", ideal: "1280", max: "1920" },
                    height: { min: "360", ideal: "720", max: "1080" },
                    frameRate: "30"
                },
                audio: false
            };
            constraints.video.deviceId = cameras[i].deviceId;

            try {
                let stream = await getUserMedia(constraints);
                let videoTracks = stream.getVideoTracks();
                if (videoTracks.length > 0) {
                    newVideoTracksMap[cameras[i].deviceId] = videoTracks[0];
                }
            } catch (e) {
            }
        }
        setVideoTracksMap(newVideoTracksMap)
    }

    const loadUserMediaForMicrophones = async (microphones) => {

        let newAudioTracksMap = { ...audioTracksMap };
        for (let i = 0; i < microphones.length; i++) {
            let constraints = { audio: {} };
            constraints.audio.deviceId = microphones[i].deviceId;

            try {

                let stream = await getUserMedia(constraints);
                let audioTracks = stream.getAudioTracks();
                if (audioTracks.length > 0) {
                    newAudioTracksMap[microphones[i].deviceId] = audioTracks[0];
                }

            } catch (e) {
            }
        }
        setAudioTracksMap(newAudioTracksMap)
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
                                <>
                                </>
                                // <Player stream={stream} />
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

                    <>
                        <canvas ref={canvasElement} id="publisher-canvas"></canvas>
                        <video ref={video1Element} id="publisher-video1" autoPlay style={{display:'none'}}></video>
                        <video ref={video2Element} id="publisher-video2" autoPlay style={{display:'none'}}></video>
                    </>

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
                                                            <select onChange={(e) => { setVideoSelected1(e.target.value) }}>
                                                                <option value="0" selected>None</option>
                                                                {cameras.map((camera) => (
                                                                    <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Video source 2</div>
                                                            <select onChange={(e) => { setVideoSelected2(e.target.value) }}>
                                                                <option value="0" selected>None</option>
                                                                {cameras.map((camera) => (
                                                                    <option key={camera.deviceId} value={camera.deviceId}>{camera.label}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="settings-info-element">
                                                            <div className="settings-info-element-title">Microphone</div>
                                                            <select onChange={(e) => { setMicrophoneSelected(e.target.value) }}>
                                                                <option value="0" selected>None</option>
                                                                {microphones.map((microphone) => (
                                                                    <option key={microphone.deviceId} value={microphone.deviceId}>{microphone.label}</option>
                                                                ))}
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
                                                <div className="publish-button settings-button" onClick={() => { setPublish(true) }}>Publish</div>
                                            </div>
                                        </div>
                                        {stream.engine === 'personal' ? (
                                            <></>
                                        ) : (
                                            <div className="settings-bottom">
                                                <div className="settings-bottom-title">Layout</div>
                                                <input type="text" value={layoutSelected} ref={layoutSelectedRef}></input>
                                                <div className="layouts-container">
                                                    <div className="layout-item" onClick={() => { selectLayout(1) }}>
                                                        <div className="layout-main" style={{ color: '#2d806f', borderColor: '#2d806f' }}>1</div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(2) }}>
                                                        <div className="layout-main">2</div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(3) }}>
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ top: 10, right: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(4) }}>
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ bottom: 10, right: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(5) }}>
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ bottom: 10, left: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(6) }}>
                                                        <div className="layout-main">1
                                                            <div className="layout-secondary" style={{ top: 10, left: 10 }}>2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(7) }}>
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ top: 10, right: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(8) }}>
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ bottom: 10, right: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(9) }}>
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ bottom: 10, left: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(10) }}>
                                                        <div className="layout-main">2
                                                            <div className="layout-secondary" style={{ top: 10, left: 10 }}>1</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(11) }}>
                                                        <div className="layout-main layout-halfs">
                                                            <div className="layout-half-left">1</div>
                                                            <div className="layout-half-right">2</div>
                                                        </div>
                                                    </div>
                                                    <div className="layout-item" onClick={() => { selectLayout(12) }}>
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