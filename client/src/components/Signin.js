import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { showErrorMsg } from '../helpers/message';
import { showLoading } from '../helpers/loading';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import { signin } from '../api/auth';

const Signin = () => {
    const[formData, setFormData] = useState({
        email: 'johndoe@admin.com',
        password: '123456',
        errorMsg: false,
        loading: false,
        redirectToDashboard: false
    });

    const {
        email, 
        password, 
        errorMsg, 
        loading,
        redirectToDashboard
    } = formData;

    /************************
     * EVENT HANDLERS
     ************************/
    const handleChange = (evt) => {
        // console.log(evt);
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value,
            errorMsg: '',
            loading: ''
        });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // client-side validation
        if (isEmpty(email) || isEmpty(password)) {
            setFormData({
                ...formData, errorMsg: 'All fields are Required'
            });
        } else if (!isEmail(email)) {
            setFormData({
                ...formData, errorMsg: 'Invalid Email'
            });
        } else {
            const  {email, password } = formData;
            const data = { email, password };

            setFormData({...formData, loading: true});

            signin(data)
        }
    };

    /************************
     * VIEWS
     ************************/

    const showSigninForm = () => (
        <form className='signup-form' onSubmit={handleSubmit} noValidate>
            
            {/* Email */}
            <div className='form-group input-group mb-3'>
                <span className='input-group-text'>
                    <i className='fa fa-envelope'></i>
                </span>
                <input
                    name='email'
                    value={email}
                    className='form-control'
                    placeholder='Email address'
                    type='email'
                    onChange={handleChange}
                />
            </div>

            {/* Password */}
            <div className='form-group input-group mb-3'>
                <span className='input-group-text'>
                    <i className='fa fa-lock'></i>
                </span>
                <input
                    name='password'
                    value={password}
                    className='form-control'
                    placeholder='Create Password'
                    type='password'
                    onChange={handleChange}
                />
            </div>

            {/* Signin Button */}
            <div className='form-group mb-3 d-grid gap-2'>
                <button type='submit' className='btn btn-primary btn-block'>
                    Log In
                </button>
            </div>

            {/* Haven't Account */}
            <p className='text-center'>
                Don't have an Account? <Link to='/signup'>Register here</Link>
            </p>
        </form>
    );

    /************************
     * RENDERER
     ************************/

    return (
        <div className='signin-container'>
            <div className='row px-4 vh-100'>
                <div className='col-sm-10 col-md-7 col-lg-4 mx-auto align-self-center'>
                    <div className='card card-glass'>
                        <h5 className='card-header py-4'>Log in</h5>
                        <div className='card-body'>
                            {errorMsg && showErrorMsg(errorMsg)}
                            {loading && (
                                <div className='text-center pb-4'>{showLoading()}</div>
                            )}
                            {showSigninForm()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;