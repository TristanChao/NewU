import { Route, Routes } from 'react-router-dom';
import { Header } from './components/Header.tsx';
import { Home } from './pages/Home.tsx';
import './App.css';
import { UserProvider } from './components/UserContext';
import { SignIn } from './pages/SignIn.tsx';

export default function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route index element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}
