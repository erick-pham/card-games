import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from './Card'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const data= [{
  productName: 'ACC1',
  price: 15000,
  currency: 'VND',
  status: 'New',
  image: 'https://picsum.photos/300/200'
},
{
  productName: 'ACC1 test',
  price: 15000,
  currency: 'VND',
  status: 'Sale',
  image: 'https://picsum.photos/300/200'
},
{
  productName: 'ACC1',
  price: 1500,
  currency: 'USD',
  status: 'Sale',
  image: 'https://picsum.photos/300/200'
},
{
  productName: 'ACC1',
  price: 15000,
  currency: 'VND',
  status: 'Sale',
  image: 'https://picsum.photos/300/200'
},
{
  productName: 'ACC1',
  price: 15000,
  currency: 'VND',
  status: 'Sold out',
  image: 'https://picsum.photos/300/200'
}]
export default function BasicGrid() {
  
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        {data.map((item, index)=>{
          return <Grid item xs={12} sm={6} md={3} key={index}>
          <Item><Card item={item}/></Item>
        </Grid>
        })}
      </Grid>
    </Box>
  );
}
