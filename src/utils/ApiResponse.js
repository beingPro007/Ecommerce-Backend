class ApiResponse{
    constructor(statuscode, message = "Success", data){
        this.data = data,
        this.message = message,
        this.statuscode = statuscode,
        this.success = statuscode < 400
    }
}

export {ApiResponse}