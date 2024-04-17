import React, { useEffect, useState } from 'react';
// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Icons Imports
import Poll from 'mdi-material-ui/Poll'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import BriefcaseVariantOutline from 'mdi-material-ui/BriefcaseVariantOutline'
import MoreTimeIcon from '@mui/icons-material/MoreTime';
import ScheduleSendIcon from '@mui/icons-material/ScheduleSend';
import TimerIcon from '@mui/icons-material/Timer';
// ** Custom Components Imports
import CardStatisticsVerticalComponent from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Components Imports
import Table from 'src/views/dashboard/Table'
import Trophy from 'src/views/dashboard/Trophy'
import TotalEarning from 'src/views/dashboard/TotalEarning'
import StatisticsCard from 'src/views/dashboard/StatisticsCard'
import WeeklyOverview from 'src/views/dashboard/WeeklyOverview'
import DepositWithdraw from 'src/views/dashboard/DepositWithdraw'
import SalesByCountries from 'src/views/dashboard/SalesByCountries'
import Tasks from '../views/dashboard/Tasks';
import { Fab } from '@mui/material';
import Link from 'next/link';

const TomatoIcon = () => (
    <svg
        width="50"
        height="50"
        viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="red" />
        <path d="M9 4L12 2L15 4" stroke="green" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Dashboard = () => {

    const [hoursChartData, setHoursChartData] = useState([]);
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalEstIncome, setTotalEstIncome] = useState(0);
    const [projectsData, setProjectsData] = useState([]);
    const [projectsEstData, setProjectsEstData] = useState([]);
    const [projectsMetaData, setProjectsMetaData] = useState([]);
    const [projectsReady, setProjectsReady] = useState(false);
    const [todayData, setTodayData] = useState([]);

    const [showAddTask, setShowAddTask] = useState(true);
    const [showStartTask, setShowStartTask] = useState(false);
    const [activeTask, setActiveTask] = useState(null);
    const [activeRow, setActiveRow] = useState(null);
    const [pomodoroStatus, setPomodoroStatus] = useState(false);
    const [pomodoroInterval, setPomodoroInterval] = useState(null);
    const [pomoTimeLeft, setPomoTimeLeft] = useState("");
    const [taskUpdateTimer, setTaskUpdateTimer] = useState(0);

    const [projectNames, setProjectNames] = useState([]);

    /**
     * Fetch Data of tasks done today
     */
    const fetchData = async () => {
        const showall = false; // Adjust this based on your actual state or props
        const url = `${process.env.NEXT_PUBLIC_API_URL}/now/today?showall=${showall ? "1" : "0"}`;
        console.log("L41 fetchData url", url);

        let headers = new Headers();

        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');

        try {
            const response = await fetch(url, {
                //mode: 'no-cors',
                method: 'GET',
                headers: headers
            });
            const json = await response.json();
            console.log("L61 keys", json);
            for (var i = 0; i < json.length; i++) {

                //if json[i].spent_time_secs==0 then remove this array item
                if (json[i].task == 'Pomodoro') {
                    console.log("L89 found running pomodoro", json[i]);
                    clearInterval(pomodoroInterval);
                    setPomodoroStatus(false);
                    setPomodoroInterval(null);
                    handlePomodoro(true).then((res) => {
                        global.pomodoroTime -= json[i].spent_time_secs;
                        const tleft = `${Math.floor(global.pomodoroTime / 60).toString().padStart(2, '0')}:${(global.pomodoroTime % 60).toString().padStart(2, '0')}`;
                        setPomoTimeLeft(tleft);
                        console.log("L94 pomodoroTimeLeft", pomoTimeLeft);
                    });
                }
                else if (json[i].spent_time_secs == 0) {
                    json.splice(i, 1);
                    i--;
                    continue;
                }

                //json[i].hours = Math.round(json[i].spent_time_secs / 3600);
                const hours = Math.floor(json[i].spent_time_secs / 3600);
                const minutes = Math.floor((json[i].spent_time_secs - (hours * 3600)) / 60);
                json[i].hours = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
            }
            setTodayData(json);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch all today's tasks via a timer
    useEffect(() => {
        fetchData();
    }, [taskUpdateTimer]); // Add dependencies here if needed

    /**
     * Get projects statistics for this month
     */
    useEffect(() => {
        const fetchData = async () => {
            const showall = false; // Adjust this based on your actual state or props
            const url = `${process.env.NEXT_PUBLIC_API_URL}/projects?showall=${showall ? "1" : "0"}`;
            console.log("L28 url", process.env);

            let headers = new Headers();

            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');

            headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
            //headers.append('Access-Control-Allow-Credentials', 'true');

            headers.append('GET', 'POST', 'OPTIONS');

            try {
                const response = await fetch(url, {
                    //mode: 'no-cors',
                    method: 'GET',
                    headers: headers
                });
                const json = await response.json();
                console.log("L110 keys", Object.keys(json));
                const projectNames = Object.keys(json).filter(key => key !== 'summary');
                const newChartData = projectNames.map(key => {
                    return {
                        x: key,
                        y: json[key].Total
                    }
                }); // Map to the 'Total' worked hours
                console.log("L35 newChartData", newChartData);
                setHoursChartData(newChartData);
                setTotalIncome(json.summary.Income);
                setTotalEstIncome(json.summary.EstimatedIncome);

                var pdata = projectNames.map(key => {
                    setProjectNames([...projectNames, key]);
                    return {
                        progress: parseInt(json[key].Total),
                        imgHeight: 50,
                        title: key,
                        color: 'primary',
                        imgSrc: '/m/images/logos/' + key + '.png',
                        amount: '₹' + json[key].Income.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    };
                }); // Map to the 'Total' worked hours
                console.log("L101 pdata", pdata);
                setProjectsData(pdata);
                setProjectsReady(true);
                var edata = projectNames.map(key => {
                    return {
                        progress: parseInt(json[key].EstimatedTotalHours),
                        imgHeight: 50,
                        title: key,
                        color: 'info',
                        imgSrc: json[key].imgSrc || '/m/images/logos/' + key + '.png',
                        subtitle: json[key].subtitle || '',
                        amount: '₹' + json[key].EstimatedIncome.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    };
                }); // Map to the 'Total' worked hours
                setProjectsEstData(edata);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []); // Add dependencies here if needed

    /**
     * Get projects meta data like logos, hoourly rate, currency, description, etc
     */
    useEffect(() => {
        const fetchMetaData = async () => {
            const showall = false; // Adjust this based on your actual state or props
            const url = `${process.env.NEXT_PUBLIC_API_URL}/projects/meta?showall=${showall ? "1" : "0"}`;
            console.log("L126 url", process.env);

            let headers = new Headers();

            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');

            headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
            //headers.append('Access-Control-Allow-Credentials', 'true');

            headers.append('GET', 'POST', 'OPTIONS');

            try {
                const response = await fetch(url, {
                    //mode: 'no-cors',
                    method: 'GET',
                    headers: headers
                });
                const json = await response.json();
                var newProjectsData = [...projectsData];
                console.log("L146 resp", { newProjectsData, json });
                for (var j = 0; j < newProjectsData.length; j++) {
                    if (json[newProjectsData[j].title]) {
                        const p = json[newProjectsData[j].title];
                        console.log("L149 p", p);
                        newProjectsData[j].subtitle = p.subtitle;
                        newProjectsData[j].imgSrc = p.imgSrc;
                    }
                }
                console.log("L156 new newProjectsData", newProjectsData);
                setProjectsData(newProjectsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        console.log("L143 projectsData", projectsData);
        fetchMetaData();
    }, [projectsReady]); // Add dependencies here if needed


    const handleTaskClick = async (row, rowctr) => {
        console.log("L75 row", row);
        setShowAddTask(false);
        setShowStartTask(true);
        setActiveTask(row);
        setActiveRow(rowctr);
    }

    const handleTaskStartClick = async (row) => {
        // Fire POST API request with row data
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/now', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    project: row.project,
                    task: row.task,
                    start_time: new Date(),
                    log: row.project + ': ' + row.task,
                }),
            });

            // Check if request was successful
            if (response.ok) {
                // Navigate to the next page
                setShowAddTask(true);
                setShowStartTask(false);
            } else {
                // Handle error
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Call Pomodoro API to mark the start time
     */
    const callPomodoroApi = async () => {
        // Fire POST API request with row data
        try {
            const url = process.env.NEXT_PUBLIC_API_URL + '/now/pomodoro';
            console.log("L258 url", url);
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            console.log("L258 calling pomodoro api")
            // Check if request was successful
            if (response.ok) {
                // Navigate to the next page
                setTaskUpdateTimer(taskUpdateTimer + 1); //causes tasks to get updated
            } else {
                // Handle error
                console.error('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    /**
     * Handle pomodoro timer
     */
    const handlePomodoro = async (forceStart) => {
        const audio = new Audio('/m/mp3/ringtone-126505.mp3');
        if (forceStart || !pomodoroStatus) {
            setPomodoroStatus(true);
            global.pomodoroTime = 60 * 25;
            callPomodoroApi();
            //dont set if already set
            console.log("L314 pomodoroInterval", pomodoroInterval);
            if (!pomodoroInterval)
                setPomodoroInterval(setInterval(() => {
                    console.log("L317 pomo timer running", global.pomodoroTime);
                    if (global.pomodoroTime)
                        global.pomodoroTime -= 1;
                    const tleft = `${Math.floor(global.pomodoroTime / 60).toString().padStart(2, '0')}:${(global.pomodoroTime % 60).toString().padStart(2, '0')}`;
                    setPomoTimeLeft(tleft);
                    console.log("L250 pomo", global.pomodoroTime);
                    if (global.pomodoroTime <= 0) {
                        console.log("L252 pomo", global.pomodoroTime);
                        setPomodoroStatus(false);
                        global.pomodoroTime = 0;
                        clearInterval(pomodoroInterval);
                        setPomodoroInterval(null);
                        //audio.play().catch(error => console.log("Audio play error:", error));
                        //play audio only once
                        audio.play();
                        //pause after 10 secs
                        setTimeout(() => {
                            audio.pause();
                        }, 10000);
                    }
                }, 1000));
        }
        else {
            setPomodoroStatus(false);
            console.log("L262 pomo all cleared", global.pomodoroTime);
            clearInterval(pomodoroInterval);
            pomodoroInterval = null;
            setPomoTimeLeft('00:00');
            //audio.stop();
            audio.currentTime = 0;
            global.pomodoroTime = 0;
        }
    }

    return (
        <ApexChartWrapper>

            <Fab variant="extended" aria-label="start"
                onClick={() => handlePomodoro()}
                style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '250px',
                }}>
                <TomatoIcon />
                &nbsp;{pomoTimeLeft}
            </Fab>

            {showAddTask && <Link href="/cards">
                <Fab color="primary" aria-label="add" style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '70px',
                }}>
                    <MoreTimeIcon />
                </Fab>
            </Link>}

            {showStartTask &&
                <Fab variant="extended" color="primary" aria-label="start"
                    onClick={() => handleTaskStartClick(activeTask)}
                    style={{
                        position: 'fixed',
                        bottom: '40px',
                        right: '70px',
                    }}>
                    <ScheduleSendIcon />
                    {activeTask.project}
                </Fab>}

            <Grid container spacing={6}>
                <Grid item xs={12} md={4}>
                    <Trophy />
                </Grid>
                <Grid item xs={12} md={8}>
                    <StatisticsCard />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <WeeklyOverview hoursChartData={hoursChartData} />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <TotalEarning
                        title="Total Income"
                        totalIncome={totalIncome}
                        prevIncome={totalIncome - 10000}
                        percentageChange={42}
                        data={projectsData}
                    />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <TotalEarning
                        title="Total Estimated"
                        totalIncome={totalEstIncome}
                        prevIncome={totalEstIncome - 10000}
                        percentageChange={42}
                        data={projectsEstData}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Tasks
                        handleTaskClick={handleTaskClick}
                        activeRow={activeRow}
                        projectNames={projectNames}
                        rows={todayData} />
                </Grid>
                <Grid item xs={12}>
                    <Table />
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <Grid container spacing={6}>
                        <Grid item xs={6}>
                            <CardStatisticsVerticalComponent
                                stats='$25.6k'
                                icon={<Poll />}
                                color='success'
                                trendNumber='+42%'
                                title='Total Profit'
                                subtitle='Weekly Profit'
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CardStatisticsVerticalComponent
                                stats='$78'
                                title='Refunds'
                                trend='negative'
                                color='secondary'
                                trendNumber='-15%'
                                subtitle='Past Month'
                                icon={<CurrencyUsd />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CardStatisticsVerticalComponent
                                stats='862'
                                trend='negative'
                                trendNumber='-18%'
                                title='New Project'
                                subtitle='Yearly Project'
                                icon={<BriefcaseVariantOutline />}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <CardStatisticsVerticalComponent
                                stats='15'
                                color='warning'
                                trend='negative'
                                trendNumber='-18%'
                                subtitle='Last Week'
                                title='Sales Queries'
                                icon={<HelpCircleOutline />}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                    <SalesByCountries />
                </Grid>
                <Grid item xs={12} md={12} lg={8}>
                    <DepositWithdraw />
                </Grid>
            </Grid>
        </ApexChartWrapper>
    )
}

export default Dashboard
