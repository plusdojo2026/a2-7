import axios from "axios";

const api = axios.create({
    withCredentials: true
});

// レスポンス共通処理
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            alert("セッションが切れました。再度ログインしてください。");
            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default api;