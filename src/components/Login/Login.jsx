import { useState } from 'react'
import './login.css'
import { toast } from 'react-toastify'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '../../lib/firebase'
import { doc, setDoc } from "firebase/firestore"; 


const Login = () => {

    const [avatar, setAvatar] = useState({
        file: null,
        url: ''
    })

    const [loading, setLoading] = useState(false);

    const handelAvatar = (e) => {
        if (e.target.files[0]) {
            setAvatar({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    const handelLogin = async (e) => {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.target);
        const { email, password } = Object.fromEntries(formData);
        try{
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handelRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formData = new FormData(e.target);
        const { username, email, password } = Object.fromEntries(formData);
    
        if (!username || !email || !password) {
            toast.error("All fields are required!");
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long!");
            setLoading(false);
            return;
        }
    
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
    
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                id: res.user.uid,
                blocked: []
            });
    
            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: []
            });
    
            toast.success("Account created!");
        } catch (err) {
            console.log(err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className='login'>
            <div className='item'>
                <h2>Welcom back</h2>
                <form onSubmit={handelLogin}>   
                    <input type='text' placeholder='Email' name='email'/>
                    <input type='password' placeholder='Password' name='password'/>
                    <button disabled={loading}>{loading ? "Loading" : "Sign In"}</button>
                </form>
            </div>
            <div className='line'></div>
            <div className='item'>
            <h2>Registration</h2>
                <form onSubmit={handelRegister}>
                    <label htmlFor='file'><img src={avatar.url || './avatar.png'} alt=''/>Upload an image</label>
                    <input type='file' id='file' style={{display:"none"}} onChange={handelAvatar}/>
                    <input type='text' placeholder='Username' name='username'/>
                    <input type='text' placeholder='Email' name='email'/>
                    <input type='password' placeholder='Password' name='password'/>
                    <button disabled={loading}>{loading ? "Loading" : "Sign Up"}</button>
                </form>
            </div>
        </div>
    )
}

export default Login