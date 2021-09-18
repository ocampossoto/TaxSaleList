import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import parser from 'parse-address';
function App() {
  const [sortedData, setSortedData] = React.useState({});
  React.useEffect(() => {
    fetch("https://ocampossoto.github.io/TaxSaleList/TaxSale349.json").then(res => {
      res.json().then(result => {
        let tempSortedData = {};
        result.forEach(element => {
          if (!sortCondition(element.type)) {
            return;
          }
          let address = parser.parseAddress(element.address);
          if (tempSortedData[address.zip] === undefined) {
            tempSortedData[address.zip] = [];
          }
          tempSortedData[address.zip].push(element);
          tempSortedData[address.zip].sort((a, b) => {
            if (parseFloat(a.startingBid.replace("$ ", "")) < parseFloat(b.startingBid.replace("$ ", ""))) {
              return -1
            } else {
              return 1;
            }
          });
        });
        setSortedData(tempSortedData);
      })
    })
  }, [])
  const sortCondition = (value) => {
    if (value === "I") {
      return true;
    }
    return false;
  }
  const getHouseButtons = (houseList) => {
    let btnsData = [""];
    let cnt = 0;
    let addressCnt = 0;
    for (let i = 0; i < houseList.length; i++) {
      if (sortCondition(houseList[i].type)) {
        if (addressCnt === 19) {
          cnt++;
          addressCnt = 0;
          btnsData.push("");
        }
        btnsData[cnt] += houseList[i].address + "\n";
        addressCnt++;
      }
    }
    return btnsData.map((item, id) => <Button
      variant="contained"
      style={{ margin: "1%" }}
      onClick={() => { navigator.clipboard.writeText(item) }} >
      Copy set {id + 1}
    </Button>
    )

  }
  return (
    <Grid container spacing={5} direction="row" justify="center" display="center">
      {Object.keys(sortedData).map((key) => {
        let houseList = sortedData[key];
        return <Grid item md={5}>
          <Typography variant="h5">{key}</Typography>
          {getHouseButtons(houseList)}
          {houseList.map((house) => {
            if (sortCondition(house.type)) {
              return <Grid container>
                <Grid item>
                  <Typography><b>{house.actionNumber}</b>: {house.address} ({house.startingBid})</Typography>
                </Grid>
              </Grid>
            }
            else{ return null}
          })}
        </Grid>
      })}
    </Grid>
  );
}

export default App;
