class UserDTO {
    constructor(data) {
        this._id = data._id;
        this.username = data.username;
        this.email = data.email;
        this.direction = data.direction;
        this.birthDate = data.birthDate;
        this.phoneNumber = data.phoneNumber;
        this.imgUrl = data.imgUrl;
    };
};

export default UserDTO;