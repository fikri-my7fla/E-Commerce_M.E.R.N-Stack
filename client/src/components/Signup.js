import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import isEmail from 'validator/lib/isEmail';
import isEmpty from 'validator/lib/isEmpty';
import equals from 'validator/lib/equals';
import { showErrorMsg, showSuccessMsg } from '../helpers/message';
import { showLoading } from '../helpers/loading';
import { isAuthenticated } from '../helpers/auth';
import { signup } from '../api/auth';

const Signup = () => {
    let history = useHistory();

    useEffect(() => {
        if (isAuthenticated() && isAuthenticated().role === 1) {
            history.push('/admin/dashboard');
        } else if (isAuthenticated() && isAuthenticated().role === 0) {
            history.push('/user/dashboard');
        }
    }, [history]);

    const[formData, setFormData] = useState({
        username: 'John Doe',
        email: 'johndoe@admin.com',
        password: '123456',
        password2: '123456',
        successMsg: false,
        errorMsg: false,
        loading: false,
    });

    const {
        username, 
        email, 
        password, 
        password2, 
        successMsg, 
        errorMsg, 
        loading
    } = formData;

    /************************
     * EVENT HANDLERS
     ************************/
    const handleChange = (evt) => {
        // console.log(evt);
        setFormData({
            ...formData,
            [evt.target.name]: evt.target.value,
            successMsg: '',
            errorMsg: '',
            loading: ''
        });
    }

    const handleSubmit = (evt) => {
        evt.preventDefault();

        // client-side validation
        if (isEmpty(username) || isEmpty(email) || isEmpty(password) || isEmpty(password2)) {
            setFormData({
                ...formData, errorMsg: 'All fields are Required'
            });
        } else if (!isEmail(email)) {
            setFormData({
                ...formData, errorMsg: 'Invalid Email'
            });
        } else if (!equals(password, password2)) {
            setFormData({
                ...formData, errorMsg: 'Password do not match'
            });
        } else {
            const { username, email, password } = formData;
            const data = { username, email, password };

            setFormData({...formData, loading: true});

            signup(data)
                .then((response) => {
                    console.log('Axios signup success: ', response);
                    setFormData({
                        username: '',
                        email: '',
                        password: '',
                        password2: '',
                        loading: false,
                        successMsg: response.data.successMessage
                    });
                })
                .catch((err) => {
                    console.log('Axios signup error: ', err);
                    setFormData({...formData, loading: false, errorMsg: err.response.data.errorMessage});
                });
        }
    };

    /************************
     * VIEWS
     ************************/

    const showSignupForm = () => (
        <form className='signup-form' onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className='form-group input-group mb-3'>
                <span className='input-group-text'>
                    <i className='fa fa-user'></i>
                </span>
                <input
                    name='username'
                    value={username}
                    className='form-control'
                    placeholder='Username'
                    type='text'
                    onChange={handleChange}
                />
            </div>

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

            {/* Password 2 */}
            <div className='form-group input-group mb-3'>
                    <span className='input-group-text'>
                        <i className='fa fa-lock'></i>
                    </span>
                <input
                    name='password2'
                    value={password2}
                    className='form-control'
                    placeholder='Confirm Password'
                    type='password'
                    onChange={handleChange}
                />
            </div>

            {/* Signup Button */}
            <div className='form-group mb-3 d-grid gap-2'>
                <button type='submit' className='btn btn-primary btn-block'>
                    Create Account
                </button>
            </div>

            {/* Already Have Account */}
            <p className='text-center text-white'>
                Have an Account? <Link to='/signin'>Log In</Link>
            </p>
        </form>
    );

    /************************
     * RENDERER
     ************************/

    return (
        <div className='signup-container'>
            <div className='row px-4 vh-100'>
                <div className='col-sm-10 col-md-7 col-lg-4 mx-auto align-self-center'>
                    <div className='card card-glass'>
                        <h5 className='card-header text-white py-4'>Create New Account</h5>
                        <div className='card-body'>
                            {successMsg && showSuccessMsg(successMsg)}
                            {errorMsg && showErrorMsg(errorMsg)}
                            {loading && (
                                <div className='text-center pb-4'>{showLoading()}</div>
                            )}
                            {showSignupForm()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;