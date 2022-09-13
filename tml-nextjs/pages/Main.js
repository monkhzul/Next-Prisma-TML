import React, { useRef, useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Image from "next/image";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import AsyncSelect from "react-select/async";
import { ToastContainer, toast } from "react-toastify";
import style from "../styles/style.module.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "rsuite/DatePicker";
import "rsuite/dist/rsuite.css";
import ClipLoader from 'react-spinners/PulseLoader'
import { useRouter } from 'next/router';
 
function Main(datas) {
    const [data, setData] = useState(datas.data.db);
    const [loading, setLoading] = useState(false)
    const [userChoice, setUserChoice] = useState("");
    const [day, setDay] = useState(datas.data.db);
    const [trade, setTrade] = useState(datas.data.trade);
    const router = useRouter();
      
    useEffect(() => {
       setLoading(true)
       setTimeout(() => {
        setLoading(false)
       }, 500)
    }, [])
    
    var array = [];
        for (let i = 0; i < trade.length; i++) {
            array.push({
                value: trade[i].TradeShopId,
                label: trade[i].Name,
            });
        }

    const inputRef = useRef(null);

    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const [startdate, setStartDate] = useState(firstDay);
    const [enddate, setEndDate] = useState(date);

    // useEffect(() => {
    //     const get = async () => {
    //         setLoading(true)
    //         const req = await fetch("/api/db");
    //         const res = await req.json();
    //         setData(res);
    //         setDay(res);
    //         setLoading(false)
    //     };
    //     get();
    // }, []);

    const [pageNumber, setPageNumber] = useState(0);

    const perPage = 25;
    const pagesVisited = pageNumber * perPage;

    const handleClick = () => {
        inputRef.current.click();
    };

    var id = [];
    trade.forEach(x => {
        id.push(x.TradeShopId)
    })

    const handleChange = (selectedOption) => {
        setUserChoice(selectedOption);
    }

    const loadOptions = (searchValue, callback) => {
        setTimeout(()=> {
            const filteredOptions = array.filter((option) => 
            option.label.toLowerCase().includes(searchValue.toLowerCase()))
            callback(filteredOptions)
        }, 1000)
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        function insertMany() {

            var count = 0;
            for (let i = 0; i < jsonData.length; i++) {
                if (id.includes(jsonData[i].tradeshopid)) {
                    count += 1;
                }
            }

            if (count == jsonData.length) {
                setLoading(true)
                for (var i in jsonData) {
                    var response = fetch("/api/data/insert", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            tradeshopid: `${jsonData[i].tradeshopid}`,
                            mmonth: `${date.getFullYear() + '-' + (date.getMonth() + 1)}`,
                            discounttype: "6",
                            Amount: jsonData[i].Amount,
                            state: 0,
                            createUser: "user",
                        }),
                    })
                }
                response.then((res) => {
                    if (res.ok) {
                        router.reload();
                        toast("Амжилттай!");
                        // router.reload(router.asPath)
                        setLoading(false)
                    }
                    else {
                        toast("Амжилтгүй! Буруу өгөгдөл орсон байна.");
                        setLoading(false)
                    }
                });
            }
            else {
                toast("Харилцагч олдсонгүй! Харилцагчийн ID-гаа шалгана уу!")
            }
        }
        insertMany();
    };

    const insertOne = (e) => {
        e.preventDefault();
        const priceValue = document.getElementById("price")
        const price = priceValue.value;

        console.log(userChoice)

        if (userChoice.value != undefined) {
            if (price != '' && price != 0) {
                setLoading(true)
                const insert = () => {
                        fetch("/api/data/insert", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                tradeshopid: `${userChoice.value}`,
                                mmonth: `${date.getFullYear() + '-' + (date.getMonth() + 1)}`,
                                discounttype: "6",
                                Amount: price,
                                state: 0,
                                createUser: "",
                            }),
                        }).then((res) => {
                            if (res.ok) {
                                router.reload();
                                toast("Амжилттай!");
                                // router.reload(router.asPath)
                                priceValue.value = ''; 

                                setLoading(false)
                            } else {
                                toast("Амжилтгүй! Буруу өгөгдөл орсон байна.");
                                setLoading(false)
                            }
                        })
                };
                insert();
            }
            else {
                toast("Үнийн дүнг оруулна уу!")
            }
        }
        else {
            toast("Харилцагч сонгоно уу!")
        }
    };


    const pageCount = Math.ceil(day.length / perPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    useEffect(() => {
        const start = new Date(startdate).toDateString()
        const end = new Date(enddate).toDateString()
        console.log(start, end);
    }, [])

    const defaultDate = () => {
            const result = data.filter((d) => {
                var time = new Date(d.createdate);
                return (
                    ( isNaN( startdate ) && isNaN( enddate ) ) ||
                    ( isNaN( startdate ) && time <= enddate ) ||
                    ( startdate <= time && isNaN( enddate ) ) ||
                    ( startdate <= time && time <= enddate ) ||
                    ( startdate.getDate() <= time.getDate() && time.getDate() <= enddate.getDate())
                );
            });
            setDay(result);
    }

    setTimeout(() => {
        defaultDate()
    }, 500)

    const chosenDate = () => {
        if (startdate != null && enddate != null) {
            const result = data.filter((d) => {
                var time = new Date(d.createdate);
                return (
                    ( isNaN( startdate ) && isNaN( enddate ) ) ||
                    ( isNaN( startdate ) && time <= enddate ) ||
                    ( startdate <= time && isNaN( enddate ) ) ||
                    ( startdate <= time && time <= enddate ) ||
                    ( startdate.getDate() <= time.getDate() && time.getDate() <= enddate.getDate()) 
                )
            });
            setDay(result);
        } else {
            toast("Огноог оруулна уу!")
        }
    };

    const sortedDesc = day.sort(
        (objA, objB) =>
            new Date(objB.createdate) - new Date(objA.createdate)
    );

    const display = sortedDesc
        .slice(pagesVisited, pagesVisited + perPage)
        .map((data, i) => {
            return (
                <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.tradeshopid}</td>
                    <td>{data.Name}</td>
                    <td>{(data.Amount).toLocaleString()} ₮</td>
                    <td>{data.createdate}</td>
                </tr>
            );
        });

    const arr = [];

    for (var i in day) {
        arr.push({
            tradeshopid: day[i].tradeshopid,
            amount: day[i].Amount,
            createDate: day[i].createdate,
            mmonth: `${date.getDate() < 10 ? date.getFullYear() + '0' + (date.getMonth() + 1) 
            : date.getFullYear() + (date.getMonth() + 1)}`,
        })
    }

    return (
        <div className={`${style.App} p-3`}>
            <div className={`head flex flex-col sm:flex-row w-full`}>
                <form
                    action=""
                    className={`${style.customerForm} flex flex-col w-full sm:w-2/3`}
                >
                    <div className={`w-full flex justify-around`}>
                        <div className={`flex flex-col w-[40%] ${style.customerForm}`}>
                            <label htmlFor="" className="mx-1 my-1 font-semibold">
                                Харилцагч
                            </label>
                            
                            {/* <Select
                                options={options}
                                onChange={(choice) => setUserChoice(choice)} 
                                styles={style.reactSelect}
                                isClearable
                                LoadingMessage={() => 'searching...'}
                            /> */}
                            <AsyncSelect
                                // defaultOptions={options}
                                defaultOptions
                                loadOptions={loadOptions}
                                onChange={handleChange}
                                isClearable
                                cacheOptions
                                placeholder="Харилцагч сонгох ..."
                                styles={{cursor: "pointer"}} 
                            />
                            
                        </div>
                        <div className={`flex flex-col w-[40%] ${style.customerForm}`}>
                            <label htmlFor="" className={`mx-1 my-1 font-semibold`}>
                                Үнийн дүн
                            </label>
                            <input
                                type="number"
                                name=""
                                id="price"
                                className={`border p-2 ${style.price}`}
                                placeholder="Үнийн дүн"
                            />
                        </div>
                    </div>
                    <button
                        className={`border cursor-pointer w-1/3 p-2 my-3 mx-auto font-semibold flex justify-center hover:bg-slate-200`}
                        onClick={insertOne}
                    >
                        Илгээх
                    </button>
                </form>

                <ToastContainer 
                       position="top-right"
                       newestOnTop={false}
                       closeOnClick
                       autoClose={1500}
                />

                <div
                    className={`${style.customerForm} w-full sm:w-1/2 flex justify-around items-center`}
                >
                    <input
                        className={`d-none`}
                        type="file"
                        id="file"
                        ref={inputRef}
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={(e) => handleFileChange(e)}
                    />
                    <button
                        type="file"
                        id="fileSelect"
                        className="border lg:h-[30%] w-[40%] px-3 font-semibold hover:bg-slate-200"
                        onClick={handleClick}
                    >
                        Листээр оруулах
                    </button>

                    <button
                        type="submit"
                        className={`border lg:h-[30%] w-[40%] px-3 flex items-center hover:bg-green-200 bg-slate-200`}
                    >
                        <CSVLink
                            data={arr}
                            filename="TML.csv"
                            className={`text-black font-semibold no-underline w-full flex justify-center`}
                        >
                            <Image
                                src="/excel.svg"
                                alt=""
                                width={40}
                                height={10}
                                className={`p-1 sm:p-0 mr-2`}
                            />
                            <p className={`my-auto font-semibold`}> Export To Excel </p>
                        </CSVLink>
                    </button>
                </div>
            </div>

            <div
                className={`flex flex-col justify-end w-full items-center mt-[25%] sm:flex-row sm:mt-0`}
            >
                <div className="flex items-center justify-center w-full lg:w-[50%] xl:w-[40%]">
                    <div className="w-full sm:w-1/3">
                        <DatePicker
                            size="lg"
                            value={startdate}
                            onChange={(date) => { setStartDate(date); }}
                            startdate={startdate}
                            className='w-full'
                        />
                    </div>
                    <div className="flex">
                        <p className="px-2 my-auto mx-auto">to</p>
                    </div>
                    <div className="w-full sm:w-1/3">
                        <DatePicker
                            size="lg"
                            value={enddate}
                            onChange={(date) => { setEndDate(date); }}
                            enddate={enddate}
                            className='w-full'
                        />
                    </div>
                </div>

                {/* <div
          className={`flex px-4 py-1 ml-5 rounded-md bg-slate-200 font-semibold text-gray-600
                                                 hover:text-white hover:bg-slate-600 mt-[5%] sm:mt-0 cursor-pointer`}
          onClick={chosenDate}
        >
          Харах
        </div> */}
            </div>

            <div className={`body mt-5`}>
                {loading ? <div className="flex">
                                <ClipLoader 
                                    size={20}
                                    color={"#3dbee3"}
                                    loading={loading}
                                    className={"w-full flex justify-center"}
                                />
                            </div> : 
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Харилцагчийн ID</th>
                            <th>Харилцагчийн нэр</th>
                            <th>Үнийн дүн</th>
                            <th>Он сар өдөр</th>
                        </tr>
                    </thead>
                    <tbody className={`w-full`}>
                       {display}
                    </tbody>
                </Table>
                }
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
    );
}

export default Main

