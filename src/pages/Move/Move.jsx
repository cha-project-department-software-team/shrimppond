import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function Move (){

    const navigate = useNavigate()

    return (
        <>
            <div className ="flex">
                <Sidebar />
                <h1>
                    Move Page
                </h1>
            </div>
        </>
    )
}

export default Move