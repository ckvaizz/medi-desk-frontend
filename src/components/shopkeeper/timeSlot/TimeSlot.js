import './timeSlot.css'
import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Axios from "../../../constants/Axios";
import { errorToast } from "../../../constants/toast";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Swal from "sweetalert2";
import MenuItem from "@mui/material/MenuItem";


export default function TimeSlot(){
const [time,setTime]=React.useState((new Date().getHours() >12)?new Date().getHours()-12:new Date().getHours())
const [data,setData]=React.useState([])
const [loading,setLoading]=React.useState(false)
const [arr, _] = React.useState([9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8])
    React.useEffect(()=>{
        setLoading(true)
        Axios.get(`/medi/view-slot/${time}`).then(res=>{
            setLoading(false)
            if(res.data.status){
                setData(res.data.slots)
            }else{
                errorToast(res.data.message ||"something wrong")
            }
        }).catch(e=>{
            setLoading(false)
         })
    },[time])

    return(
        <div className="sk-timeslot-main">
        <span>
        <InputLabel htmlFor="max-width">Select Time</InputLabel>
              <Select
                onChange={(e) => {
                  setTime(e.target.value)
                }}
                label="Time"
                inputProps={{
                  name: "Time",
                  id: "max-width",
                }}
              >
                {
                  arr.map(i=> <MenuItem value={i}>{i}</MenuItem>)
                }
                  
                
              </Select>
        </span>
        <div className="sk-timeslot">
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Medicine</TableCell>
                  <TableCell align="right">Company name</TableCell>
                  <TableCell align="right">Dose|Quandity</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  data.length !== 0 &&
                  data.map((odr) => (
                    <TableRow
                      key={odr.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {odr.name}
                      </TableCell>
                      <TableCell align="right">{odr.cart.map(i=> i.name+" |")}</TableCell>
                      <TableCell align="right">{odr.cart.map(i=> i.companyName+" |")}</TableCell>
                      <TableCell align="right">{odr.cart.map(i=> {
                        return(
                          <>
                          {i.dose.dose},{i.dose.quandity} |
                          </>
                        )
                      })}</TableCell>
                     
                     
                      
                    </TableRow>
                  ))}
                {loading && (
                  <TableCell align="right">
                    {" "}
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress />
                    </Box>
                  </TableCell>
                )}
                {!loading && data.length === 0 && (
                  <TableCell align="right">Nothing found... </TableCell>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    )
}