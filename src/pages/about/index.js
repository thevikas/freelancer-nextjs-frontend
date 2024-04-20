// ** MUI Imports
import Grid from '@mui/material/Grid'
import AboutNavigation from 'src/views/about/AboutNavigation'

const CardBasic = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12} md={6}>
                <AboutNavigation />
            </Grid>
        </Grid>
    )
}

export default CardBasic
