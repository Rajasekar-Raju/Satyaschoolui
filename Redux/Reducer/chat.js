import { CHAT, RESET } from "../../utils/contants";

const initialState = {
  chatList: [],
  messages: [],
  connectionHub: "",
  loading: true,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHAT.SET_CHATS:
      return {
        ...state,
        chatList: action.data,
      };
    case CHAT.SET_MESSAGES:
      return {
        ...state,
        messages: state.messages.some(
          (message) => message.msgId === action.data.msgId
        )
          ? state.messages
          : [...state.messages, action.data],
      };
    case CHAT.SET_INIT_MESSAGES:
      return {
        ...state,
        messages: action.data,
      };
    case CHAT.SET_DEL_MESSAGES:
      return {
        ...state,
        messages: state.messages.map((item) =>
          item.msgId !== action.data ? item : { ...item, isActive: false }
        ),
      };
    case CHAT.UPDATE_USERS:
      return {
        ...state,
        chatList: state.chatList.some(function (el) {
          return el.userid === action.data.userid;
        })
          ? state.chatList.map((item) =>
              item.userid !== action.data.userid ? item : action.data
            )
          : [...state.chatList, action.data],
      };
    case CHAT.SET_CONNECTION:
      return {
        ...state,
        connectionHub: action.data,
      };
    case CHAT.SET_LOADING:
      return {
        ...state,
        loading: action.data,
      };
    case RESET:
      return {
        ...state,
        chatList: [],
        messages: [],
      };
    default:
      return state;
  }
}
