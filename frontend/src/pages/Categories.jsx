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

function Categories() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const { categories, isErrorCategories, isSuccessCategories, isLoadingCategories, messageCategories } = useSelector((state) => state.categories)

    useEffect(() => {
        if (isErrorCategories) {
            console.log(messageCategories)
            navigate('/')
        }

        dispatch(getCategories())

        return () => {
            dispatch(reset())
            dispatch(resetCategories())
        }
    }, [user, navigate, dispatch, isErrorCategories, messageCategories])

    if (isLoadingCategories) {
        return <Spinner />
    }

    return (
        <>
            <section className="categories" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: 30 }}>
                {categories.map((category) => (
                    <CategoryItem category={category} onPress={() => {navigate("/streams/" + category._id)}}/>
                ))}
            </section>
        </>
    )
}

export default Categories