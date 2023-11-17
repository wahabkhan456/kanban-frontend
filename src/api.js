import axios from "axios"

// Create an instance of Axios with a base URL
const instance = axios.create({
  baseURL: "http://localhost:3000/", // Replace with your API base URL
})

export default instance
