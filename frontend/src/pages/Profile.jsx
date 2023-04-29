import { Link, useNavigate, useParams } from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStream, getUserStreams, reset } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import { AiOutlineStar } from "react-icons/ai";
import '../profile-page.css'
import { getStreamer } from '../features/streamers/streamerSlice'
import StreamItemMinimal from '../components/StreamItemMinimal'
import {FaChevronRight} from 'react-icons/fa'
import CategoryItem from '../components/CategoryItem'

function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { streamer, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)

    const homePageRef = useRef(null)
    const aboutPageRef = useRef(null)
    const streamsPageRef = useRef(null)

    const [page, setPage] = useState('home')
    const [streamsNumber, setStreamsNumber] = useState(8)
    const [categoriesNumber, setCategoriesNumber] = useState(8)
    const [userCategories, setUserCategories] = useState([])
    const [userCategoriesCalculated, setUserCategoriesCalculated] = useState(false)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setStreamsNumber(window.innerWidth/240)
                setCategoriesNumber(window.innerWidth/240)
            } else {
                setStreamsNumber(10)
                setCategoriesNumber(10)
            }
            
        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)

        if (isErrorStreamers || isErrorStreams) {
            console.log(messageStreamers)
        }

        dispatch(getStreamer(id))
        dispatch(getUserStreams(id))

        return () => {
            dispatch(reset())
        }
    }, [])

    if (isLoadingStreamers || isLoadingStreams) {
        return <Spinner />
    }

    if (isSuccessStreams && !userCategoriesCalculated) {
        let userCategories = []
        for (let stream of streams) {
            userCategories.push(stream.category)
        }
        let userCategoriesUnique = [...new Map(userCategories.map(item => [item['_id'], item])).values()];
        console.log(userCategoriesUnique)
        setUserCategories(userCategoriesUnique)
        setUserCategoriesCalculated(true)
    }

    const selectPage = (option) => {
        if (option == 'home') {
            homePageRef.current.style.borderColor = "#2d806f"
            homePageRef.current.style.color = "#2d806f"
            aboutPageRef.current.style.borderColor = "black"
            aboutPageRef.current.style.color = "black"
            streamsPageRef.current.style.borderColor = "black"
            streamsPageRef.current.style.color = "black"
        } else if (option == 'about') {
            homePageRef.current.style.borderColor = "black"
            homePageRef.current.style.color = "black"
            streamsPageRef.current.style.borderColor = "black"
            streamsPageRef.current.style.color = "black"
            aboutPageRef.current.style.borderColor = "#2d806f"
            aboutPageRef.current.style.color = "#2d806f"
        } else if (option == 'streams') {
            streamsPageRef.current.style.borderColor = "#2d806f"
            streamsPageRef.current.style.color = "#2d806f"
            homePageRef.current.style.borderColor = "black"
            homePageRef.current.style.color = "black"
            aboutPageRef.current.style.borderColor = "black"
            aboutPageRef.current.style.color = "black"
        }
    }

    return (
        <>
        <div className="banner"></div>
        <div className="profile-box">
            <div className="profile-user-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}></div>
            <div className="profile-box-2">
                <div className="name">{streamer.name}</div>
                <div className="followers">1332 followers</div>
            </div>
            <div className="follow-button-wrapper">
                <div className="follow-button">FOLLOW <AiOutlineStar size={20} /></div>
            </div>
        </div>
        <div className="profile-pages">
            <div className='home-profile-page' ref={homePageRef} onClick={() => {setPage('home'); selectPage('home')}}>Home</div>
            <div className='about-profile-page' ref={aboutPageRef} onClick={() => {setPage('about'); selectPage('about')}}>About</div>
            <div className='streams-profile-page' ref={streamsPageRef} onClick={() => {setPage('streams'); selectPage('streams')}}>Streams</div>
        </div>
        <div className="profile-content">
            {page === "home"
                ? (
                    <>
                    <div className="profile-streams-container">
                        <div className="profile-title-container">
                            <div className="profile-title">Streams</div>
                            <div className="profile-view-more">View more <FaChevronRight size={14}/></div>
                        </div>
                        <section className="profile-streams">
                            {streams.slice(0, (streamsNumber)).map((stream) => (
                                <StreamItemMinimal key={stream._id} stream={stream} />
                            ))}
                        </section>
                    </div>

                    <div className="profile-categories-container">
                        <div className="profile-title-container">
                            <div className="profile-title">Categories</div>
                            <div className="profile-view-more">View more <FaChevronRight size={14}/></div>
                        </div>
                        <section className="profile-categories">
                            {userCategories.slice(0, (categoriesNumber)).map((category) => (
                                <CategoryItem key={category._id} category={category} />
                            ))}
                        </section>
                    </div>
                    </>
                    
                ) : ( page === "about"
                    ? (
                        <div className="about-container">About</div>
                        
                    ) : (
                        <div className="streams-container">Streams</div>
                    )
                )
            }
        </div>
        </>
    )
}

export default Profile