import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DetailArtikel from "./pages/DetailArtikel";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/artikel/:slug" exact element={<DetailArtikel />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
