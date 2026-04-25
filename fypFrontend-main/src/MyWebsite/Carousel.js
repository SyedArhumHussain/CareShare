import React from 'react'

const Carousel = () => {
    let imgStyle = {
        height: "500px",
        width: "100%",
      };
  return (
    <>
        <h1 className='text-center my-5'>Donations</h1>
    <div>
    {/* <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner" style={imgStyle}>
          <div className="carousel-item active">
            <img src="./medine/medicine12.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="./medine/medicine14.jpg" className="d-block w-100" alt="..." />
          </div>
          <div className="carousel-item">
            <img src="./medine/do7.jpg" className="d-block w-100" alt="..." />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleControls" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div> */}

<div id="myCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={0} className="" aria-label="Slide 1" />
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={1} aria-label="Slide 2" className="" />
          <button type="button" data-bs-target="#myCarousel" data-bs-slide-to={2} aria-label="Slide 3" className="active" aria-current="true" />
        </div>
        <div className="carousel-inner">
          <div className="carousel-item" >
           <img src="./medine/medicine6.jpeg" alt="" style={imgStyle}/>
            <div className="container">
              <div className="carousel-caption text-start">
              <h1 style={{textAlign:'center'}}>Welcome to CareShare</h1>
             
              </div>
            </div>
          </div>
          <div className="carousel-item" >
           <img src="./medine/medicine10.jpg" alt="" style={imgStyle} />
            <div className="container">
              <div className="carousel-caption">
              <h1 style={{textAlign:'center'}}>Online Unused Medicine Donation Portal</h1>
             
              </div>
            </div>
          </div>
          <div className="carousel-item active" >
           <img src="./medine/medicine9.jpg" alt="" style={imgStyle}/>
            <div className="container">
              <div className="carousel-caption text-end">
              <h1 style={{textAlign:'center'}}>Share Medicines - Share Happiness</h1>
            
              </div>
            </div>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>


    </div>
    </>
  )
}

export default Carousel
