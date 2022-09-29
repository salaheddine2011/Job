import { useState, useEffect } from 'react'
import { Logo, FormRow, Alert } from '../components'
import Wrapper from '../assets/wrappers/RegisterPage'
import { useAppContext } from '../context/appContext'
import { useNavigate } from 'react-router-dom'


const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,

}

const Register = () => {
  const [values, setValue] = useState(initialState);
  const navigate = useNavigate()
  const { user, isLoading, showAlert, displayAlert, /*registerUser,loginUser*/setupUser } = useAppContext()
  //console.log(state)

  const toggleMember = () => {
    setValue({ ...values, isMember: !values.isMember })
  }

  const handleChange = (e) => {
    setValue({ ...values, [e.target.name]: e.target.value })
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { email, name, password, isMember } = values
    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return
    }
    const currentUser = { name, email, password }

    if (isMember) {
      setupUser({currentUser,
        endPoint:'login',
        alertText:'Login Successfull!! Redirecting...'})
      
    }
    else {
      setupUser({currentUser,
        endPoint:'register',
        alertText:'User Created! Redirecting...'})
    }
  }

  useEffect(() => {
  if(user){
    setTimeout(()=>{
      navigate('/')
    },3000)
  }
  }, [user, navigate])
  return (
    <Wrapper className='full-page'>
      <form className='form' onSubmit={onSubmit}>
        <Logo />
        {showAlert && <Alert />}
        <h3>{values.isMember ? "login" : "register"}</h3>
        {!values.isMember && <FormRow type="text" value={values.name} name='name' handleChange={handleChange} />}

        <FormRow type="email" value={values.email} name='email' handleChange={handleChange} />
        <FormRow type="password" value={values.password} name='password' handleChange={handleChange} />


        <button type='submit' className='btn btn-block' disabled={isLoading}>
          submit
        </button>
        <p>
          {values.isMember ? 'Not a member yet ?' : 'already a member? '}
          <button type='button' onClick={toggleMember} className='member-btn'>
            {values.isMember ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </Wrapper>
  )
}
export default Register;
