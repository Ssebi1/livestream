import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import startPlay from '../../webrtc/startPlay';
import stopPlay from '../../webrtc/stopPlay';

const Player = (props) => {

  const videoElement = useRef(null);

  const dispatch = useDispatch();
  const stream = props.stream

  const [playSettings, setPlaySettings] = useState({
    signalingURL: stream.webrtc_url,
    applicationName: stream.webrtc_application_name,
    streamName: stream.webrtc_stream_name,
    playStarting: false
  })

  const [websocket, setWebsocket] = useState(undefined)
  const [peerConnection, setPeerConnection] = useState(undefined)
  const [audioTrack, setAudioTrack] = useState(undefined)
  const [videoTrack, setVideoTrack] = useState(undefined)
  const [connected, setConnected] = useState(undefined)

  useEffect(() => {
    if (!playSettings.playStarting && !connected) {
      setPlayStatus('playStarting')
      startPlay(playSettings, websocket, {
        onError: (error) => {
          setPlayStatus('')
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
        onPeerConnectionOnTrack: (event) => {
          if (event.track != null && event.track.kind != null) {
            if (event.track.kind === 'audio') {
              setAudioTrack(event.track)
            }
            else if (event.track.kind === 'video') {
              setVideoTrack(event.track)
            }
          }
        }
      });
    }

    if (playSettings.playStarting && connected) {
      setPlayStatus('playStarting')
    }
  }, [dispatch, videoElement, playSettings, peerConnection, websocket, connected]);

  const setPlayStatus = (status) => {
    let playSettingsCopy = playSettings
    playSettingsCopy.playStarting = false

    if (status === 'playStarting')
      playSettingsCopy.playStarting = true
    setPlaySettings(playSettingsCopy)
  }

  useEffect(() => {

    if (connected) {
      let newStream = new MediaStream();
      if (audioTrack != null)
        newStream.addTrack(audioTrack);

      if (videoTrack != null)
        newStream.addTrack(videoTrack);

      if (videoElement != null && videoElement.current != null)
        videoElement.current.srcObject = newStream;
    }
    else {
      if (videoElement != null && videoElement.current != null)
        videoElement.current.srcObject = null;
    }

  }, [audioTrack, videoTrack, connected, videoElement]);

  if (!connected)
    return(
      <div className="stream-player">Stream starting soon</div>
    )

  return (
    <video className="stream-player" ref={videoElement} autoPlay playsInline muted controls></video>
  );
}

export default Player;