import React from 'react'

const Products = () => {
  let imgSize = {
    width: '100%',
    height: '250px'
  }
  let PageColor = {
    background: '#f7f7f7'
    // background: 'blue'
  }
  return (
    <>
      <div>
        <h1 className='text-center mt-5 mb-5' >Products</h1>
        <div className='pb-3' style={PageColor}>
          <div className="container mb-5 pt-5" >
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div className="col">
                <div className="card shadow-sm">
                  <img src="/images/iphone14plus2.jpg" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>iPhone 14 Pro & iPhone 14 Pro Max</h5>
                    <p className="card-text">Rs. 495,000</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>

                      </div>
                      {/* <small className="text-muted">9 mins</small> */}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="/images/iphone14plus4.jpg" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>iPhone 14 & iPhone 14 Plus</h5>
                    <p className="card-text">Rs. 448,000 </p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/samsung3.jpg" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Samsung Galaxy A23</h5>
                    <p className="card-text">Rs. 78,499</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/reno4.jpg" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Oppo Reno 6</h5>
                    <p className="card-text">Rs. 64,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/vivo1.png" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Vivo Y35</h5>
                    <p className="card-text">Rs. 81,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/redmi4.png" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Xiaomi Redmi Note 11 Pro</h5>
                    <p className="card-text">Rs. 59,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/laptop3.png" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Apple Macbook Pro 14 M1</h5>
                    <p className="card-text">Rs. 529,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/ipadair1.png" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Apple iPad Air 5</h5>
                    <p className="card-text">Rs. 167,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="card shadow-sm">
                  <img src="./images/tab1.png" alt="" style={imgSize} />
                  <hr />
                  <div className="card-body">
                    <h5>Samsung Galaxy Tab S8 Ultra</h5>
                    <p className="card-text">Rs. 258,999</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="btn-group">
                        <button type="button" className="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#buyModal">Buy Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div>

        {/* Buy Modal */}
        <div className="modal fade" id="buyModal" tabIndex={-1} aria-labelledby="buyModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="buyModalLabel">Order Online <i class="bi bi-cart-dash-fill"></i></h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
              <img className="d-block mx-auto" src="./images/TV1.png" alt="" width={120} height={120} />
                <form>
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">Full Name</label>
                    <input type="text" className="form-control" id="firstName" placeholder required />
                    <div className="invalid-feedback">
                      Valid first name is required.
                    </div>
                  </div>
                  {/* <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="lastName" placeholder required />
                    <div className="invalid-feedback">
                      Valid last name is required.
                    </div>
                  </div> */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email <span className="text-muted">(Optional)</span></label>
                    <input type="email" className="form-control" id="email" placeholder="you@example.com" />
                    <div className="invalid-feedback">
                      Please enter a valid email address for shipping updates.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input type="text" className="form-control" id="address" placeholder="1234 Main St" required />
                    <div className="invalid-feedback">
                      Please enter your shipping address.
                    </div>
                  </div>
                  <div className="mb-3">
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
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">City</label>
                    <input type="text" className="form-control" id="city" placeholder="Karachi, Lahore etc." />
                    <div className="invalid-feedback">
                      Please provide a valid city.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="postalcode" className="form-label">Postal Code</label>
                    <input type="text" className="form-control" id="postalcode" placeholder required />
                    <div className="invalid-feedback">
                      Postal code required.
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="deviceName" className="form-label">Tech Devices Brand and Model <span className="text-muted">(You would like to purchase)</span></label>
                    <input type="text" className="form-control" id="deviceName" placeholder="Name of mobile, laptop & tablet etc." required />
                    <div className="invalid-feedback">
                      Please enter your tech device name.
                    </div>
                  </div>
                  <div className="mb-3">
                    <h4 className="mb-3 mt-3">Select Your Payment Method</h4>
                    <div className="my-3">
                      <div className="form-check">
                        <input id="credit" name="paymentMethod" type="radio" className="form-check-input" defaultChecked required />
                        <label className="form-check-label" htmlFor="credit"><i class="bi bi-credit-card"></i> Debit or Credit Card</label>
                      </div>

                      <div className="form-check">
                        <input id="paypal" name="paymentMethod" type="radio" className="form-check-input" required />
                        <label className="form-check-label" htmlFor="paypal"><i class="bi bi-paypal" style={{ color: '#00457C' }}></i> PayPal</label>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cc-name" className="form-label">Name on Card</label>
                    <input type="text" className="form-control" id="cc-name" placeholde required />
                    <div className="invalid-feedback">
                      Name on card is required
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cc-number" className="form-label">Card Number</label>
                    <input type="text" className="form-control" id="cc-number" placeholder required />
                    <div className="invalid-feedback">
                      Credit card number is required
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cc-expiration" className="form-label">Expiration</label>
                    <input type="text" className="form-control" id="cc-expiration" placeholder required />
                    <div className="invalid-feedback">
                      Expiration date required
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cc-cvv" className="form-label">CVV</label>
                    <input type="text" className="form-control" id="cc-cvv" placeholder required />
                    <div className="invalid-feedback">
                      Security code required
                    </div>
                  </div>
          
                  {/* <button type="submit" className="btn btn-primary">Submit</button> */}
                  <button className="w-100 btn btn-success btn-lg " type="submit">Submit Order</button>
                </form>


              </div>



              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                {/* <button type="button" className="btn btn-primary">Save changes</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Products
