import React, {useState, useEffect} from 'react'
import firebase from 'firebase'
import db from '../../firebase'
import backdrop from '../../assets/backdrop2.png'
import './Login.css'
import Spinner from '../../elements/Spinner/Spinner'
import validate from '../../helpers/inputValidator'
import {actionTypes} from '../../contexts/StateReducers'
import {useStateValue} from '../../contexts/StateContextProvider'
import {useHistory} from 'react-router'


import bcrypt from 'bcryptjs';

import CheckCircleIcon from '@material-ui/icons/Check'
import Loader from '../../elements/Loader/Loader'
import '../MultiStepLogin/MultiStepLogin.css'


import counties from '../../helpers/counties.json';
import fieldsOfExpertiseData from '../../helpers/fieldsOfExpertise.json';
import axios from 'axios';
const Login = () => {
    const [auth, setAuth] = useState(false)         // a state to change auth mode
    const [isLogin, setIsLogin] = useState(false)         // a state to change auth mode
    const initialSignup = {
        name            : '',
        username        : '',
        email           : '',
        password        : '',
        confirmPassword : ''
    }
    const initialLogin = {
        email           : '',
        password        : ''
    }
    const [{user},dispatch] = useStateValue()
    const [signupState, setSignupState] = useState(initialSignup)
    const [loginState, setLoginState] = useState(initialLogin)
    const [error, setError] = useState('')
    const [isSigning, setIsSigning] = useState(false)


    const steps = ['Basic', 'Contact', 'Address', 'Disipline', 'Church', 'Account'];
    const [formErrors, setFormErrors] = useState({});
    const [currentStep, setCurrentStep] = useState(1);
    const [fieldsOfExpertise, setFieldsOfExpertise] = useState([]);
    const [loading, setLoading] = useState(false)
    const [signupMessage, setSignupMessage] = useState("")         
    const [signupStatus, setSignupStatus] = useState("")         
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      county: '',
      academicLevel: '',
      fieldExpertise: '',
      course: '',
      highSchoolName: '',
      churchName: '',
      username: '',
      password: '',
      confirmPassword: '',
    });


    const cleanupState = () => {
        setIsSigning(false)
        setSignupState(initialSignup)
        setLoginState(initialLogin)
        setError('')
        setLoading(false)
    }

    const toggleAuth = () => {
        setAuth(auth=>!auth)
        cleanupState()
        // console.log(!auth?'changed to signupPage':'changed to loginPage')
    }

    const history = useHistory()
    const redirectTo = () => {
      setLoading(true)
      history.push(`/`)
    };
  

    
    const auths = (user) => {
        try {
            user.password = undefined
            localStorage.setItem('twittie_user', JSON.stringify(user))
            
            dispatch({
                type: actionTypes.SET_USER,
                user : JSON.parse(localStorage.getItem('twittie_user'))
            })
            
            setLoading(false)          
        } catch (error) {
            console.log(error)
            setLoading(false)
            return
        }
    }

    const onSubmitLogin = (e) => {  
        const {email, password} = loginState
        e.preventDefault()
        setLoading(true)
        db.collection('users')
            .where('email', '==', email)
            .where('password','==', password)
            .limit(1)
            .get()
            .then(snapshot=>{
                if(!snapshot.docs.length){
                    setError('Invalid credential')
                return
                } else {
                    return {id: snapshot.docs[0].id, ...snapshot.docs[0].data()}
                }
            })
            .then(res=>{
                if(res){
                    auths(res)
                } else {
                    setError('An error occured, please try again')
                    setLoading(false)
                }
            })
            .catch(error=>{
                setLoading(false)
                setError('An error occured, please try again')
                return
            }
        )

    }

    const preSignup = (e) => {
        e.preventDefault()
        setIsSigning(true)
        setError(validate(signupState))
    }

    // console.log(`currently in ${auth?'signupPage':'loginPage'} and ${isSigning?'isSigning':'not isSigning'}`)

    if(user){}


    
  useEffect(() => {
    if (formData.academicLevel) {
      setFieldsOfExpertise(fieldsOfExpertiseData[formData.academicLevel] || []);
    }
  }, [formData.academicLevel]);

    useEffect(() => {      
        const {name, username, email, password } = signupState

        // console.log(isSigning, error.length)
        if (isSigning && !error.length){
            setLoading(true)
            try {
                db.collection('users').add({
                    bio:'',
                    userType:'',
                    displayName: name,
                    email,
                    followers: [],
                    following: [],
                    joined: firebase.firestore.FieldValue.serverTimestamp(),
                    password,
                    photoURL: '',
                    rooms: [],
                    username,
                    verified: true,
                    wallpaper: ''
                })
                .then(res=>{
                    console.log(res)
                    toggleAuth()
                })                    
            } catch (error) {
                console.log(error)
                return
            }
        }

    }, [isSigning, error])
  


    
  const validateInputs = (step) => {
    let isValid = true;
    const errors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        isValid = false;
        errors.firstName = 'First Name is required';
      }

      if (!formData.lastName.trim()) {
        isValid = false;
        errors.lastName = 'Last Name is required';
      }
    }

    if (step === 2) {
      if (!formData.email.trim()) {
        isValid = false;
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        isValid = false;
        errors.email = 'Email address is invalid.Use format john@gmail.com';
      }

      if (!formData.phoneNumber.trim()) {
        isValid = false;
        errors.phoneNumber = 'Phone Number is required';
      } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
        isValid = false;
        errors.phoneNumber = 'Phone Number is invalid.Use format 0710617773';
      }
    }

    if (step === 3) {

      if (!formData.county.trim()) {
        isValid = false;
        errors.county = 'County is required';
      }
    }

    if (step === 4) {
      if (!formData.academicLevel.trim()) {
        isValid = false;
        errors.academicLevel = 'Academic Level is required';
      }

        if (formData.academicLevel === 'High school' && !formData.highSchoolName.trim()) {
          isValid = false;
          errors.highSchoolName = 'Highschool Name is required';
        }else{
            if (!formData.fieldExpertise.trim()) {
              isValid = false;
              errors.fieldExpertise = 'Field of Expertise is required';
            }

            if (!formData.course.trim()) {
              isValid = false;
              errors.course = 'Course is required';
            }
        }
    }

    if (step === 5) {

      if (!formData.churchName.trim()) {
        isValid = false;
        errors.churchName = 'Church name is required';
      }
    }
    if (step === 6) {
      if (!formData.username.trim()) {
        isValid = false;
        errors.username = 'Username is required';
      }

      if (!formData.password.trim()) {
        isValid = false;
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        isValid = false;
        errors.password = 'Password must be at least 8 characters long';
      }

       // Confirm Password Validation
       if (!formData.confirmPassword.trim()) {
        isValid = false;
        errors.confirmPassword = 'Confirm Password is required';
      } else if (formData.confirmPassword !== formData.password) {
        isValid = false;
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return isValid;
  };


  const handlePrev = (e) => {
    e.preventDefault();
    setCurrentStep((prevStep) => prevStep - 1);
  };


  const handleNext = (e) => {
    e.preventDefault();
    if (validateInputs(currentStep)) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  

  const postMemberToMySQL = async (memberData) => {
    
    try {
      console.log("memberData",memberData);

      const response = await axios.post('https://api.akurinuyouth.com/api/members', memberData , {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log(response);

    } catch (error) {
      console.error('There was an error!', error);
    }

  };
  



  const handleSubmit = async (e) => {
    try{
    e.preventDefault();
    setLoading(true)
    
    if (validateInputs(currentStep)) {
      alert('Your Form Successfully Signed up');
      try {

        db.collection('users').add({
            bio:'',
            userType:'',
            displayName: formData.username,
            email:formData.email,
            followers: [],
            following: [],
            joined: firebase.firestore.FieldValue.serverTimestamp(),
            password: formData.password ,
            photoURL: '',
            rooms: [],
            username: formData.username,
            verified: true,
            wallpaper: '',
            county: formData.county,
            academicLevel: formData.academicLevel,
            fieldExpertise: formData.fieldExpertise,
            course: formData.course,
            highSchoolName: formData.highSchoolName,
            churchName: formData.churchName,
        })
        .then(res=>{
            
            setCurrentStep(1);
            //clear form
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phoneNumber: '',
              county: '',
              academicLevel: '',
              fieldExpertise: '',
              course: '',
              highSchoolName: '',
              churchName: '',
              username: '',
              password: '',
              confirmPassword: '',
            });
        })  
         // Hash the password before saving or sending
         const hashedPassword = await bcrypt.hash(formData.password, 10);

        let memberData =  {
          "userName": formData.username,
          "firstName": formData.firstName,
          "lastName": formData.lastName,
          "email": formData.email,
          "password":hashedPassword,
          "phone": formData.phoneNumber,
          "county": formData.county,
          "academicLevel": formData.academicLevel,
          "fieldExpertise": formData.fieldExpertise,
          "course": formData.course,
          "churchName": formData.churchName,
          "userType": "user",
          "visibility_status": 1,
        }

        postMemberToMySQL(memberData);
        setSignupStatus("success");
        setSignupMessage("Signup successful!");
        // redirectTo()

    } catch (error) {

      setSignupStatus("error");
      setSignupMessage("Signup failed. Please try again.");
        console.log(error)
        return
    }finally{
      setLoading(false)
    }
    }

    }catch(error){
      console.log("submit error",error)
    }

  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

    return (
        <>

               {!isLogin &&
                <section className='multi-form-signup-section'>
                <div className={`multi-form-signup-container`}>
                <div className="user signinBc">
                    <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>

                    {/* <div className="multi-form-body">  */}
                    <div className="multi-form-container">

                            <img className="multi-form-logo" src="/akurinuyouth-logo.jpg" alt="modal-img" />
                            <header>SIGNUP </header>

                            {signupStatus && 
                                <div className={`multi-form-alert ${signupStatus === "error" ? 'error' : 'success'}`} >
                                <span className="multi-form-closebtn" onClick={() => setSignupStatus("")}>&times;</span>
                                {signupMessage}
                                </div>
                            }
                            
                            { loading && <div className="feed__loader"><Loader/></div> }

                            <div className="multi-form-progress-bar">
                            {steps.map((step, index) => (
                                <div
                                className={`multi-form-step ${currentStep > index + 1 ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
                                key={index}
                                >
                                <p>{step}</p>
                                <div className={`multi-form-bullet ${currentStep > index + 1 ? 'bullet-completed' : 'regular'} ${currentStep === index + 1 ? 'bullet-active' : ''}`} >
                                    <span>{currentStep > index + 1 ? <CheckCircleIcon style={{ color: '#FFFFFF' }} /> : index + 1}</span>
                                </div>
                                </div>
                            ))}
                            </div>

                            <div className="multi-form-form-outer">
                                <form>
                                
                                {currentStep === 1 && (
                                    <div className="multi-form-page multi-form-slide-page">
                                    <div className="multi-form-title">Basic Info:</div>

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">First Name</div>
                                        <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        className={formErrors.firstName ? 'multi-form-invalid-input' : ''}
                                        required
                                        />

                                    </div>
                                    {formErrors.firstName && <h3 className="multi-form-error">{formErrors.firstName}</h3>}


                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Last Name</div>
                                        <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        className={formErrors.lastName ? 'multi-form-invalid-input' : ''}
                                        required
                                        />
                                    </div>
                                    {formErrors.lastName && <h3 className="multi-form-error">{formErrors.lastName}</h3>}


                                    <div className="multi-form-field">
                                        <button className="multi-form-firstNext multi-form-next" onClick={handleNext}>Next</button>
                                    </div>
                                    {/* <p className="signup"> Already have an account? <span onClick={toggleAuth}>Log in</span></p> */}
                                    <p className="signup"> Already have an account? <span onClick={()=>setIsLogin(true)}>Log in</span></p>

                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="multi-form-page">
                                    <div className="multi-form-title">Contact Info:</div>
                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Email Address</div>
                                        <input type="email" className={formErrors.email ? 'multi-form-invalid-input' : ''} name="email" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    {formErrors.email && <h3 className="multi-form-error">{formErrors.email}</h3>}

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Phone Number</div>
                                        <input type="tel" name="phoneNumber" className={formErrors.phoneNumber ? 'multi-form-invalid-input' : ''} value={formData.phoneNumber} onChange={handleInputChange} required />
                                    </div>
                                    {formErrors.phoneNumber && <h3 className="multi-form-error">{formErrors.phoneNumber}</h3>}

                                    <div className="multi-form-field multi-form-btns">
                                        <button className="multi-form-prev-1 multi-form-prev" onClick={handlePrev}>Previous</button>
                                        <button className="multi-form-next-1 multi-form-next" onClick={handleNext}>Next</button>
                                    </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="multi-form-page">
                                    <div className="multi-form-title">Address</div>

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">County</div>
                                        <select name="county" className={formErrors.county ? 'multi-form-invalid-input' : ''} value={formData.county} onChange={handleInputChange} required>
                                        <option value="">Select County</option>
                                        {counties.map((county, index) => (
                                            <option key={index} value={county}>{county}</option>
                                        ))}
                                        </select>
                                    </div>
                                    {formErrors.county && <h3 className="multi-form-error">{formErrors.county}</h3>}


                                    <div className="multi-form-field multi-form-btns">
                                        <button className="multi-form-prev-2 multi-form-prev" onClick={handlePrev}>Previous</button>
                                        <button className="multi-form-next-2 multi-form-next" onClick={handleNext}>Next</button>
                                    </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="multi-form-page">
                                    <div className="multi-form-title">Discipline</div>

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Academic Level</div>
                                        <select
                                        name="academicLevel"
                                        className={formErrors.academicLevel ? 'multi-form-invalid-input' : ''}
                                        value={formData.academicLevel}
                                        onChange={handleInputChange}
                                        required
                                        >
                                        <option value="">Select Academic Level</option>
                                        <option value="Doctorate Degree">Doctorate Degree</option>
                                        <option value="Master's degree">Master's Degree</option>
                                        <option value="Bachelor's Degree">Bachelor's Degree</option>
                                        <option value="Diploma">Diploma</option>
                                        <option value="Certificate">Certificate</option>
                                        <option value="High school">High school</option>
                                        </select>
                                    </div>
                                    {formErrors.academicLevel && <h3 className="multi-form-error">{formErrors.academicLevel}</h3>}


                                    {formData.academicLevel !== 'High school' && (
                                        <div>
                                            <div className="multi-form-field">
                                            <div className="multi-form-label">Field of Expertise</div>
                                            <select
                                                name="fieldExpertise"
                                                className={formErrors.fieldExpertise ? 'multi-form-invalid-input' : ''}
                                                value={formData.fieldExpertise}
                                                onChange={handleInputChange}
                                                required={formData.academicLevel !== "High school"}
                                            >
                                                <option value="">Select Field of Expertise</option>
                                                {/* Populate options based on fieldsOfExpertise */}
                                                {fieldsOfExpertise.map((expertise, index) => (
                                                <option key={index} value={expertise}>
                                                    {expertise}
                                                </option>
                                                ))}
                                            </select>
                                            </div>
                                            {formErrors.fieldExpertise && <h3 className="multi-form-error">{formErrors.fieldExpertise}</h3>}
                                        </div>
                                    )}

                                    {formData.academicLevel !== 'High school' && (

                                        <div> 
                                        <div className="multi-form-field">
                                        <div className="multi-form-label">Course Pursued</div>
                                        <input
                                            type="text"
                                            name="course"
                                            className={formErrors.course ? 'multi-form-invalid-input' : ''}
                                            value={formData.course}
                                            onChange={handleInputChange}
                                            required={formData.academicLevel !== "High school"}
                                        />
                                        </div>
                                            {formErrors.course && <h3 className="multi-form-error">{formErrors.course}</h3>}

                                        </div>
                                        
                        
                                    )}


                                    {/* {formData.academicLevel == 'High school' && (
                                        <div className="multi-form-field">
                                        <div className="multi-form-label">Highschool Name</div>
                                        <input
                                            type="text"
                                            name="highSchoolName"
                                            className={formErrors.highSchoolName ? 'multi-form-invalid-input' : ''}
                                            value={formData.highSchoolName}
                                            onChange={handleInputChange}
                                            required={formData.academicLevel === "High school"}
                                        />
                                        </div>
                                        {formErrors.highSchoolName && <h3 className="multi-form-error">{formErrors.highSchoolName}</h3>}
                                        )} */}

                                        {formData.academicLevel === 'High school' && (
                                        <div>
                                            <div className="multi-form-field">
                                                <div className="multi-form-label">Highschool Name</div>
                                                <input
                                                type="text"
                                                name="highSchoolName"
                                                className={formErrors.highSchoolName ? 'multi-form-invalid-input' : ''}
                                                value={formData.highSchoolName}
                                                onChange={handleInputChange}
                                                // Conditionally required only if academicLevel is "High school"
                                                required={formData.academicLevel === "High school"}
                                                />
                                            </div>
                                            {formErrors.highSchoolName && <h3 className="multi-form-error">{formErrors.highSchoolName}</h3>}
                                        </div>
                                    )}

                                    <div className="multi-form-field multi-form-btns">
                                        <button className="multi-form-prev-3 multi-form-prev" onClick={handlePrev}>Previous</button>
                                        <button className="multi-form-next-3 multi-form-next" onClick={handleNext}>Next</button>
                                    </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="multi-form-page">
                                    <div className="multi-form-title">Church :</div>

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Church Name</div>
                                        <input
                                        type="text"
                                        name="churchName"
                                        value={formData.churchName}
                                        onChange={handleInputChange}
                                        className={formErrors.churchName ? 'multi-form-invalid-input' : ''}
                                        required
                                        />
                                    </div>

                                    {formErrors.churchName && <h3 className="multi-form-error">{formErrors.churchName}</h3>}
                                    <div className="multi-form-field multi-form-btns">
                                        <button className="multi-form-prev-4 multi-form-prev" onClick={handlePrev}>Previous</button>
                                        <button className="multi-form-next-4 multi-form-next" onClick={handleNext}>Next</button>
                                    </div>
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <div className="multi-form-page">
                                    <div className="multi-form-title">Login Details:</div>
                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Username</div>
                                        <input type="text" name="username" value={formData.username} onChange={handleInputChange} required />
                                    </div>
                                    {formErrors.username && <h3 className="multi-form-error">{formErrors.username}</h3>}

                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Password</div>
                                        <input type="password" name="password" value={formData.password} onChange={handleInputChange} required />
                                    </div>
                                    {formErrors.password && <h3 className="multi-form-error">{formErrors.password}</h3>}


                                    <div className="multi-form-field">
                                        <div className="multi-form-label">Confirm Password</div>
                                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                                    </div>
                                    {formErrors.confirmPassword && <h3 className="multi-form-error">{formErrors.confirmPassword}</h3>}

                                    
                                    <div className="multi-form-field multi-form-btns">
                                        <button className="multi-form-prev-5 multi-form-prev" onClick={handlePrev}>Previous</button>
                                        <button className="multi-form-submit" onClick={handleSubmit}>Submit</button>
                                    </div>
                                    </div>
                                )}

                                </form>
                            </div>
                    </div>
                    {/* </div> */}

                </div>
                </div>        
            </section>
               }
        {isLogin &&

            <section className='login__section'>
            <div className={`login__container ${auth ? 'active': ''}`}>
            <div className="user signinBc">
                <div className="imgBc"><img src={backdrop} alt='backdrop' /></div>
                <div className="formBc">

                    <form autoComplete="off" onSubmit={onSubmitLogin}>
                {/* <img className="multi-form-logo" src="/akurinuyouth-logo.jpg" alt="modal-img" /> */}
                        <h2>Log In</h2>
                        <input type="email"    name='email'    placeholder='Email'    value={loginState.email}    onChange={e=>setLoginState({...loginState, email:e.target.value})}/>
                        <input type="password" name='password' placeholder='Password' value={loginState.password} onChange={e=>setLoginState({...loginState, password:e.target.value})} required/>
                        <button type='submit' className='button'>{loading? <Spinner /> : 'Log in'}</button>
                        {error.length>0 && <div className='error'>{error}</div>}
                        <p className="signup">Don't have an account? <span onClick={()=>setIsLogin(false)}>Sign up</span></p>
                    </form>
                </div>
            </div>
            </div>        
            </section>
            }
        </>

    )
    
}


export default Login
