import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, Box, IconButton, Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import SortIcon from '@material-ui/icons/Sort';
import { Formik, Form, Field } from 'formik';
import { TextField } from 'formik-material-ui';
import moment from 'moment';
import * as Yup from 'yup';

const genId = () => '_' + Math.random().toString(36).substr(2, 9);

const emptyTraining = (id, filter = 'All') => ({
    id: id,
    date: '-',
    type: (filter === 'All' ? '-' : filter),
    distance: 0,
    comment: '-'
});

const adaptData = (values) => {
    const dataToSend = [];
    for (let i = 0; i < values.id.length; i++) {
        const obj = {
            id: values.id[i], 
            date: values.date[i], 
            type: values.type[i], 
            distance: values.distance[i],
            comment: values.comment[i],
        }
        dataToSend.push(obj);
    }

    return dataToSend;

}

const sortTrainings = (data, sort) => {
    switch (sort) {
        case 'default': 
            return data.slice()
        case 'asc': 
            return data.slice().sort((prev, curr) => (curr.date > prev.date ? -1 : 1))
        case 'desc': 
            return data.slice().sort((prev, curr) => (prev.date > curr.date ? -1 : 1))
        default:
            return data.slice()
    }
}

const useStyles = makeStyles((theme) => ({
    filterSelect: {
        width: '100px',
    },
    titleBox: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 25px',
    },
    submitBtn: {
        marginLeft: '25px'
    },
    dateHead: {
        position: 'relative',
        paddingRight: '40px',
    },
    sortIcon: {
        position: 'absolute',
        top: 5, 
        right: 5,
    }
  }));


const Trainings = (props) => {
    const { trainings, deleteTraining, addTraining, refreshData, setSort, sort, filter } = props;;
    const classes = useStyles();
    const [selected, setSelected] = React.useState([]);

    const selectRowHandler = (id) => {
        setSelected([...selected, id]);
    }

    const sortedTrainigs = sortTrainings(trainings, sort);

    const isRowSelected = (id) => selected.includes(id);

    const validationSchema = Yup.object().shape({
        id: Yup.array(),
        date: Yup.array().of(Yup.date().required('field is required')),
        type: Yup.array().of(Yup.string().required('field is required')),
        distance: Yup.array().of(Yup.number().required('field is required')),
    });

    return (
        <>
        {trainings && trainings.length ? (<Formik

            enableReinitialize={true}

            initialValues = {{
                id: sortedTrainigs.map((item) => item.id),
                date: sortedTrainigs.map((item) => moment(item.date).format('YYYY-MM-DD')),
                type: sortedTrainigs.map((item) => item.type),
                distance: sortedTrainigs.map((item) => item.distance),
                comment: sortedTrainigs.map((item) => item.comment),
            }}

            validationSchema={validationSchema}

            onSubmit = {(values, { setSubmitting, resetForm, setStatus }) => {
                refreshData(adaptData(values))
                    .then((res) => {
                        setSubmitting(false);
                    })
                    .catch(() => {
                        setSubmitting(false);
                    })
            }}
        >
            {({ values }) => (
                    <Form>
                        <Box className={classes.titleBox} component="div" m={1}>
                            <div>
                                <IconButton 
                                    onClick={()=>{
                                        refreshData(adaptData(values))
                                            .then(() => {
                                            addTraining(emptyTraining(genId(), filter));
                                            })
                                        
                                    }}
                                >
                                    <AddIcon/>
                                </IconButton>
                                {trainings && trainings.length ? (
                                <>
                                    <IconButton 
                                        onClick={()=>{
                                            selected.forEach((id) => {
                                                deleteTraining(id)
                                                .then(() => {
                                                    setSelected([]);
                                                })
                                            })
                                            
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                    <Button className={classes.submitBtn} variant="contained" type="submit">Submit</Button>
                                </>
                                ) : null}  
                            </div>
                            
                        </Box>
                        <TableContainer>
                            <Table aria-label="trainings-form">
                                <TableHead>
                                    <TableRow>
                                        <TableCell className={classes.dateHead} colSpan="2">
                                            <b>Date</b>
                                            <span> sort {sort}</span>
                                            <IconButton 
                                                className={classes.sortIcon}
                                                onClick={()=>{
                                                    if (sort === 'default') {
                                                        setSort('asc');
                                                        return;
                                                    } else if (sort === 'asc') {
                                                        setSort('desc');
                                                        return;
                                                    } else {
                                                        setSort('default');
                                                        return;
                                                    }
                                                }}
                                            >
                                                <SortIcon/>
                                            </IconButton>  
                                        </TableCell>
                                        <TableCell><b>Training Type</b></TableCell>
                                        <TableCell><b>Distance, km</b></TableCell>
                                        <TableCell><b>Comment</b></TableCell>
                                    </TableRow>
                                </TableHead>
                            <TableBody>
                                {sortedTrainigs.map((item, index) => (
                                    <TableRow key={item.id} selected={isRowSelected(item.id)}>
                                        <TableCell padding="checkbox">
                                            <Checkbox onChange={(evt) => {
                                                if (evt.target.checked) {
                                                selectRowHandler(item.id); 
                                                } else {
                                                    setSelected(selected.filter((it) => it !== item.id));
                                                }
                                            }}/>
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                id={`date${index}`}
                                                name={`date[${index}]`}
                                                component={TextField}
                                                type="date"
                                            />
                                            
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                id={`type${index}`}
                                                name={`type[${index}]`}
                                                component={TextField}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                id={`distance${index}`}
                                                name={`distance[${index}]`}
                                                component={TextField}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Field
                                                id={`comment${index}`}
                                                name={`comment[${index}]`}
                                                component={TextField}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            </Table>
                        </TableContainer>
                    </Form>
              
                )}
            </Formik>) : (<div className="empty"><strong>Sorry, there are no trainings yet..., add training</strong><IconButton 
                            onClick={()=>{
                                addTraining(emptyTraining(genId()));
                            }}
                        >
                            <AddIcon/>
                        </IconButton></div>)}
        </>   
                );
}

export default Trainings;