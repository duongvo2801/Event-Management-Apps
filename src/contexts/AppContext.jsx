import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppContextProvider = props => {
  const { children } = props;
  const [isLogin, setIsLogin] = useState(false);

  const [isFirstLogin, setIsFirstLogin] = useState(false);

  const [data, setIsData] = useState([]);
  const [isModalVisible, setisModalVisible] = useState(false);
  const popup = [isModalVisible, setisModalVisible];

  const [idEmployee, setIdEmployee] = useState('');
  const dataIdEmployee = [idEmployee, setIdEmployee];

  const [dataChange, setDataChange] = useState(1);
  const checkData = [dataChange, setDataChange];

  const [pageData, setPageData] = useState(1);
  const pagination = [pageData, setPageData];

  const [isEmployee, setIsEmployee] = useState(false);
  const checkAcount = [isEmployee, setIsEmployee];

  const [deleteEmployee, setDeleteEmployee] = useState(false);
  const deleteEmployees = [deleteEmployee, setDeleteEmployee];
  return (
    <AppContext.Provider
      value={{
        isLogin,
        setIsLogin,
        isFirstLogin,
        setIsFirstLogin,
        data,
        setIsData,
        popup,
        dataIdEmployee,
        checkData,
        pagination,
        checkAcount,
        deleteEmployees,
      }}>
      {children}
    </AppContext.Provider>
  );
};
