import {useState, useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {uploadProfilePicture} from '../features/auth/authSlice'
import {AiOutlineCloudUpload} from 'react-icons/ai'
import Spinner from '../components/Spinner'

function Account() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)
    const [file, setFile] = useState()

    const [formData, setFormData] = useState({
        name: '',
        email: '',
    })

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    useEffect(() => {
        if(!user) {
            navigate('/')
        }

        if(isError) {
            console.error(message)
        }

        if(isSuccess) {
            navigate('/account')
        }
    }, [user, isError, isLoading, isSuccess, message, navigate, dispatch])

    if (isLoading) {
        return <Spinner />
    }

    const submitProfilePicture = async e => {
        let uploadFile = e.target.files[0]
        let newFile = new File([uploadFile], user._id + '.png')
        let formData = new FormData();
        formData.append('image', newFile)
        dispatch(uploadProfilePicture(formData))
      }    

    return (
        <>
            <section className='form account-form'>
                <div className="profile-picture" style={{backgroundImage: `url('/profile-pictures/${user._id}.png'), url('/defaults/profile-image.png')`}}>
                    <div className="upload">
                        <input className="upload-input" name="file" id="file" filename={file} onChange={(e) => {submitProfilePicture(e)}} type="file" accept="image/*"></input>
                        <label className='upload-icon' htmlFor="file"><AiOutlineCloudUpload size={40}/></label>
                    </div>
                </div>
                <form>
                    <div className='input-1'>
                        <input type="text" className="input-1-field" id="name" name="name" value={user.name} onChange={onChange} required disabled/>
                        <label className="input-1-label">Username</label>
                    </div>
                    <div className='input-1'>
                        <input type="text" className="input-1-field" id="email" name="email" value={user.email} onChange={onChange} required disabled/>
                        <label className="input-1-label">Email</label>
                    </div>
                </form>
            </section>
        </>
    )
}

export default Account