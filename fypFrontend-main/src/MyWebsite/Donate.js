import React from 'react'

const Donate = () => {
  return (
    <>
    <h1 className='text-center mb-5'>Donate or Collect</h1>

    <div className='container'>
      <div className="row">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Donate Your Medicine</h5>
              <p className="card-text">Take action and make a difference today. Go to Donation and contribute your unused medicine through our platform. Help us reduce waste, provide relief to those in need, and create a healthier, more equitable future for all. Your generosity has the power to transform lives and bring hope to those who rely on it. Join us in building a compassionate world through your valuable donation.</p>
              {/* <a href="#" className="btn btn-primary">Go to Donate</a> */}
              <a href="#" className="btn btn-lg btn-outline-success">Go to Donate</a>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Collect Your Medicine</h5>
              <p className="card-text">Retrieve the necessary medications hassle-free using our platform. We ensure access to donated medications for empowering your healthcare journey. Browse available medicines, request, and enjoy a streamlined collection process. We offer cost-free medicines to alleviate your financial burdens. Rest assured, our medications undergo meticulous verification for safety and effectiveness.</p>
              {/* <a href="#" className="btn btn-primary">Get your Medicine</a> */}
              <a href="#" className="btn btn-lg btn-outline-success">Get your Medicine</a>
            </div>
          </div>
        </div>
      </div>

      <div className='my-5'>
      <figure className="text-center">
        <blockquote className="blockquote">
          <p>We make a living by what we get, but we make a life by what we give.</p>
        </blockquote>
        <figcaption className="blockquote-footer">
          Famous line from <cite title="Source Title">Winston Churchill</cite>
        </figcaption>
      </figure>
      </div>
    
    </div>
    </>
  )
}

export default Donate
