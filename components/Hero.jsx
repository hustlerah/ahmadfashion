import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

function Hero() {
  return (
   <>
   <div className="Hero">
    <div className="container">
        <div className="row d-flex ">
            <div className="col-lg-5 col-md-7">
                <h4 className='mt-1'>Winter Collection</h4>
                <h1 className='mt-3'>Fall Winter Collection 2023</h1>
                <p className='mt-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Mollitia rem debitis dolore excepturi sunt a est eaque quam?</p>
                <button className='mbtn mt-4'>Shop Now <span ><FontAwesomeIcon className='ps' icon={faArrowRight} size='lg'/></span></button>
            </div>
        </div>
    </div>

   </div>
   <section class="banner spad">
        <div class="container">
            <div class="row">
                <div class="col-lg-7 offset-lg-4">
                    <div class="banner__item">
                        <div class="banner__item__pic">
                            <img src="/img/banner/banner-1.jpg" alt="Hero Img" className='img-fluid'/>
                        </div>
                        <div class="banner__item__text">
                            <h2>Clothing Collections 2030</h2>
                            <a href="#">Shop now</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-5">
                    <div class="banner__item banner__item--middle">
                        <div class="banner__item__pic ">
                            <img src="/img/banner/banner-2.jpg" alt="Hero Img" className='img-fluid' />
                        </div>
                        <div class="banner__item__text">
                            <h2>Accessories</h2>
                            <a href="#">Shop now</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7">
                    <div class="banner__item banner__item--last">
                        <div class="banner__item__pic">
                            <img src="/img/banner/banner-3.jpg" alt="Hero Img" className='img-fluid'/>
                        </div>
                        <div class="banner__item__text">
                            <h2>Shoes Spring 2030</h2>
                            <a href="#">Shop now</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
   </>
  )
}

export default Hero