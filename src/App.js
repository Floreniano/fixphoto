// css
import './css/index.css';

// router
import { BrowserRouter as Router } from 'react-router-dom';
import { useRoutes } from './routes';

function App() {
  const routes = useRoutes(localStorage.getItem('token'));
  return <Router>{routes}</Router>;
}

export default App;
