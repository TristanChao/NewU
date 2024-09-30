import { Route, Routes } from 'react-router-dom';

import { UserProvider } from './components/UserContext';

import './App.css';

import { Header } from './components/Header.tsx';
import { Home } from './pages/Home.tsx';
import { Register } from './pages/Register.tsx';
import { SignIn } from './pages/SignIn.tsx';
import { Calendar } from './pages/Calendar.tsx';
import { NotFound } from './pages/NotFound.tsx';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/calendar/:calendarId" element={<Calendar />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
