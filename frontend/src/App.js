// import logo from './logo.svg';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routers  from './router/router';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routers />
      </BrowserRouter>
    </>
  );
}

export default App;
