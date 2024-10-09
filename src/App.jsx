import Saitbar from "./components/Saitbar/Saitbar"
import Chat from "./components/Chat/Chat"
import Detail from "./components/Detail/Detail"
import Login from "./components/Login/Login"

const App = () => {

  const user = false

  return (
    <div className='container'>
      {user ? (
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