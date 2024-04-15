// ** React Imports
import { Fragment } from 'react'

// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

// Styled Components
const MaskImg = styled('img')(() => ({
    bottom: 0,
    zIndex: -1,
    width: '100%',
    position: 'absolute'
}))

const TreeImg = styled('img')(({ theme }) => ({
    left: '2.25rem',
    bottom: '4.25rem',
    position: 'absolute',
    [theme.breakpoints.down('lg')]: {
        left: 0,
        bottom: 0
    }
}))

const FooterIllustrations = props => {
    // ** Props
    const { image } = props

    // ** Hook
    const theme = useTheme()

    // ** Vars
    const hidden = useMediaQuery(theme.breakpoints.down('md'))
    if (!hidden) {
        return (
            <Fragment>
                {image || <TreeImg alt='tree' src='/m/images/pages/tree-2.png' />}
                <MaskImg alt='mask' src={`/images/pages/misc-mask-${theme.palette.mode}.png`} />
            </Fragment>
        )
    } else {
        return null
    }
}

export default FooterIllustrations
