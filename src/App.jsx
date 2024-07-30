import './App.css';
import { useEffect } from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import { useDispatch,useSelector } from 'react-redux';
import { getMembers, getMyProfile } from './Redux/MemberSlice';
import Home from './Pages/Home';
import Account from './Pages/Account';
import Login from './Pages/Auth/Login';
import Register from './Pages/Auth/Register';
import Profile from './Pages/Profile';
import { getMatchesWithMemberId } from './Redux/MatchSlice';
import Matches from './Pages/Matches';
import Search from './Pages/Search';
import LikeScreen from './Pages/LikeScreen';
import PrivateRoutes from './utils/PrivateRoute';
import { Validator } from './Redux/AuthSlice';
import { getLikesByMemberId } from './Redux/LikeSlice';


function App() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getMembers())
    dispatch(getMyProfile())
    dispatch(getMatchesWithMemberId());
    dispatch(getLikesByMemberId())
    if(localStorage.getItem('user')){
      const localdata = JSON.parse(localStorage.getItem('user'));
      dispatch(Validator(localdata.token))
    }
    },[dispatch])
  const token = JSON.parse(localStorage.getItem('token'));
console.log(token);
  return (
    <Router>
      <div className="App overflow-x-hidden text-offmode">
        <Routes>
          <Route path='/Login' element={<Login/>}/>
          <Route path='/Register' element={<Register/>}/>
          <Route element={<PrivateRoutes/>}>
            <Route path='/' element={<Home/>}/>
            <Route path='/Profile/:userid' element={<Profile/>}/>
            <Route path='/Account' element={<Account/>}/>
            <Route path='/Matches' element={<Matches/>}/>
            <Route path='/Search' element={<Search/>}/>
            <Route path='/Like' element={<LikeScreen/>}/>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
