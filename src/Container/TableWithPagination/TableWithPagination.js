import React, {useState, useEffect} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import axios from "axios";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import './TableWithPagination.css'

//Style for table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.info.main,
        color: theme.palette.common.white,
        fontSize: 22,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 18,
    },
}));

export default function TableWithData() {

    //Getting data from API
    const [ourData, setOurData] = useState(null);
    //Selecting row with data for modal
    const [selectedItem, setSelectedItem] = useState(null);
    const [open, setOpen] = useState(false);
    //Setting the page on which the table should be opened and the number of rows per page
    const [page, setPage] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(null);
    //Storing the number entered in input
    const [query, setQuery] = useState('');
    //Storing error object
    const [errorData, setErrorData] = useState(null);
    //Storing URL
    const [queryParams, setQueryParams] = useState(null);
    //When data is downloading from API
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const searchInput = urlParams.get(`search`);
        const page = urlParams.get(`page`);

        searchInput && setQuery(searchInput);
        page && setPage(+page);

        setQueryParams({
            searchParams: searchInput,
            page: page
        });
    }, []);

    useEffect(() => {
        axios
            //From
            .get('https://reqres.in/api/products')
            //Using 'setOurData' to storage data from API
            .then((response) => {
                setIsLoading(false);
                setOurData(response.data);
                queryParams?.page && setPage(response.data.page - 1);

                setRowsPerPage(response.data.per_page -1)
                console.log('Data ok')
            })
            //Catching errors
            .catch((error) => {
                setIsLoading(false);
                //errors from 400 to 599
                setErrorData(error)
                if(error.request.status < 600 && error.request.status > 399) {
                    console.log(`${error.message}, error code: ${error.code}`);
                    //If the error is in a different range, print it to the console
                } else {
                    console.log(error)
                }
            });
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        handleChangeQueryParams(newPage, 'page');
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleSearchChange = (event) => {
        setQuery(event.target.value);

        handleChangeQueryParams(event.target.value,'search');
    }

    const handleChangeQueryParams = (value, paramName) => {
        const url = new URL(window.location);
        url.searchParams.set(paramName, value);
        window.history.pushState(null, '', url.toString());
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    const styleForInput = {
        display: 'flex',
        justifyContent: 'center',
        margin: 'auto',
        padding: '0.5rem 0.3rem',
        paddingLeft: '1rem',
        marginBottom: '1rem',
        marginTop: '1rem',
        fontSize: '1.5rem',
        borderRadius: '10px'}

    return (
        <>
            {isLoading ? <p>Loading...</p> : <>

                { ourData ?
                    <>
                        <Paper sx={{ minWidth: '40%', overflow: 'hidden', backgroundColor: 'var(--secondary-color)' }} elevation={24} >
                            <input
                                //Blocking the possibility of entering text
                                type="number"
                                value={query}
                                placeholder="Filter data by ID"
                                //Reaction to every change of the input field - storing the field value in 'setQuery'
                                onChange={handleSearchChange}
                                style={styleForInput}/>
                            <TableContainer component={Paper} sx={{width: 1}}>
                                <Table aria-label="customized table">
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>ID</StyledTableCell>
                                            <StyledTableCell align="right">Name</StyledTableCell>
                                            <StyledTableCell align="right">Year</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {ourData.data?.length > 0 &&
                                            ourData.data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                //Filtering the received array by product ID - will display the product with the same ID as stored in 'query'
                                                .filter((someId) => someId.id.toString().includes(query))
                                                .map((row) => (
                                                    <TableRow key={row.id} onClick={() => {setSelectedItem(row); setOpen(true)}}
                                                              sx={{backgroundColor: row.color}}
                                                    >
                                                        <StyledTableCell component="th" scope="row">
                                                            {row.id}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            {row.name}
                                                        </StyledTableCell>
                                                        <StyledTableCell align="right">
                                                            {row.year}
                                                        </StyledTableCell>
                                                    </TableRow>
                                                ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[]}
                                component="div"
                                count= {ourData?.total}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Paper>
                        {selectedItem && <Modal
                            open={open}
                            onClose={() => setOpen(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    <p>{selectedItem.name.toUpperCase()} ALL DATA</p>
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                                    <p>ID: {selectedItem.id}</p>
                                    <p>Name: {selectedItem.name}</p>
                                    <p>Year: {selectedItem.year}</p>
                                    <p>Color: {selectedItem.color}</p>
                                    <p>Pantone value: {selectedItem.pantone_value}</p>
                                </Typography>
                            </Box>
                        </Modal>}
                    </>
                    :
                    <div className="error">
                        {(errorData?.request.status < 600 && errorData?.request.status > 399) ?
                            <>
                                <h1>Sorry, we have a problem...</h1>
                                <p>{errorData?.message}</p>
                            </>:
                            <>
                                <h1>Sorry, we have a problem...</h1>
                            </>}
                    </div>
                }
            </>}
        </>
    );
}