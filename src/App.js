// import Home from './pages/Home';
// import Dashboard from './pages/Dashboard';
// import OnBoarding from './pages/OnBoarding';
// import { BrowserRouter, Routes, Route} from 'react-router-dom'
// import {useCookies} from "react-cookie";
//
// const App = () => {
//     const [ cookies, setCookies, removeCookie] = useCookies(['user']);
//
//     const authToken = cookies.AuthToken
//
//     return (
//         <BrowserRouter basename="/unimatewebsite">
//             <Routes>
//                 <Route path="/" element={<Home />} />
//                 {authToken && <Route path="/dashboard" element={<Dashboard />} />}
//                 {authToken && <Route path="/onboarding" element={<OnBoarding />} />}
//             </Routes>
//         </BrowserRouter>
//     )
// }
//
// export default App

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import OnBoarding from './pages/OnBoarding';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useCookies } from 'react-cookie';

const App = () => {
    const [cookies, setCookies, removeCookie] = useCookies(['user']);

    const authToken = cookies.AuthToken;

    return (
        <BrowserRouter basename="/unimatewebsite">
            <Routes>
                {/* Default Route */}
                <Route path="/" element={<Home />} />

                {/* Authenticated Routes */}
                {authToken && <Route path="/dashboard" element={<Dashboard />} />}
                {authToken && <Route path="/onboarding" element={<OnBoarding />} />}

                {/* Optional: Catch-all route for undefined paths */}
                <Route path="*" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
