import axios from "axios";
import { baseURL } from "../utils/contants";

const instance = axios.create({
  baseURL,
});

const getMethod = (url) =>
  instance
    .get(url)
    .then(({ data }) => data)
    .catch((e) => e);

const postMethod = (url, data) =>
  instance
    .post(url, data)
    .then(({ data }) => data)
    .catch((e) => e);

const putMethod = (url, data) =>
  instance
    .put(url, data)
    .then(({ data }) => data)
    .catch((e) => e);

export const registerUser = async (data) =>
  await postMethod("api/users", data).then((data) => data);

export const getUserInfo = async (userId) =>
  await getMethod(`api/users/${userId}`).then((data) => data);

export const loginUser = async ({ email, password }) =>
  await getMethod(`api/users/login?email=${email}&pwd=${password}`);

export const getAllQuestions = async () =>
  await getMethod(`api/questions`).then((data) => data);

export const getMileStoneQuestions = async (mileStoneId) =>
  await getMethod(`api/questions/milestone?id=${mileStoneId}`).then(
    (data) => data
  );

export const sendUserAnswers = async (data) =>
  await postMethod(`api/useranswers`, data).then((data) => data);

export const getUserAnswers = async (userId) =>
  await getMethod(`api/useranswers/getuseranswers?userid=${userId}`).then(
    (data) => data
  );

export const getSchedules = async (userId) =>
  await getMethod(`api/Schedules/UserSchedule?userid=${userId}`).then(
    (data) => data
  );

export const updateUser = async (data, userId) =>
  await putMethod(`api/Users/${userId}`, data).then((data) => data);

export const getUserPosts = async (userId) =>
  await getMethod(`api/posts/UserPosts?userid=${userId}`).then((data) => data);

export const getStates = async () =>
  await getMethod(`api/states`).then((data) => data);

export const getDistricts = async (stateId) =>
  await getMethod(`api/Districts/GetStateDistrict?id=${stateId}`).then(
    (data) => data
  );

export const validateMail = async (mail) =>
  await getMethod(`api/Users/validmail?email=${mail}`).then((data) => data);

export const uploadFile = async (config) =>
  await fetch(`${baseURL}api/TblMessages/fileupload`, config)
    .then((response) => response.json())
    .then((data) => data);

export const deleteToken = async (mail) =>
  await getMethod(`api/Notifications/Delete?token=${mail}`).then(
    (data) => data
  );

export const getToken = async (data) =>
  await postMethod(`api/Notifications`, data).then((data) => data);

export const uploadProfile = async (config) =>
  await fetch(`${baseURL}api/users/upload`, config)
    .then((response) => response.json())
    .then((data) => data);
