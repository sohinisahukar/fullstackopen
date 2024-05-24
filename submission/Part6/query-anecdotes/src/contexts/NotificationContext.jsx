import React, { createContext, useReducer, useContext } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SHOW':
      return { message: action.payload, visible: true }
    case 'HIDE':
      return { ...state, visible: false }
    default:
      return state
  }
}

// eslint-disable-next-line react/prop-types
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, { message: '', visible: false })

  return (
    <NotificationContext.Provider value={{ state, dispatch }}>
      {children}
    </NotificationContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  return useContext(NotificationContext)
}
