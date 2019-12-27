export default (state, action) => {
  switch (action.type) {
    case "ALERT":
      return {
        ...state,
        alert: action.payload,
      }
    case "CLEAR_ALERT":
      return {
        ...state,
        alert: null,
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