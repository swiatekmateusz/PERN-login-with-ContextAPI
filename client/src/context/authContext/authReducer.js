export default (state, action) => {
  switch (action.type) {
    case "SUCCESS_LOGIN":
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case "SUCCESS_LOADUSER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
    case "ERROR_REGISTER":
    case "ERROR_LOGIN":
    case "ERROR_LOADUSER":
    case "LOGOUT":
      localStorage.removeItem('token')
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        loading: false,
        user: null,
        error: action.payload,
      }
    case "END_LOADING":
      return {
        ...state,
        loading: false,
      }
    case "START_LOADING":
      return {
        ...state,
        loading: true,
      }
    case "ALERT":
      return {
        ...state,
        error: action.payload,
      }
    case "CLEAR_ALERT":
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    case "SET_RESENDEMAIL":
      return {
        ...state,
        emailToResend: action.payload,
      }
    case "REMOVE_RESENDEMAIL":
      return {
        ...state,
        emailToResend: null,
      }
    default:
      return {
        ...state
      }
  }
}