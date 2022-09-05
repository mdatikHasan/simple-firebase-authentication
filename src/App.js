import './App.css';
import { createUserWithEmailAndPassword, getAuth, GithubAuthProvider, GoogleAuthProvider, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import app from './firebase.init';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';


const auth = getAuth(app)
function App() {
  const [user, setUser] = useState({});
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validated, setValidated] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');


  const googleProvider = new GoogleAuthProvider();
  const githubProvider = new GithubAuthProvider();



  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        setUser(user)
        console.log(user);
      })
      .catch(error => {

        console.error(error);
      })
  }

  const handleGithubSignIn = () => {
    signInWithPopup(auth, githubProvider)
      .then(result => {
        const user = result.user;
        setUser(user)
        console.log(user);
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser({})
      })
      .catch(error => {
        setUser({})
      })
  }

  const handleNameBlur = event => {
    setName(event.target.value)
  }

  const handleEmailBlur = event => {
    setEmail(event.target.value);
  }
  const handlePasswordBlur = event => {
    setPassword(event.target.value)
  }

  const handleFormSubmit = event => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }

    if (!/(?=.*[0-9].*[0-9])/.test(password)) {
      setError('Password should contain at least two number')
      return;
    }

    setError('')

    setValidated(true);

    if (registered) {
      signInWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setUser(user);
          console.log(user);

        })
        .catch(error => {
          setError(error.message)
        })
      setError('')
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(result => {
          const user = result.user;
          setUser(user)
          verifyEmail();
          setUserName();
        })
        .catch(error => {
          setError(error.message)
        })
      setError('')
    }

  };

  const setUserName = () => {
    updateProfile(auth.currentUser, {
      displayName: name
    })
    .then(()=>{
      console.log('Updating Name');
    })
    .catch((error)=>{
      setError(error.message)
    })
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log('reset Password');
      })
      .catch(error => {
        setError(error.message)
      })
  }
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log('email verification send');
      })
  }

  const handleRegisteredChange = event => {
    setRegistered(event.target.checked)
  }


  return (
    <div>

      <br />
      <br />
      <div className='w-25 mx-auto '>

        {user?.uid ? <button onClick={handleSignOut}>Sign Out</button>
          :
          <>
            <div className='registration'>
              <h1 className='text-primary'>Please {registered ? <span>Login</span> : <span>Register</span>}</h1>
              <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                {registered ? <></>
                  :
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control onBlur={handleNameBlur} type="text" placeholder="Enter Name" required />
                    <Form.Control.Feedback type="invalid">
                      Please provide your name.
                    </Form.Control.Feedback>
                  </Form.Group>}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control onBlur={handleEmailBlur} type="email" placeholder="Enter email" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid email.
                  </Form.Control.Feedback>
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control onBlur={handlePasswordBlur} type="password" placeholder="Password" required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid password.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicCheckbox">
                  <Form.Check onChange={handleRegisteredChange} type="checkbox" label={registered ? 'Already Login? please registered' : 'Already registered? Please login'} />
                  <Button onClick={handlePasswordReset} variant="link">Forget Password?</Button>
                </Form.Group>
                <p className='text-danger'>{error}</p>
                <Button variant="primary" type="submit">
                  {registered ? <span>Login</span> : <span>Register</span>}
                </Button>
              </Form>
            </div>
            <button onClick={handleGoogleSignIn}>Google Sign In</button>
            <button onClick={handleGithubSignIn}>Github Sign In</button>
          </>}



        {user?.uid ? <h2>User Name: {user.displayName}</h2> : <> </>}

        {user?.uid ? <p>User Email: {user.email}</p> : <> </>}
        <img src={user.photoURL} alt="" />
      </div>
    </div>
  );
}

export default App;
