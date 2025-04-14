import React from 'react'
import NavBar from '../components/Navbar'
import FirstPic from '../components/HomePage/FirstPic'
import AfterImage from '../components/HomePage/AfterImage'
import Footer from '../components/Footer'
import ChatBot from '../components/ChatBot/ChatBot'

const Home = () => {
  return (
    <div>
      <NavBar />
      {/* This is home page */}
      <FirstPic />
      <AfterImage />
      <Footer />
      <ChatBot />
      {/* <Profile/> */}
      {/* <AboutMe /> */}
    </div>
  )
}
export default Home
