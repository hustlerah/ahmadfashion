import React, { useEffect, useState } from 'react';
import { db, auth, storage } from '@/backend/firebase';
import {
  collection,
  doc,
  getDocs,
  where,
  query,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

function Profile() {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newFullName, setNewFullName] = useState('');
  const [newCountry, setNewCountry] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter()
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // User is not logged in, redirect to login page
        router.push('/user/login');
      }
    });

    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  useEffect(() => {
    async function fetchData() {
      const data = await fetchDataForCurrentUser();
      if (data) {
        setUserData(data);
        setLoading(false);
      } else {
        console.log('No user is signed in.');
        setLoading(false);
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

  const handleFullNameChange = (e) => {
    setNewFullName(e.target.value);
  };

  const handleCountryChange = (e) => {
    setNewCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    setNewCity(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleUpdateProfile = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        setIsSaving(true);

        const userRef = doc(db, 'users', userData[0].id);
        const updateData = {
          fullName: newFullName || userData[0].fullName,
          country: newCountry || userData[0].country,
          city: newCity || userData[0].city,
        };

        // Update profile data
        await updateDoc(userRef, updateData);

        // Change the user's password
        if (newPassword) {
          await user.updatePassword(newPassword);
        }

        // Update profile picture
        if (newProfilePic) {
          const fileName = `${user.uid}_${newProfilePic.name}`;
          const storageRef = ref(storage, `profile_pics/${fileName}`);
          await uploadBytes(storageRef, newProfilePic);

          const downloadURL = await getDownloadURL(storageRef);
          await updateDoc(userRef, { profilePic: downloadURL });
        }

        console.log('Profile updated successfully');
        alert('Profile updated successfully');
        setNewFullName('');
        setNewCountry('');
        setNewCity('');
        setNewPassword('');
        setNewProfilePic(null);
        setIsSaving(false);

        // Reload the page
        window.location.reload();
      } catch (error) {
        console.error('Error updating profile', error);
        setIsSaving(false);
      }
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setNewProfilePic(file);
  };

  return (
    <>
      <div className="Profile">
        <div className="container">
          <h2 className='text-center' style={{ fontWeight: 'bold', fontSize: '42px' }}>Profile</h2>
          <div className="mycar p-5">
            {loading ? (
              <div className="d-flex align-items-center justify-content-center">
                
                <FontAwesomeIcon icon={faCircleNotch} spin size='3x' />
              </div>
            ) : (
              userData.map((user) => (
                <div key={user.id}>
                  <form>
                    <div className="userProfile text-center">
                      {newProfilePic ? (
                        <img
                          src={URL.createObjectURL(newProfilePic)}
                          alt="Profile"
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : user.profilePic ? (
                        <img
                          src={user.profilePic}
                          alt="Profile"
                          style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <FontAwesomeIcon icon={faCircleUser} size='3x' />
                      )}
                      <div className="inp-t">
                        <label htmlFor="profilePicInput" style={{ cursor: 'pointer', color: 'blue' }} className='mt-1 mb-2'>
                          Change Profile Pic
                        </label>
                        <div className="mx-2">
                          <input
                            type="file"
                            id="profilePicInput"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleProfilePicChange}
                          />
                          {/* <button className='btn btn-dark'
                            onClick={handleUpdateProfile}
                            style={{ cursor: 'pointer' }}
                            disabled={isSaving}
                          >
                            {isSaving ? 'Saving...' : 'Update Profile'}
                          </button> */}
                        </div>
                      </div>
                    </div>

                    <div className='inp-t'>
                      <label htmlFor="name" className='form-label'>Full Name</label>
                      <input
                        type="text"
                        className='form-control'
                        id="fullName"
                        value={newFullName || user.fullName}
                        onChange={handleFullNameChange}
                        required
                      />
                    </div>

                    <div className='inp-t mt-2'>
                      <label htmlFor="email" className='form-label'>Email</label>
                      <input
                        type="email"
                        className='form-control'
                        id="email"
                        value={user.email}
                        readOnly
                        disabled
                      />
                    </div>

                    <div className='inp-t mt-2'>
                      <label htmlFor="country" className='form-label'>Country</label>
                      <input
                        type="text"
                        className='form-control'
                        id="country"
                        value={newCountry || user.country}
                        onChange={handleCountryChange}
                        required
                      />
                    </div>

                    <div className='inp-t mt-2'>
                      <label htmlFor="city" className='form-label'>City</label>
                      <input
                        type="text"
                        className='form-control'
                        id="city"
                        value={newCity || user.city}
                        onChange={handleCityChange}
                        required
                      />
                    </div>

                    <div className="d-flex align-items-center justify-content-center">
                      <button className='btn btn-dark'
                        onClick={handleUpdateProfile}
                        style={{ cursor: 'pointer', marginTop: '8px' }}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Saving...' : 'Update Profile'}
                      </button>
                    </div>
                  </form>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
