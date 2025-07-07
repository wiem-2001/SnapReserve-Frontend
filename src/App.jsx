import './App.css'
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

const { Content } = Layout;
function App() {
  return (
   <>
   <Router>
    <AppRoutes />
   </Router>
    </>
  )
}

export default App
