import Saitbar from "./components/Saitbar/Saitbar"
import Chat from "./components/Chat/Chat"
import Detail from "./components/Detail/Detail"
import Login from "./components/Login/Login"
import { useEffect } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore"

const App = () => {

  const {currentUser, isLoadind, fetchUserInfo} = useUserStore();

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
          <Chat />
          <Detail />
        </>
      ) : (<Login />)}

    </div>
  )
}

export default App