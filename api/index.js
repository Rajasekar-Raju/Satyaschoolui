import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://51.210.150.124:8088/'
});

const getMethod = url => instance.get(url)
                                .then(({data}) => data)
                                .catch(({message}) => message);

const postMethod = (url, data) => instance.post(url, data)
                                .then(({data}) => data)
                                .catch(({message}) => message);

export const registerUser = async (data) => await postMethod('api/users', data).then(data => data);
export const getUserInfo = async (userId) => await getMethod(`api/users/${userId}`).then(data => data);
export const loginUser = async({email, password}) => await getMethod(`api/users/login?email=${email}&pwd=${password}`)
export const getAllQuestions = async () => await getMethod(`api/questions`).then(data => data);