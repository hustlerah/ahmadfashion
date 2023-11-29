import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '@/backend/firebase';
import { useRouter } from 'next/navigation';
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import * as Yup from 'yup'; // Import Yup for validation

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const MyLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const googleProvider = new GoogleAuthProvider();

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Error signing in with Google');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Validation
      await validationSchema.validate({
        email,
        password,
      });

      // Firebase Authentication
      await signInWithEmailAndPassword(auth, email, password);

      // Handle successful login
      console.log('Login successful');

      // Redirect the user or update state as needed
      router.push('/');
    } catch (error) {
      console.error('Login Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // The code for Google Sign-In is similar to what you have in the registration page
    // Make sure to handle user authentication states and redirect the user accordingly
    try {
      const user = await signInWithGoogle();
      console.log('Logged in user:', user);

      // Check if the user is already registered
      const userCollection = collection(db, 'users');
      const userQuery = await getDocs(
        query(userCollection, where('uid', '==', user.uid))
      );
      const existingUser = userQuery.docs[0];

      if (!existingUser) {
        // If the user is not already registered, add their data to Firestore
        const userDocRef = await addDoc(userCollection, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          // Add any other user-related data you want to store
        });

        console.log('User added to Firestore with ID:', userDocRef.id);
      }

      // Handle successful login, e.g., redirect the user or update state
    } catch (error) {
      // Handle error, e.g., show an error message
      console.error('Error signing in with Google:', error.message);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is already logged in, redirect to home page
        router.push('/');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures the effect runs only once on mount


  return (
    <>
      <div className="Register">
        <div className="container p-2">
          <div className="row">
            <div className="col-md-6 col1">
              <div className="d-flex">
                <img
                  src="/img/login.png"
                  alt="Register"
                  className="img-fluid"
                  width={'400px'}
                />
              </div>
            </div>
            <div className="col-md-6 p-4 mt-2">
              <h2 className="text-center mt-1 mb-2" style={{fontWeight:'bold'}}>Login</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      placeholder="Your Password"
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                {loading && <p>Loading...</p>}
                <div className="btw">
                  <button
                    className="mbtn w-100 text-center"
                    onClick={handleLogin}
                  >
                    Login
                  </button>
                </div>
              </form>
              <p className="text-center mt-3">--------or--------</p>
              <div className="btw1">
                <button
                  className="w-100 btn"
                  onClick={handleGoogleSignIn}
                >
                  Login With Google{' '}
                  <img
                    src="/img/google.png"
                    alt="google"
                    className="img-fluid"
                    height={'40px'}
                    width={'40px'}
                  />
                </button>
              </div>
              <p className="text-center mt-4">
                Don't Have An Account?{' '}
                <Link href={'/user/register'}> Register</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyLoginForm;
