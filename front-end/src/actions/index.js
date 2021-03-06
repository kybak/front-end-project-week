import axios from "axios";

export const FAILURE = "FAILURE";
export const SUCCESS = "SUCCESS";
export const VIEW = "VIEW";
export const WORKING = "WORKING";

export const getNotes = (filterSort = {}) => dispatch => {
    const { filter, sort, page, pageSize } = filterSort;

    dispatch({ type: WORKING });

    return axios
        .get(`http://localhost:8080/notes?page=${page}&pageSize=${pageSize}`)
        .then(({ data }) => {
            if (sort) {
                data.sort((a, b) => (a[sort].toLowerCase() > b[sort].toLowerCase()) ? 1 : ((b[sort].toLowerCase() > a[sort].toLowerCase()) ? -1 : 0));
            }

            if (filter) {
                data = data.filter(d => d.title.toLowerCase().includes(filter) || d.textBody.toLowerCase().includes(filter));
            }

            dispatch({ type: SUCCESS, notes: data });
        })
        .catch(err => {
            dispatch({ type: FAILURE, error: err });
        });
};

export const getNote = id => dispatch => {
    dispatch({ type: WORKING });

    return axios
        .get(`http://localhost:8080/notes/${id}`)
        .then(({ data }) => {
            dispatch({ type: VIEW, note: data });
        })
        .catch(err => {
            dispatch({ type: FAILURE, error: err });
        });
};

export const createNote = note => dispatch => {
    dispatch({ type: WORKING });

    return axios
        .post(`http://localhost:8080/notes`, note)
        .then(({ data }) => {
            dispatch({ type: SUCCESS, notes: data });
        })
        .catch(err => {
            dispatch({ type: FAILURE, error: err });
        });
};

export const editNote = (id, note) => dispatch => {
    dispatch({ type: WORKING });

    return axios
        .put(`http://localhost:8080/notes/${id}`, note)
        .then(({ data }) => {
            dispatch({ type: VIEW, note: data });
        })
        .catch(err => {
            dispatch({ type: FAILURE, error: err });
        });
};

export const deleteNote = id => dispatch => {
    dispatch({ type: WORKING });

    return axios
        .delete(`http://localhost:8080/notes/${id}`)
        .then(() => getNotes()(dispatch))
        .catch(err => dispatch({ type: FAILURE, error: err }));
};