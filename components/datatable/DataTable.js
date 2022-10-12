import React, { useEffect, useRef, useState } from "react";

const DataTable = ({ headers, records, deleteRecord, editRecord }) => {
  const [data, setData] = useState([]);
  const [rowsPerPagesList, setRowsPerPagesList] = useState([
    5, 10, 20, 50, 100,
  ]);
  const [pageSize, setPageSize] = useState(rowsPerPagesList[0]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageNumbers, setPageNumbers] = useState([]);
  const [search, setSearch] = useState("");

  const [isSearchStart, setIsSearchStart] = useState(false);

  const scrollElement = useRef(null);

  const scrollRight = (value) => {
    scrollElement.current.scrollLeft += parseInt(value);
  };

  const scrollLeft = (value) => {
    scrollElement.current.scrollLeft -= parseInt(value);
  };

  useEffect(() => {
    // setData(records);
    pagination(currentPage);
    console.log("DataTable : ", records);
  }, [records.length]);

  const pagination = (pageNo) => {
    const filtered = records;
    if (search) {
      filtered = searchRecords(search);

      if (currentPage > totalPages || !isSearchStart) {
        setIsSearchStart(true);
        scrollLeft(35 * totalPages);
        pageNo = 1;
      }
    }

    // if(data.length === 1 && pageNo !== 1 && isSearchStart){
    //   pageNo = currentPage - 1;
    // }

    const startIndex = (pageNo - 1) * parseInt(pageSize);
    const endIndex = parseInt(startIndex) + parseInt(pageSize);
    console.log("startIndex : ", startIndex, " endIndex ", endIndex);
    const list = filtered.slice(startIndex, endIndex);

    // console.log('pagination()', endIndex, ' ', pageNo);
    setData(list);
    setCurrentPage(pageNo);
    getPageNo(filtered, pageNo);
    // alert(pageNo+', '+currentPage+', '+totalPages)
    console.log(
      "##pagination :- ",
      currentPage +
        ", " +
        totalPages +
        ", " +
        isSearchStart +
        ", " +
        data.length +
        ", " +
        pageNo
    );
  };

  const getPageNo = (filtered, pageNo) => {
    const pageCount = filtered ? Math.ceil(filtered.length / pageSize) : 0;
    console.log("pageCount : ", pageCount);

    let pageNoArray = [];
    for (let i = 1; i <= pageCount; i++) {
      pageNoArray.push(i);
    }

    console.log(
      "##getPageNo :- ",
      totalPages + ", " + pageCount + ", " + currentPage + ", " + data.length
    );
    // console.log(totalPages +' , '+currentPage)
    // console.log((totalPages < 7)+' , '+(totalPages <= currentPage))
    setTotalPages(pageCount);
    setPageNumbers(pageNoArray);
    // setCurrentPage(pageNo);
  };

  const searchRecords = (search) => {
    console.log(search);
    const filtered = records.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(search.toLowerCase())
      )
    );

    return filtered;
  };

  useEffect(() => {
    const filtered = searchRecords(search);
    setData(filtered);
    pagination(currentPage);

    // getPageNo(filtered);
  }, [search]);

  useEffect(() => {
    pagination(currentPage);
    // const list2 = (search)? filteredData : data;
    // getPageNo(list2);
  }, [pageSize]);

  // const tableData = data.map((val) => {
  //   return (
  //     <tr>
  //       <td> {val.productTypeId} </td>
  //       <td> {val.productTypeName} </td>
  //       <td></td>
  //     </tr>
  //   );
  // });

  const handleDateFormat = (date) => {
    var today = new Date(date);

    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + "/" + mm + "/" + yyyy;
    // console.log("handleDateFormat() : ", today);
    return today;
  };

  return (
    <div className="table-container">
      <div className="grid-container-3">
        <div className="grid-item-1">
          <span className="rows-per-page-label">Rows per page </span>
          <select
            name="rowsPerPage"
            id="rowsPerPage"
            className="rows-per-page"
            onChange={(e) => setPageSize(e.target.value)}
          >
            {rowsPerPagesList.map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>

        <div className="grid-item-2">
          <input
            type="serach"
            className="search-box"
            placeholder="Serach"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <i
            className={`fas fa-times ${search ? "clear-search" : ""}`}
            onClick={() => {
              setSearch("");
              setIsSearchStart(false);
            }}
          ></i>
        </div>
      </div>

      <div className="table-child-container">
        <table className="data-table">
          <thead>
            <tr>
              {headers.map((col, idx) => (
                <td
                  key={idx}
                  hidden={col.isVisible !== undefined ? !col.isVisible : false}
                >
                  {col["header"]}
                </td>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((val, idx) => (
              <tr key={idx}>
                {headers.map((col, idx) =>
                  col.headerId === "action" ? (
                    <td className="action-btn" key={idx}>
                      <i
                        className="fas fa-edit btn-edit"
                        onClick={() => editRecord(Object.values(val)[0])}
                      ></i>

                      <i
                        className="fas fa-trash-alt btn-delete"
                        onClick={() => deleteRecord(Object.values(val)[0])}
                      ></i>
                    </td>
                  ) : (
                    <td
                      key={idx}
                      hidden={
                        col.isVisible !== undefined ? !col.isVisible : false
                      }
                    >
                      {col.headerId.toLowerCase().includes("date") &&
                      val[col.headerId]
                        ? handleDateFormat(val[col.headerId])
                        : val[col.headerId]}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {data.length === 0 ? (
          <span className="no-data-found">No data available in table</span>
        ) : (
          ""
        )}
      </div>

      <nav className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => {
            scrollLeft(35 * totalPages);
            pagination(1);
          }}
        >
          First Page
        </button>
        <button
          className={`btn-scroll tooltip ${
            totalPages < 7 || currentPage === 1 ? "disabled" : ""
          }`}
          onClick={() => {
            scrollLeft(35);
            pagination(currentPage - 1);
          }}
        >
          <i className="fas fa-angle-double-left"></i>
          <span className="tooltiptext">Previous</span>
        </button>
        <div className="scroll-menu-container">
          <div className="scroll-menu" ref={scrollElement}>
            <ul className="pagination">
              {pageNumbers.map((pageNo, index) => (
                <li
                  key={index}
                  className={`${
                    pageNo === currentPage ? "page-item active" : "page-item"
                  }`}
                  onClick={() => pagination(pageNo)}
                >
                  <p className="page-link">{pageNo}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button
          className={`btn-scroll tooltip ${
            totalPages < 7 || totalPages <= currentPage ? "disabled" : ""
          }`}
          onClick={() => {
            scrollRight(35);
            pagination(currentPage + 1);
          }}
        >
          <i className="fas fa-angle-double-right"></i>
          <span className="tooltiptext">Next</span>
        </button>
        <button
          className="pagination-btn"
          onClick={() => {
            scrollRight(35 * totalPages);
            pagination(totalPages);
          }}
        >
          Last Page
        </button>
      </nav>
    </div>
  );
};

export default DataTable;
