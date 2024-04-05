import { Routes, Route } from "react-router-dom";
import Home from './pages/home/home';
import Regle from './pages/regle/regle';
import Actions from "./pages/actions/actions";
import Jeu from "./pages/jeu/jeu";
import './index.css'

function MyRoute() {
    return (
        <div className="Route">
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/regle' element={<Regle />} />
                <Route path='/actions' element={<Actions />} />
                <Route path='/jeu' element={<Jeu />} />
            </Routes>
        </div>
    )
}

export default MyRoute