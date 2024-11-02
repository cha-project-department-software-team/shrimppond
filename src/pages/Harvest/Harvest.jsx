import 'react-datepicker/dist/react-datepicker.css'; // Import CSS cho DatePicker
// import useCallApi from '../../hooks/useCallApi';
import Sidebar from '../../components/Sidebar';
import HarvestForm from '../../components/HarvestForm'

function Harvest() {
    // const callApi = useCallApi();

    return (
        <div className="container flex h-screen overflow-hidden ">
            <aside className="h-full">
                <Sidebar />
            </aside>
            <div className="grow pt-5">
                
                <main className="scroll-y h-[calc(100vh-50px)] p-5">
                   <HarvestForm />
                </main>
            </div>
        </div>
    );
}

export default Harvest;
