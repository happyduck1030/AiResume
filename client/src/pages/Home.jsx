import React from 'react'
import Banner from './components/home/banner'
import Hero from './components/home/hero'
import Features from './components/home/Features'
import Testimonial from './components/home/Testimonials'
import CallToAction from './components/home/CallToAction'
import Footer from './components/home/footer'
const Home = () => {
  return (
    <>  
      <Banner></Banner>
      <Hero></Hero>
      <Features></Features>
      <Testimonial></Testimonial>
      <CallToAction></CallToAction>
      <Footer></Footer>
    </>
    
  )
}

export default Home 