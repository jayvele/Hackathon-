import '../styles/globals.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { UserProvider } from '../components/userContext';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <UserProvider>
        <Component {...pageProps} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
        />
      </UserProvider>
    </>
  );
}

export default MyApp;
