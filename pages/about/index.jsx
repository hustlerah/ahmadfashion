import React from 'react'

function About() {
    const AboutData= [
        {
            title:'Who We Are ?',
            descrip:'Contextual advertising programs sometimes have strict policies that need to be adhered too. Let’s take Google as an example.'
        },
        {
            title:'What We Do ?',
            descrip:'In this digital generation where information can be easily obtained within seconds, business cards still have retained their importance.'
        },
        {
            title:'Why Choose Us',
            descrip:'A two or three storey house is the ideal way to maximise the piece of earth on which our home sits, but for older or infirm people'
        },
    ]
    const TeamData= [
        {
            img:'/img/about/team-1.jpg', 
            name:'John Smith',
            work:'Fashion Design'
        },
        {
            img:'/img/about/team-2.jpg', 
            name:'Warner Wise',
            work:'CEO'
        },
        {
            img:'/img/about/team-3.jpg', 
            name:'Sean Robbins',
            work:'Manger'
        },
        {
            img:'/img/about/team-4.jpg', 
            name:'Lucy Myers',
            work:'Delivery'
        },
    ]
  return (
    <>
    <div className="About">
        <div className="container">
            <h2 className="text-center" style={{fontWeight:"bold"}}>About Us</h2>
            <div className="about-img mt-5">
                <img src={'/img/about/about-us.jpg'} alt="About Us" className='img-fluid'/>
            </div>
            <div className="row">
                {
                    AboutData.map((item,index)=>(

                        <div className="col-md-4 mt-4" key={index}>
                            <h5>{item.title}</h5>
                            <p>{item.descrip}</p>
                        </div>
                    ))
                }
            </div>
        </div>
         <div className="ourteam mt-5">
            <div className="container">
                <h3 className="text-center mt-2" style={{color:'#e53637',fontWeight:'bold',fontSize:'32px'}}>Our Team</h3>
                <h6 className='text-center mt-3'>Meet Our Team</h6>
                <div className="row mt-5 mx-auto dfg">
                    {
                        TeamData.map((item,index)=>(
                            <div className="col-lg-3 col-md-6 col-sm-6 mx-auto dfg" key={index}>
                                <img src={item.img} alt={item.name} className='img-fluid'/>
                                <h6 className="mt-3" style={{fontWeight:'bold',fontSize:'23px' }}>{item.name}</h6>
                                <p>{item.work}</p>
                            </div>
                        ))
                    }
                </div>
            </div>
         </div>
    </div>
    </>
  )
}

export default About