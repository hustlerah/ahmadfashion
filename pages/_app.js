// pages/_app.js
import { Provider } from 'react-redux';
import React, { useEffect } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
// import CustomCursor from '@/components/CustomCursor';
import { useRouter } from 'next/router';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import '../styles/globals.css'; // Import your global styles
import '@/styles/Preloader.css'
import '@/styles/Navbar.css'
import '@/styles/Hero.css'
import '@/styles/Product.css'
import '@/styles/Register.css'
import '@/styles/About.css'
import '@/styles/Contact.css'
import  '@/styles/Cart.css';
// import AOS from 'aos';
// import 'aos/dist/aos.css';
import NextNProgress from 'nextjs-progressbar';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import store from '@/redux/store';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '@/components/Footer';

// Tell Font Awesome to skip adding the CSS automatically 
// since it's already imported above
config.autoAddCss = false;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");

    // Initialize aos with your desired options
    // AOS.init({
    //   duration: 1000, 
    //   once: true,
    // });
  }, []);

  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate a delay, replace this with your actual data fetching or page loading logic
    const delay = setTimeout(() => {
      setLoading(false);
    }, 2000);

    // Clean up the timeout to avoid memory leaks
    return () => clearTimeout(delay);
  }, []);

  // Show the preloader for 2 seconds before navigating to the new route
  useEffect(() => {
    const handleRouteChange = () => {
      setLoading(true);

      // Simulate a delay before showing the preloader
      const delay = setTimeout(() => {
        setLoading(false);
      }, 2000);

      return () => clearTimeout(delay);
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router.events]);

  return (
    <Provider store={store}>
    <div>
      {loading ? (
        <>
        
        <Preloader />
        </>
      ) : (
        <>
          {/* Render your actual application content */}
          {/* <CustomCursor /> */}
          {/* <NextNProgress/> */}
          <Navbar />
          <Component {...pageProps} />
          <Footer/>
        </>
      )}
    </div>
      </Provider>
  );
}

export default MyApp;