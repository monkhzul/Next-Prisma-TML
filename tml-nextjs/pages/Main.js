import React, { useRef, useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import Image from 'next/image'
import * as XLSX from 'xlsx'
import ReactPaginate from "react-paginate"
import { CSVLink } from 'react-csv'
import $ from 'jquery'
import Select from 'react-select'
import style from '../styles/style.module.css'
import 'react-datepicker/dist/react-datepicker.css'
import DatePicker from 'rsuite/DatePicker'
import 'rsuite/dist/rsuite.css';

export default function Main() {
    const [data, setData] = useState([]);
    const [importData, setImportData] = useState([]);

    const inputRef = useRef(null);

    useEffect(() => {
        const get = async () => {
            const req = await fetch('http://localhost:3000/api/db');
            const res = await req.json();
            setData(res);
        }
        get();
    }, [])

    const [pageNumber, setPageNumber] = useState(0);

    const perPage = 25;
    const pagesVisited = pageNumber * perPage;

    const handleClick = () => {
        inputRef.current.click();
        console.log("click")
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        setImportData(jsonData)
    };

    const pageCount = Math.ceil(data.length / perPage);

    const Send = () => {
        const customer = document.getElementById("select").value;
        const price = document.getElementById("price").value;

        console.log(price)
    }

    const changePage = ({ selected }) => {
        setPageNumber(selected)
    }

    console.log(importData !== '' ? importData[0].Firstname : '')

    const display = data.slice(pagesVisited, pagesVisited + perPage)
        .map((data, i) => {
            return (
                <tr>
                    <td>{i + 1}</td>
                    <td>{data.TradeShopId}</td>
                    <td>{data.Name}</td>
                    <td>{data.FullAddress}</td>
                    <td>{data.DateRemove}</td>
                </tr>
            )
        })

    const options = [];

    for (let i = 0; i < data.length; i++) {
        options.push({
            value: data[i].Name,
            label: data[i].Name
        })
    }

    const [value, setValue] = useState([null, null]);

    const date = new Date();
    const today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()

    const [startDate, setStartDate] = useState(date);
    const [endDate, setEndDate] = useState("");

    return (
        <div className={`${style.App} p-3`}>
            <div className={`head flex flex-col sm:flex-row w-full`}>
                <form action="" className={`${style.customerForm} flex flex-col w-full sm:w-2/3`}>
                    <div className={`w-full flex justify-around`}>
                        <div className={`flex flex-col w-[40%] ${style.customerForm}`}>
                            <label htmlFor="" className='mx-1 my-1'>Харилцагч</label>
                            <Select
                                options={options}
                            />
                        </div>
                        <div className={`flex flex-col w-[40%] ${style.customerForm}`}>
                            <label htmlFor="" className={`mx-1 my-1`}>Үнийн дүн</label>
                            <input type="text" name="" id="price" className={`border p-2 ${style.price}`} placeholder='Үнийн дүн' />
                        </div>
                    </div>
                    <button type="submit" className={`border w-1/3 p-2 my-3 mx-auto font-semibold hover:bg-slate-200`}>Илгээх</button>
                </form>

                <div className={`${style.customerForm} w-full sm:w-1/2 flex justify-around items-center`}>
                    <input className={`d-none`} type="file" id='file' ref={inputRef} accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={(e) => handleFileChange(e)} />
                    <button type="file" id="fileSelect" className='border lg:h-[30%] w-[40%] px-3 font-semibold hover:bg-slate-200' onClick={handleClick}>Листээр оруулах</button>

                    <button type="submit" className={`border lg:h-[30%] w-[40%] px-3 flex items-center hover:bg-slate-200`}>
                        <CSVLink data={data} className={`text-black font-semibold no-underline w-full flex justify-center`}>
                            <Image src="/excel.svg" alt="" width={40} height={10} className={`p-1 sm:p-0 mr-2`} />
                            {/* w-[30%] sm:w-[50%] md:w-[25%] xl:w-[15%] */}
                            <p className={`my-auto font-semibold`}> Export To Excel </p>
                        </CSVLink>
                    </button>
                </div>
            </div>

            <div className='border'>
                {importData.map(data => 
                    <div className='flex'>
                        <p className='mx-2'>{data.Firstname}</p>
                        <p className='mx-2'>{data.Lastname}</p>
                        <p className='mx-2'>{data.Email}</p>
                    </div>
                )}
            </div>

            <div className={`flex flex-col justify-end w-full items-center mt-[25%] sm:flex-row sm:mt-0`}>

                <div className='w-full flex items-center sm:w-1/4 justify-between'>
                    <div>
                        <DatePicker 
                            size='lg'
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                            startDate={startDate}
                        />
                    </div>
                    <div className='flex'>
                        <p className='px-2 my-auto mx-auto'>to</p>
                    </div>
                    <div className=''>
                        <DatePicker 
                            size='lg'
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                            endDate={endDate}
                        />
                    </div>
                </div>
                {/* <button type='submit' className={`px-5 py-1 ml-5 border rounded-md bg-slate-200 font-semibold text-gray-600
                                                 hover:text-white hover:bg-slate-600 mt-[5%] sm:mt-0`}>Харах</button> */}
            </div>
            {console.log(startDate > endDate ? 'start' : "end")}
            <div className={`body mt-5`}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>Нэр</th>
                            <th>Хаяг</th>
                            <th>Огноо</th>
                        </tr>
                    </thead>
                    <tbody className={`w-full`}>
                        {display}
                    </tbody>
                </Table>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    pageCount={pageCount}
                    onPageChange={changePage}
                    containerClassName={style.paginationBttns}
                    previousLinkClassName={style.previousBttn}
                    nextLinkClassName={style.nextBttn}
                    disabledClassName={style.paginationDisabled}
                    activeClassName={style.paginationActive}
                />
            </div>
        </div>
    )
}
