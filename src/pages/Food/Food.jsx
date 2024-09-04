import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Modal from '../../components/Modal/Modal'

function Food (){

    const navigate = useNavigate()

    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>
            <div className="grow pt-5">
                <Modal />
            </div>
        </div>    
    )
}

export default Food