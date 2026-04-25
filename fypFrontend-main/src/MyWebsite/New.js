import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";
const New = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    console.warn("name,email,message", name, email, message)
    let result = await fetch("http://localhost:4000/contact",{
        method: 'post',
        body: JSON.stringify({name, email, message}),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    // result = await result.json()
    console.warn(result)
    if(result){
      Swal.fire({
        title: "Successul",
        text: "Feedback Saved Successfully.",
        icon: "success",
        confirmButtonColor: "#0875b8",
      });
        navigate('/')
        // Swal.fire('Feedback Saved Successfully')
    }
    else{
      // alert('Invalid Credentials')
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Invalid Credentials",
        confirmButtonColor: "#0875b8",
          }    )
        // alert("Please enter correct details")
    }
}

  return (
    <>
    <Navbar/>
    <div>

    <div className="container col-xl-10 col-xxl-8 px-4 py-5">
    <h1 className='text-center'>Contact Us</h1>
        <div className="row align-items-center g-lg-5 py-5">
          <div className="col-lg-7 text-center text-lg-start">
            {/* <h1 className="display-4 fw-bold lh-1 mb-3">CareShare's Vision: Eliminating Waste, Empowering Lives</h1> */}
            <h1 className="display-6 fw-bold lh-1 mb-4">CareShare: Empowering Access to Unused Medicines</h1>
            <p className="col-lg-10 fs-5">CareShare is the visionary online platform dedicated to revolutionizing the way unused medicines are donated and redistributed. At CareShare, we believe that no medication should go to waste when there are individuals in need. Our mission is to bridge the gap between surplus medications and those who require them. Join us on this transformative journey and make a positive impact on healthcare accessibility and equity.</p>
          </div> {/* yaha upper paragraph fs-4 tha maine fs-5 kia */}
          <div className="col-md-10 mx-auto col-lg-5">
            <form className="p-4 p-md-5 border rounded-3 bg-light">
            {/* <h1 className="display-6 mb-3" style={{fontSize: '30px'}}>Write Your Message</h1> */}
            <h1 className="display-6 mb-3" style={{fontSize: '30px'}}>Get in Touch</h1>
            
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Name</label>
              <input type="text" className="form-control" id="name" placeholder="Steve Smith"
              onChange={(e) => setName(e.target.value)} value={name} />
            </div>
          
            <div className="mb-3">
              <label htmlFor="exampleDropdownFormEmail2" className="form-label">Email address</label>
              <input type="email" className="form-control" id="exampleDropdownFormEmail2" placeholder="email@example.com"
              onChange={(e) => setEmail(e.target.value)} value={email} />
            </div>

        
        
              {/* <div className="checkbox mb-3">
                <label>
                  <input type="checkbox" defaultValue="remember-me" /> Remember me
                </label>
              </div> */}
              <div className="mb-3">
          <label htmlFor="exampleFormControlTextarea1" className="form-label">Message</label>
          <textarea className="form-control" id="exampleFormControlTextarea1" rows={5} defaultValue={""} 
          onChange={(e) => setMessage(e.target.value)} value={message}/>
        </div>
              {/* <button className="w-100 btn btn-lg btn-primary" type="submit">Send</button> */}
              <button onClick={handleLogin} className="btn btn-primary" type="button">Submit</button>

              
              
              {/* <hr className="my-4" />
              <small className="text-muted">By clicking Sign up, you agree to the terms of use.</small> */}
            </form>
          </div>
        </div>
      </div>


    </div>
    <Footer/>
    </>
  )
}

export default New
