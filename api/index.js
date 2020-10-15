import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://51.210.150.124:8088/'
});

const getMethod = url => instance.get(url)
                                .then(({data}) => data)
                                .catch(e => e);

const postMethod = (url, data) => instance.post(url, data)
                                .then(({data}) => data)
                                .catch(e => e);

export const registerUser = async (data) => await postMethod('api/users', data).then(data => data);
export const getUserInfo = async (userId) => await getMethod(`api/users/${userId}`).then(data => data);
export const loginUser = async({email, password}) => await getMethod(`api/users/login?email=${email}&pwd=${password}`)
export const getAllQuestions = async () => await getMethod(`api/questions`).then(data => data);
export const getMileStoneQuestions = async (mileStoneId) => await getMethod(`api/questions/milestone?id=${mileStoneId}`).then(data => data);
export const sendUserAnswers = async (data) => await postMethod(`api/useranswers`, data).then(data => data);
export const getUserAnswers = async (userId) => await getMethod(`api/useranswers/getuseranswers?userid=${userId}`).then(data => data);