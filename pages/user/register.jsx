import Link from 'next/link';
import React, {  useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { auth, db } from '@/backend/firebase';
import { useRouter } from 'next/navigation';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import * as Yup from 'yup'; // Import Yup for validation

const validationSchema = Yup.object({
  name: Yup.string().required('Full Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const MyForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
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

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      // Validation
      await validationSchema.validate({
        name,
        email,
        country,
        city,
        password,
      });

      // Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Add user data to Firestore
      const userCollection = collection(db, 'users');
      const userDocRef = await addDoc(userCollection, {
        uid: uid,
        displayName: name,
        email: email,
        country: country,
        city: city,
        // Add any other user-related data you want to store
      });

      console.log('User added to Firestore with ID:', userDocRef.id);

      // Handle successful registration
      console.log('Saved');
      router.push('/user/login');
    } catch (error) {
      console.error('Registration Error:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
                <img src="/img/register.png" alt="Register" className='img-fluid' width={'400px'} />
              </div>
            </div>
            <div className="col-md-6 p-4 mt-2">
            <h2 className="text-center mt-1 mb-2" style={{fontWeight:'bold'}}>Register</h2>

              <form>
                <div className="mb-2">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input type="text" className="form-control" id="fullName" placeholder='Your Name' value={name} onChange={handleNameChange}  required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" id="email" placeholder='Your Email' value={email} onChange={handleEmailChange}  required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="country" className="form-label">Country</label>
                  <input type="text" className="form-control" id="country" placeholder='Usa' value={country} onChange={handleCountryChange}  required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="city" className="form-label">City</label>
                  <input type="text" className="form-control" id="city" placeholder='New York' value={city} onChange={handleCityChange}  required/>
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="input-group">
                    <input required
                      type={showPassword ? 'text' : 'password'}
                      className="form-control"
                      id="password"
                      placeholder='Your Password'
                      value={password}
                      onChange={handlePasswordChange}
                    />
                    <div className="input-group-append">
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={togglePasswordVisibility}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="btw">
                  <button className='mbtn w-100 text-center' onClick={handleRegister}>Register</button>
                </div>
              </form>
                {/* <p className="text-center mt-3">--------or--------</p>
                <div className="btw1">
                  <button className='w-100 btn' onClick={handleGoogleSignIn}>Register With Google <img src="/img/google.png" alt="google" className='img-fluid' height={'40px'} width={'40px'} /></button>
                </div> */}
                <p className='text-center mt-4'>Already Have An Account? <Link href={'/user/login'}> Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MyForm;
