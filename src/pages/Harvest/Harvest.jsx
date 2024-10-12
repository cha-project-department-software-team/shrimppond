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
                <div className="flex items-center px-5">
                    <h1 className="text-5xl font-extrabold pb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                        Thu hoạch
                    </h1>
                </div>
                <div className="ml-5 w-80 border-[0.2px] border-primary-1 border-black"></div>
                <main className="scroll-y h-[calc(100vh-68px)] p-5 px-5">
                   <HarvestForm />
                </main>
            </div>
        </div>
    );
}

export default Harvest;
