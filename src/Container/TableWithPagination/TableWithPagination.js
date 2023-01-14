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
    const [ourData, setOurData] = useState([]);

    useEffect(() => {
        axios
            //From
            .get('https://reqres.in/api/products')
            //Using 'setOurData' to storage data from API
            .then((response) => {
                setOurData(response.data);
                console.log('Data ok')
            })
            //Catching errors
            .catch((error) => {
                //errors from 400 to 599
                if(error.request.status < 600 && error.request.status > 399) {
                    console.log(`${error.message}, error code: ${error.code}`);
                    //If the error is in a different range, print it to the console
                } else {
                    console.log(error)
                }
            });
    }, []);

    //Assigning to a constant variable information about products from 'ourData'
    const data = ourData.data

    //destructuring
    const {
        per_page: perPage,
        page: whichPage
    } = ourData

    //Setting the page on which the table should be opened and the number of rows per page
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //Storing the number entered in input
    const [query, setQuery] = useState('');

    return (
        <Paper sx={{ minWidth: '40%', overflow: 'hidden', backgroundColor: 'var(--secondary-color)' }} elevation={24} >
            <input
                //Blocking the possibility of entering text
                type="number"
                value={query}
                // value={query}
                placeholder="Filter data by ID"
                //Reaction to every change of the input field - storing the field value in 'setQuery'
                onChange={e => setQuery(e.target.value)}
                style={{display: 'flex', justifyContent: 'center', margin: 'auto', padding: '0.5rem 0.3rem', paddingLeft: '1rem', marginBottom: '1rem', marginTop: '1rem', fontSize: '1.5rem', borderRadius: '10px'}}/>
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
                        {data?.length > 0 &&
                            data?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                //Filtering the received array by product ID - will display the product with the same ID as stored in 'query'
                                .filter((someId) => someId.id.toString().includes(query))
                                .map((row) => (
                                    <TableRow key={row.id}
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
                count= {perPage}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}