import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    // 👇 ADD BASENAME HERE
    <BrowserRouter basename="/Giftzee/"> 
      <Routes>
        <Route path="/" element={<Home />} />
        {/* your other routes */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
