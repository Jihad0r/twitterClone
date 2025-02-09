import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import { Routes,Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from "./components/common/Sidebar";
import RightPanel from "./components/common/RightPanel";
import ProfilePage from "./pages/profile/ProfilePage";
import NotificationPage from "./pages/notification/NotificationPage";
import { Toaster } from "react-hot-toast";
import {useQuery} from '@tanstack/react-query'
import LoadingSpinner from "./components/common/LoadingSpinner";
import { Chats } from "./pages/chats/Chats";
import { UserChats } from "./pages/chats/userChats";
import { Messages } from "./pages/chats/Messages";
import { PhoneChat } from "./pages/phone/phoneChat";
import { PhoneAdd } from "./pages/phone/PhoneAdd";
import Post from "./pages/home/Post";
function App() {
	const {data:authUser,isLoading,isError,error} = useQuery({
		queryKey:["authUser"],
		queryFn:async()=>{
			try{
				const res = await fetch("/api/auth/myaccount")
				const data = await res.json()
				if(data.error) return null
				if(!res.ok)  throw new Error(data.error || "something went wrong")
				return data
			}catch(error){
				console.error(error)
				throw error
			}
		}
	})
	if(isLoading){
		return(
			<div className="h-screen flex justify-center items-center">
				<LoadingSpinner size="lg"/>
			</div>
		)
	}
	
	return (
		<div className='flex max-w-6xl mx-auto'>
			{authUser&&<Sidebar/>}
			<Routes>
				<Route path='/' element={authUser?<HomePage/>:<Navigate to={"/login"}/>} />
				<Route path='/signup' element={!authUser?<SignUpPage />:<Navigate to={"/"}/>}/>
				<Route path='/login' element={!authUser?<LoginPage />:<Navigate to={"/"}/>} />
				<Route path='/notifications' element={authUser?<NotificationPage />:<Navigate to={"/login"}/>} />
				<Route path='/profile/:username' element={authUser?<ProfilePage />:<Navigate to={"/login"}/>} />
				<Route path='/chats'  element={authUser?<Chats authUser={authUser}  />:<Navigate to={"/login"}/>} />
				<Route path='/chats/:id'  element={authUser?<Messages authUser={authUser}  />:<Navigate to={"/login"}/>} />
				<Route path='/post/:id'  element={authUser?<Post authUser={authUser}  />:<Navigate to={"/login"}/>} />
				<Route path='/message'  element={authUser?<PhoneChat />:<Navigate to={"/login"}/>} />
				<Route path='/add'  element={authUser?<PhoneAdd />:<Navigate to={"/login"}/>} />
			</Routes>
			{authUser &&<div className='flex flex-col'><UserChats /> <RightPanel/></div>}
			<Toaster/>
		</div>
	);
}

export default App