import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { BookPage } from "./pages/book/BookPage";
import { LandingPage } from "./pages/landing/LandingPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route element={<Layout/>}>
          <Route path="/books" element={<BookPage />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
