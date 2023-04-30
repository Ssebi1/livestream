import { Link, useNavigate, useParams } from 'react-router-dom'
import {useState, useEffect, useRef} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {  getUserStreams, reset } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import { AiOutlineStar } from "react-icons/ai";
import '../profile-page.css'
import { getStreamer } from '../features/streamers/streamerSlice'
import StreamItemMinimal from '../components/StreamItemMinimal'
import {FaChevronRight} from 'react-icons/fa'
import CategoryItem from '../components/CategoryItem'
import {BsFillTrashFill, BsInstagram, BsDiscord} from 'react-icons/bs'
import {AiOutlineClose, AiOutlinePlus} from 'react-icons/ai'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import {uploadProfilePicture, uploadBannerPicture, updateUser} from '../features/auth/authSlice'
import {FaFacebook, FaYoutube} from 'react-icons/fa'

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
    const descriptionModalWrapper = useRef(null)

    const [page, setPage] = useState('home')
    const [streamsNumber, setStreamsNumber] = useState(8)
    const [categoriesNumber, setCategoriesNumber] = useState(8)
    const [userCategories, setUserCategories] = useState([])
    const [userCategoriesCalculated, setUserCategoriesCalculated] = useState(false)
    const [userLoaded, setUserLoaded] = useState(false)
    const [isOwnProfile, setIsOwnProfile] = useState(false)
    const [file, setFile] = useState()
    const [editDescription, setEditDescription] = useState()

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
        setEditDescription(streamer.description)
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

    const toggleDescriptionModal = () => {
        if (descriptionModalWrapper.current.clientHeight == 0) {
            descriptionModalWrapper.current.style.display = 'block'
        } else {
            descriptionModalWrapper.current.style.display = 'none'
        }
    }

    const submitProfilePicture = async e => {
        let uploadFile = e.target.files[0]
        let newFile = new File([uploadFile], user._id + '.png')
        let formData = new FormData();
        formData.append('image', newFile)
        dispatch(uploadProfilePicture(formData))
    }    

    const submitProfileBanner  = async e => {
        let uploadFile = e.target.files[0]
        let newFile = new File([uploadFile], user._id + '.png')
        let formData = new FormData();
        formData.append('image', newFile)
        dispatch(uploadBannerPicture(formData))
    }   

    const saveDescription = async () => {
        let updateMap = {
            "description": editDescription
        }
        dispatch(updateUser({
            "user_id": user._id,
            "streamer_id": streamer._id,
            "updateMap": updateMap
        }))
        toggleDescriptionModal()
        window.location.reload(true)
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
                        <input type="text" className="link-url" placeholder='url'/>
                        <div className="link-delete-button"><BsFillTrashFill size={16}/></div>
                    </div>
                </div>
                <div className="edit-links-footer">
                    <div className="add-link-button"><AiOutlinePlus/> Link</div>
                    <div className="update-button">Save</div>
                </div>
            </div>
        </div>

        <div ref={descriptionModalWrapper} className="modal-wrapper">
            <div className="description-modal">
                <div className="description-header">
                    <div className="description-title">Edit description</div>
                    <div className="close-button" onClick={toggleDescriptionModal}><AiOutlineClose size={22}/></div>
                </div>
                <textarea name="profile-description" id="profile-description" cols="40" rows="10" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                <div className="description-footer">
                    <div className="clear-button" onClick={() => setEditDescription("")}>Clear</div>
                    <div className="update-button" onClick={saveDescription}>Save</div>
                </div>
            </div>
        </div>

        <div className="banner" style={{backgroundImage: `url('/banner-pictures/${streamer._id}.png'), url('/banner-pictures/banner-image.png')`}}>
            { isOwnProfile ? (
                    <div className="upload">
                        <input className="upload-input" name="profileFile" id="profileFile" filename={file} onChange={(e) => {submitProfileBanner(e)}} type="file" accept="image/*"></input>
                        <label className='upload-icon' htmlFor="profileFile"><AiOutlineCloudUpload size={40}/></label>
                    </div>
                ) : (<></>)
            }
        </div>
        <div className="profile-box">
            <div className="profile-user-picture"  style={{backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/profile-pictures/blank-profile-picture.png')`}}>
                { isOwnProfile ? (
                        <div className="upload">
                            <input className="upload-input" name="bannerFile" id="bannerFile" filename={file} onChange={(e) => {submitProfilePicture(e)}} type="file" accept="image/*"></input>
                            <label className='upload-icon' htmlFor="bannerFile"><AiOutlineCloudUpload size={40}/></label>
                        </div>
                    ) : (<></>)
                }
            </div>
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
                                    <div className="instagram"><BsInstagram/> Instagram</div>
                                    <div className="facebook"><FaFacebook/> Facebook</div>
                                    <div className="youtube"><FaYoutube/> Youtube</div>
                                </div>
                            </div>

                            { isOwnProfile ? (
                                    <div className="edit-button-container"><div className="edit-button" onClick={toggleDescriptionModal}>edit</div></div>
                                ) : (<></>)
                            }
                            <div className="description">
                                <div className="description-title">Description</div>
                                <div className="description-content">{streamer.description}</div>
                            </div>
                            </div>                        
                    ) : (
                        <section className="profile-streams-2">
                            {streams.map((stream) => (
                                <StreamItemMinimal key={stream._id} stream={stream} />
                            ))}
                        </section>
                    )
                )
            }
        </div>
        </>
    )
}

export default Profile