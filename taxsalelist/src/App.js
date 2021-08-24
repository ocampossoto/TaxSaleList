import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from "@material-ui/core";
import React from "react";
import HouseCard from './HouseCard';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";
import MUIDataTable from "mui-datatables";
const columns = ["Action #", "Starting Bid", "Address", "Type"];
function App() {
  const [houses, setHouses] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [displayDialog, setDisplayDialog] = React.useState(false);
  const options = {
    filter: true,
    filterType: "select",
    responsive: "vertical",
    selectableRows: "none",
    print: false,
    download: false,
    expandableRows: false,
    sortOrder: { name: "Starting Bid", direction: "desc" },
    onRowClick: ((row) => {
      setSelected(row);
      setDisplayDialog(true);
    })
    // rowsSelected: value ===0? Default1: Default2,
  }
  const getHouseList = () => {
    fetch("https://ocampossoto.github.io/TaxSaleList/TaxSale349.json").then(res => {
      res.json().then(result => {
        let data = [];
        result.forEach(element => {
          data.push([
            element.actionNumber,
            parseFloat(element.startingBid.replace("$ ", "")),
            element.address,
            element.type,
            element.parcelS
          ])
        });
        setHouses(data);
      })
    })
  }
  React.useEffect(() => {
    getHouseList();
  }, [])
  console.log(houses);
  return (
    <Grid container spacing={5} direction="row" justify="center" display="center">
      {/* {houses?.map(house => {
        return <Grid xl={5} lg={5} md={6} sm={10} xs={10}justify="center" display="center" item key={house.actionNumber}>
          <HouseCard {...house} />
        </Grid>
      })} */}
      <MUIDataTable
        title={""}
        data={houses}
        columns={columns}
        options={options}
      />
    </Grid>
  );
}

export default App;
