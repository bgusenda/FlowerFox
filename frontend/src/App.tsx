import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { BookPage } from "./pages/book/BookPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout/>}>
          <Route path="/" element={<BookPage />}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App
