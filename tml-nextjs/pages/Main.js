import React, { useRef, useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Image from "next/image";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import ReactPaginate from "react-paginate";
import { CSVLink } from "react-csv";
import $, { ready } from "jquery";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import style from "../styles/style.module.css";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "rsuite/DatePicker";
import "rsuite/dist/rsuite.css";

export default function Main(props) {
  const [data, setData] = useState([]);
  const [importData, setImportData] = useState([]);

  const inputRef = useRef(null);
  const [status, setStatus] = useState("");

  const date = new Date();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [userChoice, setUserChoice] = useState("");
  const [day, setDay] = useState([]);

  useEffect(() => {
    const get = async () => {
      const req = await fetch("http://localhost:3000/api/db");
      const res = await req.json();
      setData(res);
      setDay(res);
    };
    get();
  }, []);

  const [pageNumber, setPageNumber] = useState(0);

  const perPage = 25;
  const pagesVisited = pageNumber * perPage;

  const handleClick = () => {
    inputRef.current.click();
    console.log("click");
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    setImportData(jsonData);

    function insert() {
      for (var i in jsonData) {
        fetch("http://localhost:3000/api/data/insert", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tradeshopid: jsonData[i].id,
            mmonth: "mmonth",
            discounttype: jsonData[i].dis,
            Amount: jsonData[i].amount,
            state: 1,
            createdate: new Date(),
            createUser: "many",
          }),
        }).then((res) => {
          if (res.ok) {
            toast("Амжилттай!");
          } else {
            toast("Амжилтгүй! Буруу өгөгдөл орсон байна.");
          }
        });
      }
    }
    insert();
  };

  const pageCount = Math.ceil(day.length / perPage);

  const Send = () => {
    const price = document.getElementById("price").value;

    console.log(userChoice.value, price);

    const insert = () => {
      fetch("http://localhost:3000/api/data/insert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tradeshopid: userChoice.value,
          mmonth: "mmonth",
          discounttype: "type",
          Amount: price,
          state: 1,
          createdate: new Date(),
          createUser: "one",
        }),
      }).then((res) => {
        if (res.ok) {
          toast("Амжилттай!");
        } else {
          toast("Амжилтгүй! Буруу өгөгдөл орсон байна.");
        }
      });
    };
    insert();
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const chosenDate = () => {
    console.log(startDate);
    if (startDate != null && endDate != null) {     
        const result = data.filter((d) => {
          var time = new Date(d.createdate);
            
            return (
              startDate.getMonth() + 1 <= time.getMonth() + 1 &&
              startDate.getDate() <= time.getDate() &&
              endDate.getMonth() + 1 >= time.getMonth() + 1 &&
              endDate.getDate() >= time.getDate()
            );
          
        });
        setDay(result);
    } else {
        toast("Огноог оруулна уу!")
    }

  };

  const display = day
    .slice(pagesVisited, pagesVisited + perPage)
    .map((data, i) => {
      return (
        <tr key={i+1}>
          <td>{i + 1}</td>
          <td>{data.tradeshopid}</td>
          <td>{data.createUser}</td>
          <td>{data.mmonth}</td>
          <td>{data.createdate}</td>
        </tr>
      );
    });

  const options = [];

  for (let i = 0; i < data.length; i++) {
    options.push({
      value: data[i].tradeshopid,
      label: data[i].tradeshopid,
    });
  }

  const arr = [];

  for(var i in day) {
      arr.push({
        tradeshopid: day[i].tradeshopid,
        amount: day[i].Amount,
        user: day[i].createUser,
        createDate: day[i].createdate 
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
              <Select
                options={options}
                onChange={(choice) => setUserChoice(choice)}
              />
            </div>
            <div className={`flex flex-col w-[40%] ${style.customerForm}`}>
              <label htmlFor="" className={`mx-1 my-1 font-semibold`}>
                Үнийн дүн
              </label>
              <input
                type="text"
                name=""
                id="price"
                className={`border p-2 ${style.price}`}
                placeholder="Үнийн дүн"
              />
            </div>
          </div>
          <div
            className={`border w-1/3 p-2 my-3 mx-auto font-semibold flex justify-center hover:bg-slate-200`}
            onClick={Send}
          >
            Илгээх
          </div>
        </form>

        <ToastContainer />

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
              {/* w-[30%] sm:w-[50%] md:w-[25%] xl:w-[15%] */}
              <p className={`my-auto font-semibold`}> Export To Excel </p>
            </CSVLink>
          </button>
        </div>
      </div>

      <div
        className={`flex flex-col justify-end w-full items-center mt-[25%] sm:flex-row sm:mt-0`}
      >
        <div className="flex items-center sm:w-[30%] justify-between">
          <div>
            <DatePicker
              size="lg"
              value={startDate}
              onChange={(date) => {
                setStartDate(date);
              }}
              startDate={startDate}
            />
          </div>
          <div className="flex">
            <p className="px-2 my-auto mx-auto">to</p>
          </div>
          <div className="">
            <DatePicker
              size="lg"
              value={endDate}
              onChange={(date) => {
                setEndDate(date);
              }}
              endDate={endDate}
            />
          </div>
        </div>

        <div
          className={`flex px-4 py-1 ml-5 rounded-md bg-slate-200 font-semibold text-gray-600
                                                 hover:text-white hover:bg-slate-600 mt-[5%] sm:mt-0 cursor-pointer`}
          onClick={chosenDate}
        >
          Харах
        </div>
      </div>
       
      {/* {console.log(startDate > endDate ? 'start' : "end")} */}
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
          <tbody className={`w-full`}>{display}</tbody>
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
  );
}
