import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Dropdown from '../../components/Dropdown/Dropdown'
import DropdownItems from '../../utils/constants/dropdownItems'
function Food (){

    const navigate = useNavigate()

    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>
            <div className="grow pt-5">
                <Dropdown items = {DropdownItems} buttonLabel = "Select a city"/>
            </div>
        </div>    
    )
}

export default Food