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
import {BsFillTrashFill} from 'react-icons/bs'
import {AiOutlineClose, AiOutlinePlus} from 'react-icons/ai'

function Profile() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { user } = useSelector((state) => state.auth)
    const { streamer, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)

    const homePageRef = useRef(null)
    const aboutPageRef = useRef(null)
    const streamsPageRef = useRef(null)
    const linkModalRef = useRef(null)

    const [page, setPage] = useState('home')
    const [streamsNumber, setStreamsNumber] = useState(8)
    const [categoriesNumber, setCategoriesNumber] = useState(8)
    const [userCategories, setUserCategories] = useState([])
    const [userCategoriesCalculated, setUserCategoriesCalculated] = useState(false)
    const [userLoaded, setUserLoaded] = useState(false)
    const [isOwnProfile, setIsOwnProfile] = useState(false)

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
        setUserCategories(userCategoriesUnique)
        setUserCategoriesCalculated(true)
    }

    if (isSuccessStreamers && !userLoaded) {
        if (user && id == user._id) {
            setIsOwnProfile(true)
        }
        setUserLoaded(true)
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

    const toggleLinksModal = () => {
        console.log(linkModalRef.current.clientHeight)
        if (linkModalRef.current.clientHeight == 0) {
            linkModalRef.current.style.display = 'block'
        } else {
            linkModalRef.current.style.display = 'none'
        }
    }

    return (
        <>
        <div ref={linkModalRef} className="modal-wrapper">
            <div className="edit-links-modal">
                <div className="edit-links-header">
                    <div className="edit-links-title">Edit links</div>
                    <div className="close-button" onClick={toggleLinksModal}><AiOutlineClose size={22}/></div>
                </div>
                <div className="edit-links">
                    <div className="edit-link">
                        <select name="link-type" className="link-type">
                            <option value="instagram" selected>Instagram</option>
                            <option value="instagram">Facebook</option>
                            <option value="instagram">Youtube</option>
                            <option value="instagram">Discord</option>
                        </select>
                        <input type="text" className="link-url" />
                        <div className="link-delete-button"><BsFillTrashFill size={16}/></div>
                    </div>
                </div>
                <div className="edit-links-footer">
                    <div className="add-link-button"><AiOutlinePlus/> Link</div>
                    <div className="update-button">Save</div>
                </div>
            </div>
        </div>

        <div className="banner"></div>
        <div className="profile-box">
            <div className="profile-user-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}></div>
            <div className="profile-box-2">
                <div className="name">{streamer.name}</div>
                <div className="followers">1332 followers</div>
            </div>
            { isOwnProfile === false ? (
                    <div className="follow-button-wrapper">
                        <div className="follow-button">FOLLOW <AiOutlineStar size={20} /></div>
                    </div>
                ) : (<></>)
            }
            
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
                        <div className="about-container">
                            { isOwnProfile ? (
                                    <div className="edit-button-container"><div className="edit-button" onClick={toggleLinksModal}>edit</div></div>
                                ) : (<></>)
                            }
                            
                            <div className="stats">
                                <div className="column-1">
                                    <div className="latest-stream">Latest stream: <span className='stats-subtitle'>13 Januray 2023</span></div>
                                    <div className="first-stream">Frist stream: <span className='stats-subtitle'>1 Januray 2023</span></div>
                                    <div className="account-created">Account created: <span className='stats-subtitle'>1 Januray 2022</span></div>
                                </div>
                                <div className="columne-2">
                                    <div className="instagram">Instagram</div>
                                    <div className="facebook">Facebook</div>
                                    <div className="youtube">Youtube</div>
                                </div>
                            </div>

                            { isOwnProfile ? (
                                    <div className="edit-button-container"><div className="edit-button">edit</div></div>
                                ) : (<></>)
                            }
                            <div className="description">
                                <div className="description-title">Description</div>
                                <div className="description-content"></div>
                            </div>
                            </div>                        
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