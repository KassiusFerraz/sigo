import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NormaPage from './pages/norma_page';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ContratoConsultoriaPage from './pages/contrato_consultoria_page';
import ResponsiveDrawer from './components/drawer';

ReactDOM.render(
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<ResponsiveDrawer />}>
          <Route path="/" element={<NormaPage />}/>
          <Route path="/contratoConsultoria" element={<ContratoConsultoriaPage />}/>
          </Route>
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
  </LocalizationProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
