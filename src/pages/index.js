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

  useEffect(() => {
    const fetchData = async () => {
      const showall = false; // Adjust this based on your actual state or props
      const url = `${process.env.NEXT_PUBLIC_API_URL}/now/today?showall=${showall ? "1" : "0"}`;
      console.log("L41 url", url);

      let headers = new Headers();

      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');

      //headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
      //headers.append('Access-Control-Allow-Credentials', 'true');

      //headers.append('GET', 'POST', 'OPTIONS');

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
          if (json[i].spent_time_secs == 0) {
            json.splice(i, 1);
            i--;
            continue;
          }

          json[i].hours = Math.round(json[i].spent_time_secs / 3600);
        }
        setTodayData(json);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Add dependencies here if needed

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
          return {
            progress: parseInt(json[key].Total),
            imgHeight: 50,
            title: key,
            color: 'primary',
            imgSrc: '/images/logos/' + key + '.png',
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
            imgSrc: json[key].imgSrc || '/images/logos/' + key + '.png',
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


  const handleTaskClick = (row) => {
    console.log("L75 row", row);
    setShowAddTask(false);
    setShowStartTask(true);
    setActiveTask(row);
  }

  return (
    <ApexChartWrapper>
      {showAddTask && <Link href="/cards">
        <Fab color="primary" aria-label="add" style={{
          position: 'fixed',
          bottom: '40px',
          right: '70px',
        }}>
          <MoreTimeIcon />
        </Fab>
      </Link>}

      {showStartTask && <Link href="/cards">
        <Fab variant="extended" color="primary" aria-label="start" style={{
          position: 'fixed',
          bottom: '40px',
          right: '70px',
        }}>
          <ScheduleSendIcon />
          {activeTask.project}
        </Fab>
      </Link>}

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
          <Tasks handleTaskClick={handleTaskClick} rows={todayData} />
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
