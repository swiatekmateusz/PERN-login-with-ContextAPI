export default (state, action) => {
  switch (action.type) {
    case "SUCCESS_LOGIN":
      localStorage.setItem('token', action.payload.token)
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      }
    case "SUCCESS_LOADUSER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
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
    default:
      return {
        ...state
      }
  }
}