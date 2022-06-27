import './App.css';
import Content from './components/Content';
import { BrowserRouter as Router, Routes, Route  } from 'react-router-dom'
import EmpLogin from './components/EmpLogin';
import EmpList from './components/EmpList';
import E404 from './components/E404';

function App() {
  return (
    <div>
        <section>
          <div className="color"></div>
          <div className="color"></div>
          <div className="color"></div>
          <div className="color"></div>
        </section>
        <Router>
          <Routes>
            <Route path="/" element={<EmpLogin />} />
            <Route path="/emplogin" element={<EmpLogin />} />
            <Route path="/emplist" element={<EmpList />} />
            <Route path="/content" element={<Content />} />
            <Route path="/*" element={<E404 />} />

          </Routes>        
        </Router>
    </div>
  );
}

export default App;
