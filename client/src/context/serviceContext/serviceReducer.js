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
    default:
      return {
        ...state
      }
  }
}