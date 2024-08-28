import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function Status (){

    const navigate = useNavigate()

    return (
        <>
            <div className ="flex">
                <Sidebar />
                <h1 onClick = {() => {navigate("/")}}>
                    Status Page
                </h1>
            </div>
        </>
    )
}

export default Status