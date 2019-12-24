export default (state, action) => {
  switch (action.type) {
    case "ADD_ALERT":
      return [...state, action.payload]
    case "DELETE_ALERT":
      return state.filter(alert => alert.id !== action.payload);
    case "CLEAR_ALERTS":
      return []
    default:
      return state
  }
}