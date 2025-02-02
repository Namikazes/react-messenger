import { useState } from 'react'
import './userInfo.css'
import ProfileInfo from './profileInfo/ProfileInfo'
import { useUserStore } from '../../../lib/userStore'

const UserInfo = () => {

    const [profile, setProfile] = useState(false)

    const handleProfile = () => {
        setProfile(!profile)
    }

    const {currentUser} = useUserStore();

    return (
        <div className='userInfo'>
            <div className='user' onClick={handleProfile}>
                <img src='./avatar.png' alt='avatar'/>
                <h2>{currentUser.username}</h2>
            </div>
            <div className='icons'>
                <img src='./more.png'/>
                <img src='./video.png'/>
                <img src='./edit.png'/>
            </div>
            {profile && <ProfileInfo />}
        </div>
    )
}

export default UserInfo