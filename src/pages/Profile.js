import React, { useEffect, useState } from 'react'
import { getAuth } from 'firebase/auth'

const Profile = () => {
    const [user, setUser] = useState(null)

    const auth = getAuth()

    useEffect(() => {
        setUser(auth.currentUser)
    }, [])

    return (
        <div>
            <h1>{user ? user.displayName : 'Not logged in'}</h1>
        </div>
    )
}

export default Profile
