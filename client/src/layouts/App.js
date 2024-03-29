import React from 'react';
import { BrowserRouter, Routes ,Route } from 'react-router-dom';
import Join from '../pages/Join';
import Room from '../pages/Room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Join/>}/>
        <Route path="/room/:id" element={<Room/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default React.memo(App);
