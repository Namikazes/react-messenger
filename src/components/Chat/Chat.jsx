import { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import { arrayUnion, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';

const Chat = () => {

    const [open, setOpen] = useState(false)
    const [chat, setChat] = useState()
    const [text, setText] = useState("")
    const endRef = useRef(null)
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();
    const { currentUser } = useUserStore();
    const [ img, setImg] = useState({
        file: null, 
        url: ''
    });

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub();
        }
    }, [chatId])

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth"})
    },[])

    const handelEmoji = e => {
        setText((prev) => prev + e.emoji)
        setOpen(false)
    }

    const handelSend = async () => {
        if(text === "") return;

        let imgUrl = null
        
        try {

            if(img.file) {
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && {img:imgUrl})
                })
            })

            const userIDs = [currentUser.id, user.id]

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id)
                const userChatsSnapshot = await getDoc(userChatsRef)

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data()

                    const chatIndex = userChatsData.chats.findIndex(c => c.chatId === chatId)

                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updatedAt = Date.now()

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    })
                }
            })
            
        }catch(err) {
            console.log(err)
        }
        setImg({
            file:null,
            url:""
        })

        setText("")
    }

    const handelImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    return (
        <div className="chat">
            <div className='top'>
                <div className='user'>
                    <img src={user?.avatar || './avatar.png'} alt="avatar" />
                    <div className='texts'>
                        <span>{user?.username}</span>
                        <p>I want 25000 opf!</p>
                    </div>
                </div>
                <div className='icons'>
                    <img src="./phone.png" alt="phone" />
                    <img src="./video.png" alt="video" />
                    <img src="./info.png" alt="info" />
                </div>
            </div>
            <div className='center'>
              { chat?.messages?.map((message) => (
               <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message?.createdAt}>
                    <div className='texts'>
                        {message.img && <img src={message.img} alt='img' />}
                        <p>{message.text}</p>
                        {/* <span>1 min ago</span> */}
                    </div>
                </div>))}
              {img.url &&  <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt='' />
                    </div>
                </div>}

                <div ref={endRef}></div>
            </div>
            <div className='bottom'>
                <div className='icons'>
                <label htmlFor='file'>
                <img src="./img.png" alt="icons" />
                </label>
                    <input type='file' id='file' style={{display:"none"}} onChange={handelImg}/>
                    <img src="./camera.png" alt="icons" />
                    <img src="./mic.png" alt="icons" />
                </div>
                <input type='text' placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message" : "Type a message"} value={text} onChange={(e) => setText(e.target.value)} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
                <div className='emoji'>
                    <img src="./emoji.png" alt="emoji" onClick={() => setOpen((prev) => !prev)} />
                    <div className='picker'>
                    <EmojiPicker open={open} onEmojiClick={handelEmoji} />
                    </div>
                </div>
                <button className='sendButton' onClick={handelSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    )
}

export default Chat