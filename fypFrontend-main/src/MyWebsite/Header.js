import React from "react";
import PropTypes from 'prop-types'
import { Link } from "react-router-dom";


export default function Header(props) {
  let imgStyle = {
    height: "600px",
    width: "100%",
  };
  let TextSize = {
    fontSize: '20px'
  }
  let Text = {
    fontSize: '25px'
  }
  let BacContent = {
    backgroundImage: 'url(./medine/header2.png)',
	  backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: '600px', 
    width: '100%',
    paddingTop: '200px',
	  paddingBottom:' 100px',
	  textAlign: 'center',
    color: 'white',
    paddingRight: '50px',
    paddingLeft: '50px',
  }
  return (
    <div>

   <div className="content" style={BacContent}>
      {/* <img src="./medine/medicine10.jpg" class="img-fluid" alt="..." style={{height: '600px', width: '100%'}}/> */}
      <h1>Donate Your Unused Medicines And Change Lives</h1>
      {/* <p>Sharing health, spreading hope</p> */}
      <p style={{fontSize: '1.5rem'}}>Bridge the gap, save a life</p>
      {/* <p>From your cabinet to someone's cure</p> */}
      </div>

     
    </div>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  about: PropTypes.string.isRequired
}

Header.defaultProps = {
  title: 'Set Your Title Here',
  about: 'About'
}