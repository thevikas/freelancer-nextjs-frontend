// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Tab from '@mui/material/Tab'
import Card from '@mui/material/Card'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Button from '@mui/material/Button'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import markdownit from 'markdown-it'

const AboutNavigation = () => {
    // ** State
    const [value, setValue] = useState('1')

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const md = markdownit();

    //load markdown from changelog.md
    const [changelog, setChangelog] = useState('')

    useEffect(() => {
        //load local file changelog.md
        fetch('/m/CHANGELOG.md')
            .then((response) => response.text())
            .then((text) => {
                console.log("text loaded", text);
                //parse markdown to html
                setChangelog(md.render(text))
            })
    });

    return (
        <Card>
            <TabContext value={value}>
                <TabList onChange={handleChange} aria-label='card navigation example'>
                    <Tab value='1' label='Changelog' />
                    {/*<Tab value='2' label='Item Two' />
                    <Tab value='3' label='Item Three' />*/}
                </TabList>
                <CardContent>
                    <TabPanel value='1' sx={{ p: 0 }}>
                        <div dangerouslySetInnerHTML={{ __html: changelog }} />
                    </TabPanel>
                    <TabPanel value='2' sx={{ p: 0 }}>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                            Header Two
                        </Typography>
                        <Typography variant='body2' sx={{ marginBottom: 4 }}>
                            Dragée chupa chups soufflé cheesecake jelly tootsie roll cupcake marzipan. Carrot cake sweet roll gummi
                            bears caramels jelly beans.
                        </Typography>
                        <Button variant='contained'>Button Two</Button>
                    </TabPanel>
                    <TabPanel value='3' sx={{ p: 0 }}>
                        <Typography variant='h6' sx={{ marginBottom: 2 }}>
                            Header Three
                        </Typography>
                        <Typography variant='body2' sx={{ marginBottom: 4 }}>
                            Icing cake macaroon macaroon jelly chocolate bar. Chupa chups dessert dessert soufflé chocolate bar
                            jujubes gummi bears lollipop.
                        </Typography>
                        <Button variant='contained'>Button Three</Button>
                    </TabPanel>
                </CardContent>
            </TabContext>
        </Card>
    )
}

export default AboutNavigation
