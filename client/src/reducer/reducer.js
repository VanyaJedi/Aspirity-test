export const extend = (a, b) => ({ ...a, ...b });

const initialState = {
    trainings: [],
    filter: 'All',
    sort: 'default',
    isChartPopup: false,
};

const ActionType = {
    LOAD_TRAININGS: 'LOAD_TRAININGS',
    CHANGE_TRAININGS: 'CHANGE_TRAININGS',
    SET_FILTER: 'SET_FILTER',
    SET_SORT: 'SET_SORT',
    SHOW_CHART: 'SHOW_CHART',
};

const ActionCreator = {
    loadTrainings: (data) => {
        return {
            type: ActionType.LOAD_TRAININGS,
            payload: data,
        };
    },

    setFilter: (filter) => {
        return {
            type: ActionType.SET_FILTER,
            payload: filter,
        };
    },

    setSort: (sort) => {
        return {
            type: ActionType.SET_SORT,
            payload: sort,
        };
    },
    showChart: (status) => {
        return {
            type: ActionType.SHOW_CHART,
            payload: status,
        };
    }
};

const Operation = {
    loadTrainings: () => (dispatch, getState) => {
        fetch('http://localhost:3001/data/trainings')
            .then((res) => res.json())
            .then((res) => {
                dispatch(ActionCreator.loadTrainings(res))
            })
            .catch((err) => {console.log(err)});
    },

    deleteTraining: (id) => (dispatch, getState) => {
        return fetch(`http://localhost:3001/data/trainings/${id}`, {
            method: 'DELETE',
          })
            .then((res) => {
                dispatch(Operation.loadTrainings());
            })
            .catch((err) => {console.log(err)});
    },

    addTraining: (data) => (dispatch, getState) => {
        fetch(`http://localhost:3001/data/addrow/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
          })
          .then(() => {
            dispatch(Operation.loadTrainings());
          });
    },

    refreshData: (data) => (dispatch, getState) => {

        return fetch(`http://localhost:3001/data/refreshdata/`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify(data)
          })
          .then(() => {
            dispatch(Operation.loadTrainings());
          });
    },

}

const reducer = (state = initialState, action) => {
    switch (action.type) {
    case ActionType.LOAD_TRAININGS:
        return extend(state, { trainings: action.payload });
    case ActionType.SET_FILTER:
        return extend(state, { filter: action.payload });
    case ActionType.SET_SORT:
        return extend(state, { sort: action.payload });
    case ActionType.SHOW_CHART:
        return extend(state, { isChartPopup: action.payload });
    default:
        return state;
    }
}

export { reducer, ActionType, ActionCreator, Operation };