import React, { useRef, useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Image from "next/image";
import * as XLSX from "xlsx";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import Select from "react-select";
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
    const [loadingSelect, setLoadingSelect] = useState(false)
    const [userChoice, setUserChoice] = useState("");
    const [day, setDay] = useState(datas.data.db);
    const [trade, setTrade] = useState(datas.data.trade);
    const [ok, setOk] = useState("");
    const [options, setOptions] = useState([]);
    const {render, setRender} = datas.render
    const router = useRouter();
      
    useEffect(() => {
       setLoading(true)
       setTimeout(() => {
        setLoading(false)
       }, 500)
    }, [])
    
    // trade.map(trade => {
    //     options.push({
    //         value: trade.TradeShopId,
    //         label: trade.Name,
    //     });
    // })

    var array = [];
    useEffect(() => {
        trade.map(trade => {
            array.push({
                value: trade.TradeShopId,
                label: trade.Name,
            });
        })
        setOptions(array)
    }, [])

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
        console.log("click");
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
            const filteredOptions = options.filter((option) => 
            option.label.toLowerCase().includes(searchValue.toLowerCase()))
            callback(filteredOptions)
        }, 2000)
    }

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        function insert() {

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
                        router.reload("/");
                        toast("Амжилттай!");

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
        insert();
    };

    const Send = (e) => {
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
                                router.reload("/");
                                toast("Амжилттай!");
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

    const first = () => {
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
        first()
    }, 100)

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
                <tr key={i + 1}>
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
                                defaultOptions={options}
                                loadOptions={loadOptions}
                                onChange={handleChange}
                                isClearable
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
                        onClick={Send}
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
                <div className="flex items-center sm:w-[30%] justify-start">
                    <div>
                        <DatePicker
                            size="lg"
                            value={startdate}
                            onChange={(date) => { setStartDate(date); }}
                            startdate={startdate}
                        />
                    </div>
                    <div className="flex">
                        <p className="px-2 my-auto mx-auto">to</p>
                    </div>
                    <div className="">
                        <DatePicker
                            size="lg"
                            value={enddate}
                            onChange={(date) => { setEndDate(date); }}
                            enddate={enddate}
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
                            <th>TradeShopID</th>
                            <th>Нэр</th>
                            <th>Үнийн дүн</th>
                            <th>Огноо</th>
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

