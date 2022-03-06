import './adminHome.css'
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Axios from '../../constants/Axios'
import {errorToast} from '../../constants/toast'

export default function AdminHome(){
    const [listStatus,setStatus]=React.useState('approved')
    const [data,setData]=React.useState([])
    const [loading,setLoading]=React.useState(false)

    React.useEffect(()=>{
        setData([])
        setLoading(true)
        Axios.post('/users/get',{status:listStatus ==='approved'?true:false}).then(res=>{
            setLoading(false)
            if(res.data.status){
                setData(res.data.users)
            }else errorToast(res.data.message||"something wrong")
        }).catch(e=>{
            setLoading(false)
            errorToast("something wrong")
        })
    },[listStatus])

    return(
        <div className='admin-home-main' >
                <span onClick={()=>setStatus(listStatus==='approved'?'pending':'approved')}>{listStatus}</span>
            <div className='admin-table'>
                <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Shop name</TableCell>
            <TableCell align="right">Shop email</TableCell>
            <TableCell align="right">Lisence NO</TableCell>
            <TableCell align="right">Mobile</TableCell>
            <TableCell align="right">Reg date</TableCell>
            <TableCell align="right">Options</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
          !loading && data.length !==0 &&
          data.map((usr) => (
            <TableRow
              key={usr.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {usr.name}
              </TableCell>
              <TableCell align="right">{usr.shop?.name}</TableCell>
              <TableCell align="right">{usr.shop?.email}</TableCell>
              <TableCell align="right">{usr.shop?.lisenceNO}</TableCell>
              <TableCell align="right">{usr.mobile}</TableCell>
              <TableCell align="right">{new Date(usr.regDate).toLocaleDateString()}</TableCell>
              <TableCell align="right">{listStatus === 'pending'&&<button className="approve-btn">Approve</button> }<button className="user-delete-btn">Delete</button></TableCell>
            </TableRow>
          ))}
          {
              loading &&
              <TableCell align="right"> <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box></TableCell>

          }
          {
             !loading && data.length ===0 &&
              <TableCell align="right">NO Shopkeepers </TableCell>
          }
        </TableBody>
      </Table>
    </TableContainer>
            </div>
        </div>
    )
}