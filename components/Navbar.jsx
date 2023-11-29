import { auth, db } from '@/backend/firebase';
import { faAngleDown, faBars, faCircleUser, faHeart, faShoppingCart, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

function Navbar() {
  const router = useRouter();
  const [userData, setUserData] = useState([]);
  const isActivert = (href) => {
    return router.pathname === href ? 'active' : '';
  };
  const userProfilePic = userData.length > 0 ? userData[0].profilePic : null;

  const [loggedIn, setLoggedIn] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the loggedIn state based on whether the user is logged in or not
      setLoggedIn(!!user);
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  const handlePress = () => {
    setIsActive(!isActive); // Toggle the active status on press
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      router.push('/'); // Redirect to the home page or any other page after sign out
    } catch (error) {
      console.error('Sign-out Error:', error.message);
    }
  };

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataForCurrentUser();
      if (data) {
        setUserData(data);
      } else {
        console.log('No user is signed in.');
      }
    }

    fetchData();
  }, []);

  async function fetchDataForCurrentUser() {
    const user = auth.currentUser;

    if (user) {
      const userUID = user.uid;
      const q = query(collection(db, 'users'), where('uid', '==', userUID));
      const querySnap = await getDocs(q);

      const data = [];
      querySnap.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      return data;
    } else {
      return null;
    }
  }
  return (
    <>
      <div className={`myheader ${isActive ? 'active' : ''}`}>
        <div className="container">
          <div className="nava ">
            <div className="navbar-brand">
              <Link href={'/'}>
                <h1>
                  {' '}
                  <img src="/img/logo.png" alt="Male Fashion" className="img-fluid" />
                </h1>
              </Link>
            </div>
            <div className="menu-overlay" onClick={handlePress}></div>
            <div className="mynav">
              <div className="container d-flex align-items-center-justify-content-center mt-4 mx-2">
                <img src="/img/logo.png" alt="Male Fashion" className="img-fluid" />
              </div>
              <ul>
                <li className={`nav-item mt-4 mx-3 ${isActivert('/')}`}>
                  <Link href={'/'}>
                    Home
                  </Link>
                </li>
                <li className={`nav-item mt-4 mx-3 ${isActivert('/shop')}`}>
                  <Link href={'/shop'}>
                    Shop
                  </Link>
                </li>
                <li className={`nav-item mt-4 mx-3 ${isActivert('/about')}`}>
                  <Link href={'/about'}>
                    About
                  </Link>
                </li>
                <li className={`nav-item mt-4 mx-3 ${isActivert('/contact')}`}>
                  <Link href={'/contact'}>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-icons d-flex">
              <div className="icon-box mt-3 mx-3 d-none" onClick={handlePress}>
                <FontAwesomeIcon icon={faBars} size="lg" color="#111111" />
              </div>


              {loggedIn ? (
                <div className="dropdown mt-2">
                  {userProfilePic ? (
                  
                      <img
                        className="profile-pic dropdown-toggle mt-1"
                        src={userProfilePic}
                        alt="Profile"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        width={'30px'}
                        height={'30px'}
                        style={{ borderRadius: '100px' }}
                      />
                  ) : (
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      id="userDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <FontAwesomeIcon icon={faCircleUser} size="lg" color="#111111" />
                    </button>
                  )}
                  <ul className="dropdown-menu" aria-labelledby="userDropdown">
                    <li>
                      <a className="dropdown-item" href="#" onClick={() => { router.push('/user/profile') }}>
                        Edit Profile
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={() => { /* Handle my orders */ }}>
                        My Orders
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#" onClick={handleSignOut}>
                        Sign Out
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="icon-box mt-3 mx-3" onClick={() => { router.push('/user/register') }}>
                  <FontAwesomeIcon icon={faUser} size="lg" color="#111111" />
                </div>
              )}
              <div className="icon-box mt-3 mx-3" onClick={() => { router.push('/shop/cart') }}>
                <FontAwesomeIcon icon={faShoppingCart} size="lg" color="#111111" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
