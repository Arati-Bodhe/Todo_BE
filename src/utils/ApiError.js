
export class ApiError {
    constructor(statusCode, message = "Something went wrong") {
      //  super(message);
        this.statusCode = statusCode
        this.message = message
        this.data = null
        this.success = false/////
    }
    
}
