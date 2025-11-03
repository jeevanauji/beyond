import React, { useState } from 'react';

const Login = () => {
    // Track whether the form is in "login" or "signup" mode
    const [isSignup, setIsSignup] = useState(false);

    const toggleMode = () => {
        setIsSignup(prevState => !prevState);  // Toggle between login/signup
    };

    return (
        <>
            <section className="text-center">
                <div className="p-5 bg-image" style={{ backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px' }}></div>

                <div className="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary" style={{ marginTop: '-100px', backdropFilter: 'blur(30px)' }}>
                    <div className="card-body py-5 px-md-5">
                        <div className="row d-flex justify-content-center">
                            <div className="col-lg-8">
                                <h2 className="fw-bold mb-5">{isSignup ? 'Sign up now' : 'Log in'}</h2>
                                <form>
                                    {isSignup && (
                                        <div className="row">
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <input type="text" id="form3Example1" className="form-control" />
                                                    <label className="form-label" htmlFor="form3Example1">First name</label>
                                                </div>
                                            </div>
                                            <div className="col-md-6 mb-4">
                                                <div className="form-outline">
                                                    <input type="text" id="form3Example2" className="form-control" />
                                                    <label className="form-label" htmlFor="form3Example2">Last name</label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="form-outline mb-4">
                                        <input type="email" id="form3Example3" className="form-control" />
                                        <label className="form-label" htmlFor="form3Example3">Email address</label>
                                    </div>

                                    <div className="form-outline mb-4">
                                        <input type="password" id="form3Example4" className="form-control" />
                                        <label className="form-label" htmlFor="form3Example4">Password</label>
                                    </div>

                                    

                                    <button type="submit" data-mdb-button-init data-mdb-ripple-init className="btn btn-primary btn-block mb-4">
                                        {isSignup ? 'Sign up' : 'Log in'}
                                    </button>

                                
                                </form>

                                <div className="text-center mt-4">
                                    <button className="btn btn-link" onClick={toggleMode}>
                                        {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Login;
