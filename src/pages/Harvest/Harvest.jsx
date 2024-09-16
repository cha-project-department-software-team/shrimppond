import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useCallApi from '../../hooks/useCallApi';
import React, { useState, useCallback, useEffect } from 'react';
import { DashboardRequestApi } from '../../services/api';
import CreateModal from '../../components/CreateModal'


function Harvest (){

    const navigate = useNavigate()
    const callApi = useCallApi();

    const [isCreateModal, setIsCreateModal] = useState(false)

    const fetchData = useCallback(() => {
        callApi(
          () => DashboardRequestApi.pondRequest.getPondRequest(), 
          (res) => {
            console.log(res)
          },
          "Lấy danh sách khối ao thất bại!"
        );
      }, [callApi]);
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    console.log(isCreateModal)

    
    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>
            <button onClick = {prev => setIsCreateModal(!prev)}>
              isCreateModal
            </button>


          <CreateModal 
            isCreateModal = {isCreateModal}
            setIsCreateModal = {setIsCreateModal}
            onPostSuccess = {fetchData()}
          />
        </div>   
    )
}

export default Harvest