import Axios from "axios";

let user = JSON.parse(localStorage.getItem('user'))

const instance = Axios.create({
//  baseURL:"http://localhost:5000/api",
    baseURL: "https://medi-desk-backend.herokuapp.com/api",
  headers: {
    authorization: `Bearer ${user ? user.token : ""}`,
  },
});

export default instance;