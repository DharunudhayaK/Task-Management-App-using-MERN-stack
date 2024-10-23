import axios from "axios";

const axiosGet = async (url) => {
  return axios.get(url).catch((err) => {
    throw err;
  });
};

const axiosPost = async (url, config) => {
  return axios.post(url, config).catch((err) => {
    throw err;
  });
};

const axiosPut = async (url, id, config) => {
  return axios.put(url, id, config).catch((err) => {
    throw err;
  });
};

const axiosDelete = async (url, id) => {
  return axios.delete(url, id).catch((err) => {
    throw err;
  });
};

export { axiosGet, axiosPost, axiosPut, axiosDelete };
