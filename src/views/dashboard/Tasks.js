// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Chip from '@mui/material/Chip'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import PropTypes from 'prop-types'

const rows = [
    {
        age: 27,
        status: 'current',
        date: '09/27/2018',
        name: 'Sally Quinn',
        salary: '$19586.23',
        email: 'eebsworth2m@sbwire.com',
        designation: 'Human Resources Assistant'
    }
]

const statusObj = {
    applied: { color: 'info' },
    rejected: { color: 'error' },
    current: { color: 'primary' },
    resigned: { color: 'warning' },
    professional: { color: 'success' }
}

const Tasks = (props) => {
    console.log("L34   props", props)
    var clsRow;
    return (
        <Card>
            <TableContainer>
                <Table sx={{ minWidth: 800 }} aria-label='table in dashboard' id="Tasks">
                    <TableHead>
                        <TableRow>
                            <TableCell>Project</TableCell>
                            <TableCell>Task</TableCell>
                            <TableCell>Duration</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {props.rows.map((row, index) => {
                            const clsRow = props.activeRow === index ? 'highlightedRow' : '';
                            return (
                                <TableRow
                                    onClick={() => props.handleTaskClick(row, index)}
                                    hover key={row.name}
                                    className={clsRow}
                                    sx={{
                                        '&:last-of-type td, &:last-of-type th': { border: 0 }
                                    }}>
                                    <TableCell
                                        className={clsRow}
                                        sx={{ py: theme => `${theme.spacing(0.5)} !important` }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem !important' }}>{row.project}</Typography>
                                            {/*<Typography variant='caption'>{row.task}</Typography>*/}
                                        </Box>
                                    </TableCell>
                                    <TableCell className={clsRow}>{row.task}</TableCell>
                                    <TableCell className={clsRow}>{row.hours}</TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </Card>
    )
}

export default Tasks

//prop-types
Tasks.propTypes = {
    rows: PropTypes.array.isRequired,
    handleTaskClick: PropTypes.func.isRequired
}
