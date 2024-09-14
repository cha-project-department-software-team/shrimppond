import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar/Sidebar'
import useCallApi from '../../hooks/useCallApi';
import React, { useState, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { DashboardRequestApi } from '../../services/api';

function Harvest (){

    const navigate = useNavigate()
    const callApi = useCallApi();

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

    return (
        <div className ="flex">
            <aside>
                <Sidebar />
            </aside>
            

        </div>   
    )
}

export default Harvest