import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';
import SellIcon from '@mui/icons-material/Sell';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RecipeReviewCard({item}) {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card  variant="outlined" style={{ padding: 0,border: "none", boxShadow: "none" , backgroundColor:"#1B3447"}}> 
      <CardMedia
        component="img"
        height="194"
        image={item.image}
        alt="Paella dish"
      />

      <CardHeader
        title={item.productName}
        titleTypographyProps={{color:'#FFAD35'}}
        subheader={item.price + ' ' + item.currency}
        subheaderTypographyProps={{color:'#B6B6B6'}}
      />
    
      <CardContent>
        <Typography variant="body2" color="#B6B6B6">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        {/* <Button variant="contained" style={{width: 'auto'}} startIcon={<SellIcon htmlColor="yellow" />}>
        Mua ngay
        </Button> */}
            <Button variant="contained"  style={{width: '100%', color: 'black',backgroundColor:'#FFC107', fontWeight: 'bold'}} startIcon={<SellIcon />}>
        Mua ngay
        </Button>
      </CardActions>
    </Card>
  );
}
