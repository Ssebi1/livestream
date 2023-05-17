import { useParams } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getUserStreams, reset } from '../features/streams/streamSlice'
import Spinner from '../components/Spinner'
import { AiOutlineStar } from "react-icons/ai";
import '../profile-page.css'
import { getStreamer, updateUser } from '../features/streamers/streamerSlice'
import StreamItemMinimal from '../components/StreamItemMinimal'
import { FaChevronRight } from 'react-icons/fa'
import CategoryItem from '../components/CategoryItem'
import { BsFillTrashFill, BsInstagram, BsDiscord } from 'react-icons/bs'
import { AiOutlineClose, AiOutlinePlus } from 'react-icons/ai'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { uploadProfilePicture, uploadBannerPicture, followUser, unfollowUser } from '../features/auth/authSlice'
import { Markup } from 'interweave';
import { getUserCategories } from '../features/categories/categorySlice'

function Profile() {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { user, isError, isSuccess, isLoading } = useSelector((state) => state.auth)
    const { streamer, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)

    const homePageRef = useRef(null)
    const aboutPageRef = useRef(null)
    const streamsPageRef = useRef(null)
    const linkModalRef = useRef(null)
    const descriptionModalWrapper = useRef(null)

    const [page, setPage] = useState('home')
    const [streamsNumber, setStreamsNumber] = useState(8)
    const [categoriesNumber, setCategoriesNumber] = useState(8)
    const [userLoaded, setUserLoaded] = useState(false)
    const [isOwnProfile, setIsOwnProfile] = useState(false)
    const [file, setFile] = useState()
    const [editDescription, setEditDescription] = useState("")
    const [links, setLinks] = useState([])
    const [linkTypes, setLinkTypes] = useState([])
    const [categoryFilter, setCategoryFilter] = useState('all')


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setStreamsNumber(window.innerWidth / 240)
                setCategoriesNumber(window.innerWidth / 240)
            } else {
                setStreamsNumber(10)
                setCategoriesNumber(10)
            }

        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)
        window.addEventListener('click', onClickOutside)

        if (isErrorStreamers || isErrorStreams || isErrorCategories || isError) {
            console.log(messageStreamers)
        }

        dispatch(getStreamer(id))
        dispatch(getUserStreams(id))
        dispatch(getUserCategories(id))
        setLinkTypes(['Instagram', 'Facebook', 'Youtube', 'Discord'])

        return () => {
            dispatch(reset())
            setCategoryFilter('all')
            window.removeEventListener("click", onClickOutside);
        }
    }, [id])

    if (isLoadingStreamers || isLoadingStreams || isLoadingCategories || isLoading) {
        return <Spinner />
    }

    if (isSuccessStreamers && !userLoaded) {
        setEditDescription(streamer.description)
        setLinks(streamer.links)
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
        setLinks(streamer.links)
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

    const submitProfileBanner = async e => {
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
    }

    const saveLinks = async () => {
        let updateMap = {
            "links": links
        }
        dispatch(updateUser({
            "user_id": user._id,
            "streamer_id": streamer._id,
            "updateMap": updateMap
        }))
        toggleLinksModal()
    }

    const addLink = () => {
        if (links.length >= linkTypes.length) {
            return
        }
        let linksCopy = [...links]
        linksCopy.push({
            'type': 'Instagram',
            'url': ''
        })
        setLinks(linksCopy)
    }

    const deleteLink = (index) => {
        let linksCopy = structuredClone(links)
        linksCopy.splice(index, 1)
        setLinks(linksCopy)
    }

    const onChangeLinkUrl = (index, e) => {
        let linksCopy = structuredClone(links)
        console.log(linksCopy[index])
        linksCopy[index].url = e.target.value
        setLinks(linksCopy)
    }

    const onChangeLinkType = (index, e) => {
        let linksCopy = structuredClone(links)
        linksCopy[index].type = e.target.value
        setLinks(linksCopy)
    }

    const viewAllStreams = () => {
        setPage('streams')
        selectPage('streams')
        setCategoryFilter('all')
    }

    const viewCategoryStreams = (category_id) => {
        setPage('streams')
        selectPage('streams')
        setCategoryFilter(category_id)
    }

    const follow = () => {
        dispatch(followUser({
            'source': user._id,
            'destination': streamer._id
        }))
    }

    const unfollow = () => {
        dispatch(unfollowUser({
            'source': user._id,
            'destination': streamer._id
        }))
    }

    const onClickOutside = (e) => {
        try {
            let parentModal = document.querySelector('.edit-links-modal')
            if (!e.target.className.includes('link-delete-button') && !parentModal.contains(e.target) && !e.target.className.includes('edit-button')) {
                setLinks(streamer.links)
                linkModalRef.current.style.display = 'none'
            }

            parentModal = document.querySelector('.description-modal')
            if (!parentModal.contains(e.target) && !e.target.className.includes('edit-button')) {
                setEditDescription(streamer.description)
                descriptionModalWrapper.current.style.display = 'none'
            }
        } catch { }
    };

    return (
        <>
            <div className="profile-wrapper" key={id}>
                <div ref={linkModalRef} className="modal-wrapper">
                    <div className="edit-links-modal">
                        <div className="edit-links-header">
                            <div className="edit-links-title">Edit links</div>
                            <div className="close-button" onClick={toggleLinksModal}><AiOutlineClose size={22} /></div>
                        </div>
                        <div className="edit-links">
                            {links !== undefined && links.map((link, index) => (
                                <div className="edit-link">
                                    <select name="link-type" className="link-type" onChange={(e) => { onChangeLinkType(index, e) }}>
                                        {linkTypes.map((linkType) => (
                                            linkType === link.type ? (
                                                <option value={linkType} selected>{linkType}</option>
                                            ) : (
                                                <option value={linkType}>{linkType}</option>
                                            )
                                        ))}
                                    </select>
                                    <input type="text" className="link-url" placeholder='url' value={link.url} onChange={(e) => { onChangeLinkUrl(index, e) }} />
                                    <div className="link-delete-button" onClick={() => { deleteLink(index) }}><BsFillTrashFill size={16} /></div>
                                </div>
                            ))}
                        </div>
                        <div className="edit-links-footer">
                            <div className="add-link-button" onClick={addLink}><AiOutlinePlus /> Link</div>
                            <div className="update-button" onClick={saveLinks}>Save</div>
                        </div>
                    </div>
                </div>

                <div ref={descriptionModalWrapper} className="modal-wrapper">
                    <div className="description-modal">
                        <div className="description-header">
                            <div className="description-title">Edit description</div>
                            <div className="close-button" onClick={toggleDescriptionModal}><AiOutlineClose size={22} /></div>
                        </div>
                        <textarea name="profile-description" id="profile-description" cols="40" rows="10" value={editDescription} onChange={(e) => setEditDescription(e.target.value)}></textarea>
                        <div className="description-footer">
                            <div className="clear-button" onClick={() => setEditDescription("")}>Clear</div>
                            <div className="update-button" onClick={saveDescription}>Save</div>
                        </div>
                    </div>
                </div>

                <div className="banner" style={{ backgroundImage: `url('/banner-pictures/${streamer._id}.png'), url('/defaults/banner-image.png')` }}>
                    {isOwnProfile ? (
                        <div className="upload">
                            <input className="upload-input" name="profileFile" id="profileFile" filename={file} onChange={(e) => { submitProfileBanner(e) }} type="file" accept="image/*"></input>
                            <label className='upload-icon' htmlFor="profileFile"><AiOutlineCloudUpload size={40} /></label>
                        </div>
                    ) : (<></>)
                    }
                </div>
                <div className="profile-box">
                    <div className="profile-user-picture" style={{ backgroundImage: `url('/profile-pictures/${streamer._id}.png'), url('/defaults/profile-image.png')` }}>
                        {isOwnProfile ? (
                            <div className="upload">
                                <input className="upload-input" name="bannerFile" id="bannerFile" filename={file} onChange={(e) => { submitProfilePicture(e) }} type="file" accept="image/*"></input>
                                <label className='upload-icon' htmlFor="bannerFile"><AiOutlineCloudUpload size={40} /></label>
                            </div>
                        ) : (<></>)
                        }
                    </div>
                    <div className="profile-box-2">
                        <div className="name">{streamer.name}</div>
                        <div className="followers">{streamer.followersNr} followers</div>
                    </div>
                    {isOwnProfile || !user ? (
                        <></>
                    ) : (<>
                        {user.following.includes(streamer._id) ? (
                            <div className="follow-button-wrapper">
                                <div className="follow-button unfollow-button" onClick={unfollow}>UNFOLLOW <AiOutlineStar size={20} /></div>
                            </div>
                        ) : (
                            <div className="follow-button-wrapper">
                                <div className="follow-button" onClick={follow}>FOLLOW <AiOutlineStar size={20} /></div>
                            </div>
                        )
                        }
                    </>)
                    }

                </div>
                <div className="profile-pages">
                    <div className='home-profile-page' ref={homePageRef} onClick={() => { setPage('home'); selectPage('home') }}>Home</div>
                    <div className='about-profile-page' ref={aboutPageRef} onClick={() => { setPage('about'); selectPage('about') }}>About</div>
                    <div className='streams-profile-page' ref={streamsPageRef} onClick={() => { setPage('streams'); selectPage('streams') }}>Streams</div>
                </div>
                <div className="profile-content">
                    {page === "home"
                        ? (
                            <>
                                <div className="profile-streams-container">
                                    <div className="profile-title-container">
                                        <div className="profile-title">Streams</div>
                                        <div className="profile-view-more" onClick={viewAllStreams}>View more <FaChevronRight size={14} /></div>
                                    </div>
                                    <section className="profile-streams">
                                        {user && user._id === streamer._id ? (
                                            <>{
                                                streams.filter(stream => stream.category._id === categoryFilter || categoryFilter === "all").slice(0, (streamsNumber)).map((stream) => (
                                                    <StreamItemMinimal key={stream._id} stream={stream} />
                                                ))
                                            }</>
                                        ) : (<>
                                            {streams.filter(stream => (stream.category._id === categoryFilter || categoryFilter === "all") && stream.status === 'ended' || stream.status === 'started').slice(0, (streamsNumber)).map((stream) => (
                                                <StreamItemMinimal key={stream._id} stream={stream} />
                                            ))}
                                        </>)
                                        }
                                    </section>
                                </div>

                                <div className="profile-categories-container">
                                    <div className="profile-title-container">
                                        <div className="profile-title">Categories</div>
                                    </div>
                                    <section className="profile-categories">
                                        {categories.slice(0, (categoriesNumber)).map((category) => (
                                            <CategoryItem key={category._id} category={category} onPress={() => { viewCategoryStreams(category._id) }} />
                                        ))}
                                    </section>
                                </div>
                            </>

                        ) : (page === "about"
                            ? (
                                <div className="about-container">
                                    {isOwnProfile ? (
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
                                            {streamer.links.map((link) => (
                                                <div>{link.type}</div>
                                            ))}
                                        </div>
                                    </div>

                                    {isOwnProfile ? (
                                        <div className="edit-button-container"><div className="edit-button" onClick={toggleDescriptionModal}>edit</div></div>
                                    ) : (<></>)
                                    }
                                    <div className="description">
                                        <div className="description-title">Description</div>
                                        <Markup className="description-content" content={streamer.description} />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <select className="stream-category-filter" onChange={(e) => { setCategoryFilter(e.target.value) }}>
                                        <option value="all">All categories</option>
                                        {categories.map((category) => (
                                            categoryFilter === category._id ? (
                                                <option value={category._id} selected>{category.name}</option>
                                            ) : (
                                                <option value={category._id}>{category.name}</option>
                                            )
                                        ))}
                                    </select>
                                    <section className="profile-streams-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: 10 }}>
                                        {streams.filter(stream => stream.category._id === categoryFilter || categoryFilter === "all").map((stream) => (
                                            <StreamItemMinimal key={stream._id} stream={stream} />
                                        ))}
                                    </section>
                                </>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
}

export default Profile