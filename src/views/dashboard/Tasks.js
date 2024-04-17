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

const ProjectsList = (props) => {
    return (
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="pomodoro-project-select-label">Select project</InputLabel>
            <Select
                labelId="pomodoro-project-select-label"
                id="pomodoro-project-select"
                onChange={props.handleSelect}
                label="Project"
            >
                {props.projectNames.map((project, index) => (
                    <MenuItem value={project}>{project}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )
};

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
                            //when row.name=Pomodoro render over to allow selection from projectNames
                            const pom = row.name == 'Pomodoro';
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
                                        </Box>
                                        {pom && <ProjectsList
                                            handleSelect={props.handlePomodoroSelect}
                                            projectNames={props.projectNames} />}
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
    projectNames: PropTypes.array.isRequired,
    handlePomodoroSelect: PropTypes.func.isRequired,
    handleTaskClick: PropTypes.func.isRequired
}
