import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import fajr from '../../public/fajr-prayer.png';
export default function MediaCard({name,time,image}) {
  return (
    <Card sx={{ width: 300 }}>
      <CardMedia
        sx={{ height: 140 }}
        image={image}
        title="green iguana"
      />
      <CardContent >
        <Typography gutterBottom variant="h5" component="div">
            {name}
        </Typography>
        <Typography style={{textAlign:'center'}} variant="h3" color="text.secondary">
          {time}
        </Typography>
      </CardContent>
    </Card>
  );
}