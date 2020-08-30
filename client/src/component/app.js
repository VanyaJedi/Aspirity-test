import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { AppBar, Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Operation, ActionCreator } from '../reducer/reducer';
import { Select, MenuItem, IconButton, Dialog } from '@material-ui/core';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import CloseIcon from '@material-ui/icons/Close';
import {Line} from 'react-chartjs-2';

import Trainings from './trainings';


const filterTrainings = (data, filter) => {
    if (filter !== 'All') {
        return data.filter((item) => item.type === filter);
    }
    return data;
}

const genChartData = (data) => {
    const sortedData = data.slice().sort((prev, curr) => (curr.date > prev.date ? -1 : 1));
    return sortedData.reduce((result, item) => {
        const indexInResult = result.findIndex((it) => it.date === item.date);
        if (indexInResult >= 0) {
            result[indexInResult].distance += +item.distance;
        } else {
            result.push({ date: item.date, distance: item.distance});
        }
        return result;
    }, []);
}



const useStyles = makeStyles((theme) => ({
    root: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        height: '50px',
        padding: '0 10px',
    },

    filterSelect: {
        width: '100px',
        backgroundColor: '#fff',
        color: '#808080',
        marginLeft: '10px',
    },
    filterBox: {
        marginLeft: '100px',
        marginRight: 'auto',
    },
    chartIcon : {
        fill: '#fff',
    },
    chartPopup: {
        height: '100%'
    },
    appBar: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    chartBox: {
        width: '800px',
        height: '800px',
        margin: '0 auto',
    }
  }));

  

const App = (props) => {
    const { trainings, deleteTraining, addTraining, refreshData, setFilter, filter, sort, setSort, isChartPopup, showChart } = props;
    const classes = useStyles();

    const filteredTrainings = filterTrainings(trainings, filter);

    const chartData = genChartData(trainings);

    const charData = {
        labels: chartData.map(item => moment(item.date).format('YYYY-MM-DD')),
        datasets: [
            {
                label: 'distance',
                data: chartData.map(item => item.distance),
            }
        ]
    }

    return (
        <>
        <Dialog className={classes.chartPopup} fullScreen open={isChartPopup}>
            <AppBar className={classes.appBar}>
                <IconButton  onClick={()=>{showChart(false)}}>
                    <CloseIcon className={classes.chartIcon} />
                </IconButton>
                <Typography variant="h6">
                    Distance chart
                </Typography>
            </AppBar>
            <div className={classes.chartBox}>
               <Line data={charData} options={{
                responsive: true,
                }}/> 
            </div>
            
        </Dialog>
        <AppBar className={classes.root}>
            <Typography variant="h6">
                BestRunner App
            </Typography>
            <div className={classes.filterBox}  >
                <span> Filter on type: </span>
                <Select 
                    className={classes.filterSelect}  
                    onChange={(evt) => {
                                setFilter(evt.target.value);
                            }}
                    value={filter}
                >
                    
                     <MenuItem 
                            key='All' 
                            value='All'
                        > All
                        </MenuItem>
                    {trainings.map((item) => item.type).filter((value, index, self) => self.indexOf(value) === index).map((item) => (
                        <MenuItem 
                            key={item} 
                            value={item}
                        > {item}
                        </MenuItem>
                    ))}
                </Select> 
            </div>
            <IconButton onClick={()=>{showChart(true)}}>
                <ShowChartIcon className={classes.chartIcon}/>
            </IconButton>
        </AppBar>
        <Trainings trainings={filteredTrainings} deleteTraining={deleteTraining} addTraining={addTraining} refreshData={refreshData} sort={sort} setSort={setSort} filter={filter}/>
        </>
    )
}


const mapStateToProps = (state) => ({
    trainings: state.trainings,
    filter: state.filter,
    sort: state.sort,
    isChartPopup: state.isChartPopup,
});

const mapDispatchToProps = (dispatch) => ({
    deleteTraining(id) {
        return dispatch(Operation.deleteTraining(id));
    },

    addTraining(data) {
        return dispatch(Operation.addTraining(data));
    },

    refreshData(data) {
        return dispatch(Operation.refreshData(data));
    },

    setFilter(filter) {
        return dispatch(ActionCreator.setFilter(filter));
    },

    setSort(sort) {
        return dispatch(ActionCreator.setSort(sort));
    },

    showChart(status) {
        return dispatch(ActionCreator.showChart(status));
    },

});

export { App };
export default connect(mapStateToProps, mapDispatchToProps)(App);