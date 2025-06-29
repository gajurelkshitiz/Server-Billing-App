const reducer = (state: any, action: any): any => {
    switch (action.type) {
        case "SET_COMPANYID":
            const companyID = action.payload
            console.log("company ID", companyID);
            return {
                companyID:companyID
            }
    }
}

export default reducer;