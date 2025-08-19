import './App.css'
import { Layout } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'react-hot-toast';

const { Content } = Layout;
function App() {
  return (
   <>
   <Router>
    <AppRoutes />
   </Router>
<Toaster position="top-center" reverseOrder={false} />

    </>
  )
}

export default App
