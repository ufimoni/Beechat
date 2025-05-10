import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/signup';
import Home from './pages/home';
import Welcome from './pages/welcome';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';


function App() {

  const { loader } = useSelector(state => state.loaderReducer);
  return (
    <div className="App">
      <Toaster position="top-center" reverseOrder={false}/>
      {loader && <Loader/>}
       <BrowserRouter>
       <Routes>
        <Route path='/home' element={ <ProtectedRoute>

          <Home/>
        </ProtectedRoute>  
      }> </Route>
        <Route path='/login' element={<Login/>}> </Route>
        <Route path='/signup' element={<Signup/>}> </Route>
        <Route path="/" element={<Welcome/>}></Route>
       </Routes>
       </BrowserRouter>
    </div>
  );
}

export default App;
