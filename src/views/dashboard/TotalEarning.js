// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import LinearProgress from '@mui/material/LinearProgress'
import RefreshIcon from '@mui/icons-material/Refresh'
import PropTypes from 'prop-types'
// ** Icons Imports
import MenuUp from 'mdi-material-ui/MenuUp'
import DotsVertical from 'mdi-material-ui/DotsVertical'
import { CircularProgress } from '@mui/material';
import Link from 'next/link'

/*
const data = [
    {
        progress: 75,
        imgHeight: 40,
        title: 'Zipcar',
        color: 'primary',
        amount: '$24,895.65',
        subtitle: 'Vuejs, React & HTML',
        imgSrc: '/m/images/cards/logo-zipcar.png'
    },
    {
        progress: 50,
        color: 'info',
        imgHeight: 27,
        title: 'Bitbank',
        amount: '$8,650.20',
        subtitle: 'Sketch, Figma & XD',
        imgSrc: '/m/images/cards/logo-bitbank.png'
    },
    {
        progress: 20,
        imgHeight: 20,
        title: 'Aviato',
        color: 'secondary',
        amount: '$1,245.80',
        subtitle: 'HTML & Angular',
        imgSrc: '/m/images/cards/logo-aviato.png'
    }
]*/

const TotalEarning = (props) => {
    console.log("L47 refresh... props", props);

    const randomSubtitles = [
        'Vuejs, React & HTML',
        'Sketch, Figma & XD',
        'HTML & Angular'
    ];

    for (var i = 0; i < props.data.length; i++) {
        if (props.data[i].imgSrc === undefined)
            props.data[i].imgSrc = randomLogos[i % randomLogos.length];
        if (props.data[i].subtitle === undefined)
            props.data[i].subtitle = randomSubtitles[i % randomSubtitles.length];
    }
    const { isRefreshing, callRefreshApi, title, data, totalIncome, prevIncome } = props;
    //format the number commas
    const totalIncomeInr = '₹' + props.totalIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    const prevIncomeInr = '₹' + props.prevIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return (
        <Card>
            <CardHeader
                title={props.title}
                titleTypographyProps={{ sx: { lineHeight: '1.6 !important', letterSpacing: '0.15px !important' } }}
                action={
                    <IconButton
                        size='small'
                        aria-label='refresh'
                        className={isRefreshing ? 'card-refresh-button spin' : 'card-refresh-button'}
                        sx={{ color: 'text.secondary' }}
                        onClick={callRefreshApi}
                    >
                        {isRefreshing ? <CircularProgress size={24} /> : <RefreshIcon />}
                    </IconButton>
                }
            />
            <CardContent sx={{ pt: theme => `${theme.spacing(2.25)} !important` }}>
                <Box sx={{ mb: 1.5, display: 'flex', alignItems: 'center' }}>
                    <Typography variant='h4' sx={{ fontWeight: 600, fontSize: '2.125rem !important' }}>
                        {totalIncomeInr}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <MenuUp sx={{ fontSize: '1.875rem', verticalAlign: 'middle' }} />
                        <Typography variant='body2' sx={{ fontWeight: 600, color: 'success.main' }}>
                            {props.percentageChange}%
                        </Typography>
                    </Box>
                </Box>

                <Typography component='p' variant='caption' sx={{ mb: 10 }}>
                    Compared to {prevIncomeInr} last month
                </Typography>

                {props.data.map((item, index) => {
                    console.log("L103 item", item);
                    return (
                        <Box
                            key={item.title}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                ...(index !== props.data.length - 1 ? { mb: 8.5 } : {})
                            }}
                        >
                            <Avatar
                                variant='rounded'
                                sx={{
                                    mr: 3,
                                    width: 40,
                                    height: 40,
                                    backgroundColor: theme => `rgba(${theme.palette.customColors.main}, 0.04)`
                                }}
                            >
                                <img src={item.imgSrc} alt={item.title} height={item.imgHeight} />
                            </Avatar>
                            <Box
                                sx={{
                                    width: '100%',
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}
                            >
                                <Box sx={{ marginRight: 2, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='body2' sx={{ mb: 0.5, fontWeight: 600, color: 'text.primary' }}>
                                        <Link passHref href={`/p?n=${item.title}`}>
                                            {item.title}
                                        </Link>
                                    </Typography>
                                    <Typography variant='caption'>{item.subtitle}</Typography>
                                </Box>

                                <Box sx={{ minWidth: 85, display: 'flex', flexDirection: 'column' }}>
                                    <Typography variant='body2' sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
                                        {item.amount}
                                    </Typography>
                                    <LinearProgress color={item.color} value={item.progress} variant='determinate' />
                                </Box>
                            </Box>
                        </Box>
                    )
                })}
            </CardContent>
        </Card>
    )
}

//define props
TotalEarning.propTypes = {
    percentageChange: PropTypes.number,
    totalIncome: PropTypes.number,
    prevIncome: PropTypes.number,
    data: PropTypes.array,
    title: PropTypes.string,
    callRefreshApi: PropTypes.func,
    hoursChartData: PropTypes.array
}

export default TotalEarning
