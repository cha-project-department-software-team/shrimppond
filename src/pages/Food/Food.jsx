import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import Dropdown from '../../components/Dropdown/Dropdown'
import dropdownItems from '../../utils/constants/dropdownItems';

function Food (){

    const navigate = useNavigate()

    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>
            <div className="grow pt-5">
                <Dropdown items={dropdownItems} buttonLabel="Select a City"/>
            </div>
        </div>    
    )
}

export default Food