import { arrayUnion, collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import './addUser.css'
import { db } from '../../../../lib/firebase';
import { useState } from 'react';
import { useUserStore } from '../../../../lib/userStore'

const AddUser = () => {
    const [user, setUser] = useState(null);
    const { currentUser } = useUserStore();

    const handelSearch = async (event) => {
        event.preventDefault()
        const formData = new FormData(event.target);
        const username = formData.get("username");

        try {
            const userRef = collection(db, "users");
            const q = query(userRef, where("username", "==", username));

            const querySnapChat = await getDocs(q);

            if(!querySnapChat.empty) {
                setUser(querySnapChat.docs[0].data())
            }

        } catch(err) {
            console.log(err)
        }
    }

    const handelAdd = async () => {
        const chatRef = collection(db, "chats")
        const userChatsRef = collection(db, "userchats")


        try{
            const newChatRef = doc(chatRef)

            await setDoc(newChatRef,{
                createdAt: serverTimestamp(),
                messages: [],
            });

            await updateDoc(doc(userChatsRef,user.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessages: "",
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                })
            })

            await updateDoc(doc(userChatsRef,currentUser.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessages: "",
                    receiverId: user.id,
                    updatedAt: Date.now(),
                })
            })

        } catch(err) {
            console.log(err)
        }
    }
    return (
        <div className='addUser'>
            <form onSubmit={handelSearch}>
                <input type="text"  placeholder='Username' name='username'/>
                <button>Search</button>
            </form>
            {user && <div className="user">
                <div className="detail">
                    <img src='./avatar.png' alt="" />
                    <span>{user.username}</span>
                </div>
                <button onClick={handelAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser