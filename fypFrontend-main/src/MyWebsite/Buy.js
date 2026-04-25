import React from 'react'

export default function Buy() {
  return (
    <div>
       <div className="container">
        <main>
          <div className="py-2 text-center">
            <img className="d-block mx-auto mb-2" src="./images/TV1.png" alt="" width={220} height={220} />
            {/* <h2>Checkout form</h2> */}
            <p className="lead">Below is an example form built entirely with Bootstrap’s form controls. Each required form group has a validation state that can be triggered by attempting to submit the form without completing it.</p>
          </div>
          <div className="row g-5">
            <div className="col-md-5 col-lg-4 order-md-last">
              <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-primary">Your cart</span>
                <span className="badge bg-primary rounded-pill">3</span>
              </h4>
              <ul className="list-group mb-3">
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Product name</h6>
                    <small className="text-muted">Brief description</small>
                  </div>
                  <span className="text-muted">$12</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Second product</h6>
                    <small className="text-muted">Brief description</small>
                  </div>
                  <span className="text-muted">$8</span>
                </li>
                <li className="list-group-item d-flex justify-content-between lh-sm">
                  <div>
                    <h6 className="my-0">Third item</h6>
                    <small className="text-muted">Brief description</small>
                  </div>
                  <span className="text-muted">$5</span>
                </li>
                <li className="list-group-item d-flex justify-content-between bg-light">
                  <div className="text-success">
                    <h6 className="my-0">Promo code</h6>
                    <small>EXAMPLECODE</small>
                  </div>
                  <span className="text-success">−$5</span>
                </li>
                <li className="list-group-item d-flex justify-content-between">
                  <span>Total (USD)</span>
                  <strong>$20</strong>
                </li>
              </ul>
              <form className="card p-2">
                <div className="input-group">
                  <input type="text" className="form-control" placeholder="Promo code" />
                  <button type="submit" className="btn btn-secondary">Redeem</button>
                </div>
              </form>
            </div>
            <div className="col-md-7 col-lg-8">
              <h4 className="mb-3">Order Online <i class="bi bi-cart-dash-fill"></i></h4>
              <form className="needs-validation" noValidate>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="firstName" placeholder required />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" placeholder required />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div>
                  {/* <div className="col-12">
                    <label htmlFor="username" className="form-label">Username</label>
                    <div className="input-group has-validation">
                      <span className="input-group-text">@</span>
                      <input type="text" className="form-control" id="username" placeholder="Username" required />
                      <div className="invalid-feedback">
                        Your username is required.
                      </div>
                    </div>
                  </div> */}
                  <div className="col-12">
                    <label htmlFor="email" className="form-label">Email <span className="text-muted">(Optional)</span></label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" />
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                    <div className="invalid-feedback">
                      Please enter your shipping address.
                    </div>
                  </div>
                  {/* <div className="col-12">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="address2" placeholder="Karachi, Lahore etc" />
                  </div> */}
                  <div className="col-md-12">
                    <label htmlFor="province" className="form-label">Province</label>
                    <select className="form-select" id="province" required>
                      <option value>Choose...</option>
                      <option>Punjab</option>
                      <option>Sindh</option>
                      <option>Khyber Pakhtunkhwa</option>
                      <option>Balochistan</option>
                      <option>Islamabad Capital Territory</option>
                      <option>Gilgit-Baltistan</option>
                      <option>Azad Jammu and Kashmir</option>
                    </select>
                    <div className="invalid-feedback">
                      Please select a valid province.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" placeholder="Karachi, Lahore etc." />
                    <div className="invalid-feedback">
                      Please provide a valid city.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="postalcode" className="form-label">Postal Code</label>
                    <input type="text" className="form-control" id="postalcode" placeholder required />
                    <div className="invalid-feedback">
                    Postal code required.
                    </div>
                  </div>
                  <div className="col-12">
                    <label htmlFor="deviceName" className="form-label">Tech Devices Brand and Model <span className="text-muted">(You would like to purchase)</span></label>
                    <input type="text" className="form-control" id="deviceName" placeholder="Name of mobile, laptop & tablet etc." required />
                    <div className="invalid-feedback">
                      Please enter your tech device name.
                    </div>
                  </div>
                </div>
               
                <h4 className="mb-3 mt-3">Select Your Payment Method</h4>
                <div className="my-3">
                  <div className="form-check">
                    <input id="credit" name="paymentMethod" type="radio" className="form-check-input" defaultChecked required />
                    <label className="form-check-label" htmlFor="credit"><i class="bi bi-credit-card"></i> Debit or Credit Card</label>
                  </div>
                  
                  <div className="form-check">
                    <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" required />
                    <label className="form-check-label" htmlFor="paypal"><i class="bi bi-paypal" style={{color: '#00457C'}}></i> PayPal</label>
                  </div>
                </div>
                <div className="row gy-3">
                  <div className="col-md-6">
                    <label htmlFor="cc-name" className="form-label">Name on Card</label>
                    <input type="text" className="form-control" id="cc-name" placeholder required />
                    <div className="invalid-feedback">
                      Name on card is required
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-number" className="form-label">Card Number</label>
                    <input type="text" className="form-control" id="cc-number" placeholder required />
                    <div className="invalid-feedback">
                      Credit card number is required
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                    <input type="text" className="form-control" id="cc-expiration" placeholder required />
                    <div className="invalid-feedback">
                      Expiration date required
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="cc-cvv" className="form-label">CVV</label>
                    <input type="text" className="form-control" id="cc-cvv" placeholder required />
                    <div className="invalid-feedback">
                      Security code required
                    </div>
                  </div>
                </div>
                <button className="w-100 btn btn-primary btn-lg mt-5" type="submit">Submit Order</button>
              </form>
            </div>
          </div>
        </main>
        <footer className="my-5 pt-5 text-muted text-center text-small">
          <p className="mb-1">© 2017–2021 Company Name</p>
          <ul className="list-inline">
            <li className="list-inline-item"><a href="#">Privacy</a></li>
            <li className="list-inline-item"><a href="#">Terms</a></li>
            <li className="list-inline-item"><a href="#">Support</a></li>
          </ul>
        </footer>
      </div>
    </div>
  )
}

