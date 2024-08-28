import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function Food (){

    const navigate = useNavigate()

    return (
        <>
            <div className ="flex">
                <Sidebar />
                <h1>
                    Food Page
                </h1>
            </div>
        </>
    )
}

export default Food