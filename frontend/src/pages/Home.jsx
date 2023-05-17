import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getStreams, reset } from '../features/streams/streamSlice'
import { getStreamers, reset as resetStreamers } from '../features/streamers/streamerSlice'
import { getCategories, reset as resetCategories } from '../features/categories/categorySlice'
import StreamItem from '../components/StreamItem'
import StreamerItem from '../components/StreamerItem'
import CategoryItem from '../components/CategoryItem'
import Spinner from '../components/Spinner'
import {FaChevronRight} from 'react-icons/fa'
import '../home-streamers.css'

function Home() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { streams, isErrorStreams, isSuccessStreams, isLoadingStreams, messageStreams } = useSelector((state) => state.streams)
    const { streamers, isErrorStreamers, isSuccessStreamers, isLoadingStreamers, messageStreamers } = useSelector((state) => state.streamers)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)
    const [streamsNumber, setStreamsNumber] = useState(8)
    const [categoriesNumber, setCategoriesNumber] = useState(8)
    const [streamersNumber, setStreamersNumber] = useState(8)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 600) {
                setStreamsNumber(window.innerWidth/240)
                setCategoriesNumber(window.innerWidth/240)
                setStreamersNumber(window.innerWidth/240)
            } else {
                setStreamsNumber(10)
                setCategoriesNumber(10)
                setStreamersNumber(10)
            }
            
        }
        window.addEventListener('resize', handleResize)
        window.addEventListener('load', handleResize)

        if (isErrorStreams) {
            console.log(messageStreams)
            navigate('/')
        }

        if (isErrorStreamers) {
            console.log(messageStreamers)
            navigate('/')
        }

        if (isErrorCategories) {
            console.log(messageCategories)
            navigate('/')
        }

        dispatch(getStreams())
        dispatch(getStreamers())
        dispatch(getCategories())

        return () => {
            dispatch(reset())
            dispatch(resetStreamers())
            dispatch(resetCategories())
        }
    }, [user, navigate, isErrorStreams, messageStreams, isErrorStreamers, messageStreamers, dispatch, isErrorCategories, messageCategories])

    if (isLoadingStreams || isLoadingStreamers || isLoadingCategories) {
        return <Spinner />
    }

    return (
        <>
            <div className="home-section-title-container">
                <div className="home-section-title">Recommended streams</div>
                <Link to="/streams" className="home-section-subtitle">View more <FaChevronRight size={14}/></Link>
            </div>
            <section className="streams">
                {streams.filter(stream => stream.status === 'ended' || stream.status === 'started').slice(0, (streamsNumber)).map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}
            </section>

            <div className="home-section-title-container">
                <div className="home-section-title">Popular categories</div>
                <Link to="/categories" className="home-section-subtitle">View more <FaChevronRight size={14}/></Link>
            </div>
            <section className="categories">
                {categories.slice(0, (categoriesNumber)).map((category) => (
                    <CategoryItem category={category} onPress={() => {navigate("/streams/" + category._id)}}/>
                ))}
            </section>

            <div className="home-section-title-container">
                <div className="home-section-title">Popular streamers</div>
                <Link to="/streamers" className="home-section-subtitle">View more <FaChevronRight size={14}/></Link>
            </div>
            <section className="streamers">
                {streamers.slice(0, (streamersNumber)).map((streamer) => (
                    <StreamerItem key={streamer._id} streamer={streamer} />
                ))}
            </section>

            <div className="home-section-title-container">
                <div className="home-section-title">Past streams</div>
                <Link to="/streams" className="home-section-subtitle">View more <FaChevronRight size={14}/></Link>
            </div>
            <section className="streams">
                {streams.filter(stream => stream.status === 'ended').slice(0, (streamsNumber)).map((stream) => (
                    <StreamItem key={stream._id} stream={stream} />
                ))}
            </section>

        </>
    )
}

export default Home