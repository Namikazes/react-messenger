import { useState, useEffect, useRef } from 'react';
import './chatlist.css';
import AddUser from './addUser/AddUser';
import { useUserStore } from '../../../lib/userStore'
import { doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
    const [addUser, setUser] = useState(false);
    const [chats, setChats] = useState([]);
    const popupRef = useRef(null);
    const [input, setInput] = useState("")

    const { currentUser } = useUserStore();
    const { changeChat } = useChatStore();

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data().chats;

            const promises = items.map( async (item) => {
                const userDocRef = doc(db, "users", item.receiverId)
                const userDocSnap = await getDoc(userDocRef)

                const user = userDocSnap.data();
                return {...item, user}
            })
            const chatsData = await Promise.all(promises);
            setChats(chatsData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }
    }, [currentUser.id])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setUser(false);
            }
        };

        if (addUser) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [addUser]);

    const handelSelect = async (chat) => {
        const userChats = chats.map((item) => {
            const { user, ...rest } = item
            return rest
        })

        const chatIndex = userChats.findIndex(item => item.chatId === chat.chatId)

        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db, "userchats", currentUser.id)
        try{
            await updateDoc(userChatsRef, {
                chats: userChats,
            })

        }catch(err) {
            console.log(err)
        } 
        changeChat(chat.chatId, chat.user)
    }

    const filterChats = chats.filter(c => c.user.username.toLowerCase().includes(input.toLowerCase()))

    return (
        <div className="chatlist">
            <div className='search'>
                <div className='searchBar'>
                    <img src='./search.png' alt='search' />
                    <input type='text' placeholder='Search' onChange={(e) => setInput(e.target.value)}/>
                </div>
                <img src={addUser ? './minus.png' : './plus.png'} alt='add' onClick={() => setUser((prev) => !prev)} />
            </div>
            {filterChats.map(chat => (
                <div key={chat.chatId} className='item' onClick={() => handelSelect(chat)} style={{
                    backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                }}>
                    <img src={chat.user.blocked?.includes(currentUser.id) ? "./avatar.png" : chat.user.avatar || "./avatar.png" } alt='avatar' />
                    <div className='texts'>
                        <span>{chat.user.blocked?.includes(currentUser.id) ? "User" : chat.user.username}</span>
                        <p>{chat.lastMessage}</p>
                    </div>
                </div>
            ))}
            {addUser && (
                <div className="popup" ref={popupRef}>
                    <AddUser />
                </div>
            )}
        </div>
    );
}

export default ChatList;
