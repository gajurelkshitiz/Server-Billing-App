const reducer = (state: any, action: any): any => {
    switch (action.type) {
        case "SET_COMPANY":
            const { companyID, companyName } = action.payload;
            console.log("company ID", companyID);
            console.log("company Name", companyName);
            return {
                ...state,
                companyID: companyID,
                companyName: companyName
            }
        default:
            return state;
    }
}

export default reducer;