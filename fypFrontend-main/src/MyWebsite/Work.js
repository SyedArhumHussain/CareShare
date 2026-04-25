import React from 'react'

const Work = () => {
  return (
    <div>
      
      <div className="container px-4 py-5" id="custom-cards">
        <h2 className="pb-2 border-bottom">Our Work/Activities</h2>
        <div className="row row-cols-1 row-cols-lg-3 align-items-stretch g-4 py-5">
          <div className="col">
            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{backgroundImage: 'url(./medine/do8.jpg)'}}>
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">Sharing health, spreading hope</h2>
                {/*  */}
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{backgroundImage: 'url(./medine/donate5.jpg)'}}>
              <div className="d-flex flex-column h-100 p-5 pb-3 text-white text-shadow-1">
                <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">From your cabinet to someone's cure</h2>
               
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card card-cover h-100 overflow-hidden text-white bg-dark rounded-5 shadow-lg" style={{backgroundImage: 'url(./medine/donate6.jpeg)'}}>
              <div className="d-flex flex-column h-100 p-5 pb-3 text-shadow-1">
                <h2 className="pt-5 mt-5 mb-4 display-6 lh-1 fw-bold">Turning surplus into hope, Every pill counts</h2>
               
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Work
