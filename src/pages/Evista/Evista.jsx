import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Card from '../../components/Card/Card';

function Evista (){

    const navigate = useNavigate()

    return (
        <div className = "flex">
            <aside>
                <Sidebar />
            </aside>
            <div className="grow pt-5 bg-black">
                
            </div>
        </div>
    )
}
export default Evista;
