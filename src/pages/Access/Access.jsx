import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'

function Access (){

    const navigate = useNavigate()

    return (
        <>
            <div className ="flex">
                <Sidebar />
                <h1 onClick = {() => {navigate("/")}}>
                    Access Page
                </h1>
            </div>
        </>
    )
}

export default Access