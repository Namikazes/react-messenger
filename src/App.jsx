import Saitbar from "./components/Saitbar/Saitbar"
import Chat from "./components/Chat/Chat"
import Detail from "./components/Detail/Detail"
import Login from "./components/Login/Login"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore"
import { useChatStore } from "./lib/chatStore"

const App = () => {

  const {currentUser, isLoadind, fetchUserInfo} = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid)
    });

    return () => {
      unSub();
    };
  }, [fetchUserInfo]);

  if (isLoadind) return <div className="loading">Loading...</div>
  return (
    <div className='container'>
      {currentUser ? (
        <>
          <Saitbar />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (<Login />)}

    </div>
  )
}

export default App