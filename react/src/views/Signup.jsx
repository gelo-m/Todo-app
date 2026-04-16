import axiosClient from "../axios-client";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();

    const {setUser, setToken} = useStateContext();
    const [errors, setErrors] = useState(null);


    const onSubmit = (event) => {
        event.preventDefault();

        const payload = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value,
        }

        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user);
                setToken(data.token);
            })
            .catch(error => {
                const response = error.response;

                if (response && response.status === 422) {
                    setErrors(response.data.errors);
                }
            })
        ;
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Signup for free</h1>
                    {
                        errors && <div className="alert">
                            {
                                Object.keys(errors).map(key => (
                                    <p key={key}>{errors[key][0]}</p>
                                ))
                            }
                        </div>
                    }
                    <input type="text" placeholder="Full Name" ref={nameRef}/>
                    <input type="email" placeholder="Email Address" ref={emailRef}/>
                    <input type="password" placeholder="Password" ref={passwordRef}/>
                    <input type="password" placeholder="Password Confirmation" ref={passwordConfirmationRef}/>
                    <button className="btn btn-block">Signup</button>
                    <p className="message">
                        Already Registered? <Link to="/login"> Sign in</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}