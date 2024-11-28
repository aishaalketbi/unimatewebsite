import TinderCard from 'react-tinder-card'
import {useEffect, useState} from 'react'
import ChatContainer from '../components/ChatContainer'
import {useCookies} from 'react-cookie'
import axios from 'axios'

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [genderedUsers, setGenderedUsers] = useState(null)
    const [lastDirection, setLastDirection] = useState()
    const [viewMore, setViewMore] = useState(false); // State for "View More"
    const [cookies, setCookie, removeCookie] = useCookies(['user'])

    const userId = cookies.UserId

    const handleViewMore = () => {
        setViewMore(!viewMore); // Toggle View More
    };


    const getUser = async () => {
        try {
            const response = await axios.get('https://unimatewebsitefinal-ad8eb52132df.herokuapp.com/user', {
                params: {userId}
            })
            setUser(response.data)
        } catch (error) {
            console.log(error)
        }
    }
    const getGenderedUsers = async () => {
        try {
            const response = await axios.get('https://unimatewebsitefinal-ad8eb52132df.herokuapp.com/gendered-users', {
                params: {gender: user?.gender_interest}
            })
            setGenderedUsers(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getUser()

    }, [])

    useEffect(() => {
        if (user) {
            getGenderedUsers()
        }
    }, [user])

    const updateMatches = async (matchedUserId) => {
        try {
            await axios.put('https://unimatewebsitefinal-ad8eb52132df.herokuapp.com/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch (err) {
            console.log(err)
        }
    }

    console.log(user)


    const swiped = (direction, swipedUserId) => {
        if (direction === 'right') {
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name) => {
        console.log(name + ' left the screen!')
    }

    const matchedUserIds = user?.matches.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUsers?.filter(genderedUser => !matchedUserIds.includes(genderedUser.user_id))


    console.log('filteredGenderedUsers ', filteredGenderedUsers)
    return (
        <>
            {user &&
                <div className="dashboard">
                    <ChatContainer user={user}/>
                    <div className="swipe-container">
                        <div className="card-container">

                            {filteredGenderedUsers?.map((genderedUser) =>
                                <TinderCard
                                    className="swipe"
                                    key={genderedUser.user_id}
                                    onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                                    onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                                >
                                    <div
                                        style={{
                                            backgroundImage: 'url(' + genderedUser.url + ')',
                                        }}
                                        className={`card ${viewMore ? 'darkened' : ''}`} // Apply darkened class when "View More" is active
                                    >
                                        <div className="card-content">
                                            <h3>{genderedUser.first_name}</h3>

                                            {/* Hide this section when "View More" is clicked */}
                                            {!viewMore && (
                                                <div className="default-info">
                                                    <p><strong>Ethnicity:</strong> {genderedUser.ethnicity}</p>
                                                    <p><strong>Major:</strong> {genderedUser.major}</p>
                                                    <p><strong>About Me:</strong> {genderedUser.about_me}</p>
                                                </div>
                                            )}

                                            <button onClick={handleViewMore} className="view-more-button">
                                                {viewMore ? 'View Less' : 'View More'}
                                            </button>

                                            {/* View More Content - show this when "View More" is clicked */}
                                            {viewMore && (
                                                <div className="view-more-content">
                                                    <p><strong>Karaoke Song:</strong> {genderedUser.funPrompt1}</p>
                                                    <p><strong>Superpower:</strong> {genderedUser.funPrompt2}</p>
                                                    <p><strong>Spontaneous Thing:</strong> {genderedUser.funPrompt3}</p>
                                                    <p><strong>Guilty Pleasure Show:</strong> {genderedUser.funPrompt4}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TinderCard>
                            )}



                            )}
                            <div className="swipe-info">
                                {lastDirection ? <p>You swiped {lastDirection}</p> : <p/>}
                            </div>
                        </div>
                    </div>
                </div>}
        </>
    )
}
export default Dashboard
