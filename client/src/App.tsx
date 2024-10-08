import { Route, Routes } from 'react-router-dom';

import { UserProvider } from './components/UserContext';

import './App.css';

import { Header } from './components/Header.tsx';
import { Home } from './pages/Home.tsx';
import { Register } from './pages/Register.tsx';
import { SignIn } from './pages/SignIn.tsx';
import { CalendarDetails } from './pages/CalendarDetails.tsx';
import { NotFound } from './pages/NotFound.tsx';
import { CalendarForm } from './pages/CalendarForm.tsx';
import { ShareInvites } from './pages/ShareInvites.tsx';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/calendar/:calendarId" element={<CalendarDetails />} />
          <Route path="/calendar/form/:calendarId" element={<CalendarForm />} />
          <Route path="/invites" element={<ShareInvites />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
