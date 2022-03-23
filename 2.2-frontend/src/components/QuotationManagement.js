import React, { useEffect, useState, useRef } from "react";
import { Container, Table, Button, Modal, Form, Row, Col} from "react-bootstrap";
import {Link } from "react-router-dom";
import { FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";
import style from "../mystyle.module.css";

import Quotation from "./Quotation";

export default function QuotationManagement() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [quotations, setQuotations] = useState([]);
  const [quotationRows, setQuotationRows] = useState([]);
  const [show, setShow] = useState(false);
  const [modeAdd, setModeAdd] = useState(false);
  const [totalAmountSold, setTotalAmountSold] = useState(0);
  
  const [quotation, setQuotation] = useState({
    date: "",
    item: "",
    quantity: 0,
    price: 0,
    total: 0
  });

  // Input References
  const refDate = useRef();
  const refItem = useRef();
  const refQuantity = useRef();
  const refPrice = useRef();
  const refTotal = useRef();

  useEffect(() => {
    fetch(`${API_URL}/quotations`)
      .then((res) => res.json())
      .then((data) => {
        data.sort(function(a,b){
        return a.date - b.date;
        });
        let totalAmount = 0
        const rows = data.map((e,i) => {
          let amount = e.total;
          totalAmount += amount;
          return (
            <tr key={i}>
              <td style={{width: '40px'}}>
                {/* add icons (make sure to import first) */}
                {/*<FaPencilAlt onClick={() => {handleUpdate(e)}} />
                {/* ways to create empty space */}
                &nbsp; {/* {' '} */}
                <FaTrashAlt onClick={() => {handleDelete(e)}} /> 
              </td>
              <td>{e.date}</td>
              <td>{e.item}</td>
              <td style={{textAlign:'right'}}>{e.quantity}</td>
              <td style={{textAlign:'right'}}>{e.price}</td>
              <td style={{textAlign:'right'}}>{e.total}</td>
            </tr>
          );
        });

        setTotalAmountSold(totalAmount);
        setQuotations(data);
        setQuotationRows(rows);
      });
  }, []);

  // Set whether to show or close the Modal
  const handleClose = () => {
    setModeAdd(false);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  // Show UPDATE Modal
  const handleUpdate = (quotation) => {
    console.log("Update Product", quotation)
    console.log(refDate)
    refDate.current = quotation.code

    setShow(true);
    setQuotation(quotation);
  };

  // Show ADD Modal
  const handleShowAdd = () => {
    setModeAdd(true);
    setShow(true);
  };

  const handleDelete = (quotation) => {
    console.log("Delete Quotation", quotation)
    // way to pop up confirmation modal (html-style)
    if (window.confirm(`Are you sure to delete [${quotation.item}]?`)) {
      // DELETE data
      fetch(`${API_URL}/quotations/${quotation._id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
      })
      .then(res => res.json())
      .then(json => {
        // Successfully deleted
        console.log("DELETE Result", json);
        for (let i = 0; i < quotations.length; i++) {
          if (quotations[i]._id === quotation._id) {
            quotations.splice(i, 1);
            break;
          }
        }

        quotations.sort(function(a,b){
        return a.date - b.date;
        });
        let totalAmount = 0
        const rows = quotations.map((e,i) => {
          let amount = e.total;
          totalAmount += amount;
          return (
            <tr key={i}>
              <td style={{width: '40px'}}>
                {/* add icons (make sure to import first) */}
                {/*<FaPencilAlt onClick={() => {handleUpdate(e)}} />
                {/* ways to create empty space */}
                &nbsp; {/* {' '} */}
                <FaTrashAlt onClick={() => {handleDelete(e)}} /> 
              </td>
              <td>{e.date}</td>
              <td>{e.item}</td>
              <td style={{textAlign:'right'}}>{e.quantity}</td>
              <td style={{textAlign:'right'}}>{e.price}</td>
              <td style={{textAlign:'right'}}>{e.total}</td>
            </tr>
          );
        });

        setTotalAmountSold(totalAmount);
        setQuotations(quotations);
        setQuotationRows(rows);
        handleClose();
      });
    }
  };

  const handleFormAction = () => {
    if (modeAdd) {
      // Add new product
      const newQuotation = {
        date: refDate.current.value,
        item: refItem.current.value,
        quantity: refQuantity.current.value,
        price: refPrice.current.value,
        total: refTotal.current.value
      };
      console.log(newQuotation);

      // POST data
      fetch(`${API_URL}/quotations`, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(newQuotation), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(json => {
        console.log("POST Result", json);
          quotations.push(json)
          const rows = quotations.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {/*<FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  />
                  &nbsp;*/}
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.date}</td>
                <td>{e.item}</td>
                <td>{e.quantity}</td>
                <td>{e.price}</td>
                <td>{e.total}</td>
              </tr>
            );
          });
  
          setQuotations(quotations);
          setQuotationRows(rows);          
          handleClose();
        });
    } else {
      // Update product
      const updatedQuotation = {
        // _id is required for updation
        _id: quotation._id,
        date: refDate.current.value,
        item: refItem.current.value,
        quantity: refQuantity.current.value,
        price: refPrice.current.value,
        total: refTotal.current.value
      };
      console.log(updatedQuotation)

      // PUT data
      fetch(`${API_URL}/quotations`, {
        method: "PUT", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(updatedQuotation), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(json => {
        // Sucessfully updated the product
        console.log("PUT Result", json)
        for (let i=0; i<quotations.length; i++) {
          if (quotations[i]._id === updatedQuotation._id) {
            quotations[i] = updatedQuotation;
            break;
          }
        }
        
        const rows = quotations.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  {/*<FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  />
                  &nbsp;*/}
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.date}</td>
                <td>{e.item}</td>
                <td>{e.quantity}</td>
                <td>{e.price}</td>
                <td>{e.total}</td>
              </tr>
            );
          });
  
          setQuotations(quotations);
          setQuotationRows(rows);     
          handleClose();
        });
    }
  };

  return (
    <>
      <Container style={{paddingTop: "20px", fontFamily: "georgia"}}>
        <h1 style={{fontFamily: "cursive"}}>Quotation Management</h1>
        {/* API_URL: {API_URL} */}
        <Link to="/react-quotation/quotation">
          <Button variant="success">
            <FaPlus /> Add New Quotation
          </Button>
        </Link>
        {/*<Button variant="outline-dark">
          onClick={handleShowAdd}
          <FaPlus /> Add New Quotation
        </Button>*/}
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>&nbsp;</th>
              <th className={style}>Date</th>
              <th className={style}>Item</th>
              <th className={style.textCenter}>Quantity</th>
              <th className={style.textCenter}>Price/Unit</th>
              <th className={style.textCenter}>Total</th>
            </tr>
          </thead>
          <tbody>
            {quotationRows}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={5} className={style.textRight}>
                Total
              </td>
              <td className={style.textRight}>
                {totalAmountSold}
              </td>
            </tr>
          </tfoot>
        </Table>
      </Container>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modeAdd ? "Add New Quotation" : "Update Quotation"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col>Date</Col>
              <Col>
                <input type="text" ref={refDate} defaultValue={quotation.date} />
              </Col>
            </Row>
            <Row>
              <Col>Item</Col>
              <Col>
                <input type="text" ref={refItem} defaultValue={quotation.item} />
              </Col>
            </Row>
            <Row>
              <Col>Quantity</Col>
              <Col>
                <input type="number" ref={refQuantity} defaultValue={quotation.quantity} />
              </Col>
            </Row>
            <Row>
              <Col>Price</Col>
              <Col>
                <input type="number" ref={refPrice} defaultValue={quotation.price} />
              </Col>
            </Row>
            <Row>
              <Col>Total</Col>
              <Col>
                <input type="number" ref={refTotal} defaultValue={quotation.total} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleFormAction}>
            {modeAdd ? 'Add' : 'Update'}
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
}
