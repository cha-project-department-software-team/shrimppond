import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function Harvest (){

    const navigate = useNavigate()

    return (
        <div className ="flex">
                <Sidebar />
                <h1 onClick = {() => {navigate("/")}}>
                    Harvest Page
                </h1>
        </div>   
    )
}

export default Harvest