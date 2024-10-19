import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './Components/Header/Header';
import Ingestion from './Components/Ingestion/Ingestion';
import Main from './Components/Main/Main';
import Reports from './Components/Reports/Reports';
import Sidebar from './Components/Sidebar/Sidebar';

function App() {

  

  return(
    <BrowserRouter>
    <div className='flex cursor-auto'>
      <Sidebar />
      <div className="flex flex-1 flex-col">
      <Header className=""/>
      <Routes>
      
      <Route path='/' element={<Ingestion />} />
      <Route path='/product_management' element={<Main heading="E Commerce Dashboard"/>}/>
      <Route path='/reports' element={<Reports />}/>
      </Routes>
      </div>
    </div>
    </BrowserRouter>
  )
}

export default App;
