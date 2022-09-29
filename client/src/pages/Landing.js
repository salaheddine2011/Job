import React from 'react'
import { Link } from 'react-router-dom'
import main from '../assets/images/Compulog.svg'
import Wrapped from '../assets/wrappers/LandingPage'
import {Logo} from '../components'
const Landing = () => {
  return (
    <Wrapped>
        <nav>
            <Logo/>
        </nav>
        <div className='container page'>
         <div className='info'>
          <h1>
            join <span>Compulog</span> App
          </h1>
          <p>
          I'm baby sriracha deep v jianbing tote bag actually tbh,
           aesthetic art party fingerstache hot chicken fanny pack 
           tattooed disrupt.
            VHS truffaut thundercats hella, 
            edison bulb paleo roof party brunch wayfarers
          </p>
          <Link to='/register' className='btn btn-hero'>
            Login/Register
          </Link>
          
         </div>
         <img src={main} alt="Job hunt" className='img main-img'/>
        </div>
    </Wrapped>
  )
}


export default Landing