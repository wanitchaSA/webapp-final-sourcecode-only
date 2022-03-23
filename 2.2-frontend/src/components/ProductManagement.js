import React, { useEffect, useState, useRef } from "react";
import { Container, Table, Button, Modal, Form, Row, Col } from "react-bootstrap";
import { FaTrashAlt, FaPencilAlt, FaPlus } from "react-icons/fa";
import style from "../mystyle.module.css";

export default function ProductManagement() {
  const API_URL = process.env.REACT_APP_API_URL;

  const [products, setProducts] = useState([]);
  const [productRows, setProductRows] = useState([]);
  const [show, setShow] = useState(false);
  const [modeAdd, setModeAdd] = useState(false);

  const [product, setProduct] = useState({
    code: "",
    name: "",
    price: 0
  });

  // Input References
  const refCode = useRef();
  const refName = useRef();
  const refPrice = useRef();

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {

        const rows = data.map((e,i) => {
          return (
            <tr key={i}>
              <td style={{width: '40px'}}>
                {/* add icons (make sure to import first) */}
                <FaPencilAlt onClick={() => {handleUpdate(e)}} />
                {/* ways to create empty space */}
                &nbsp; {/* {' '} */}
                <FaTrashAlt onClick={() => {handleDelete(e)}} /> 
              </td>
              <td>{e.code}</td>
              <td>{e.name}</td>
              <td>{e.price}</td>
            </tr>
          );
        });

        setProducts(data);
        setProductRows(rows);
      });
  }, []);

  // Set whether to show or close the Modal
  const handleClose = () => {
    setModeAdd(false);
    setShow(false);
  };

  const handleShow = () => setShow(true);

  // Show UPDATE Modal
  const handleUpdate = (product) => {
    console.log("Update Product", product)
    console.log(refCode)
    refCode.current = product.code

    setShow(true);
    setProduct(product);
  };

  // Show ADD Modal
  const handleShowAdd = () => {
    setModeAdd(true);
    setShow(true);
  };

  const handleDelete = (product) => {
    console.log("Delete Product", product)
    // way to pop up confirmation modal (html-style)
    if (window.confirm(`Are you sure to delete [${product.name}]?`)) {
      // DELETE data
      fetch(`${API_URL}/products/${product._id}`, {
        method: "DELETE", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
      })
      .then(res => res.json())
      .then(json => {
        // Successfully deleted
        console.log("DELETE Result", json);
        for (let i = 0; i < products.length; i++) {
          if (products[i]._id === product._id) {
            products.splice(i, 1);
            break;
          }
        }

        const rows = products.map((e, i) => {
          return (
            <tr key={i}>
              <td>
                <FaPencilAlt
                  onClick={() => {
                    handleUpdate(e);
                  }}
                />
                &nbsp;
                <FaTrashAlt
                  onClick={() => {
                    handleDelete(e);
                  }}
                />
              </td>
              <td>{e.code}</td>
              <td>{e.name}</td>
              <td>{e.price}</td>
            </tr>
          );
        });

        setProducts(products);
        setProductRows(rows);     
        handleClose();
      });
    }
  };

  const handleFormAction = () => {
    if (modeAdd) {
      // Add new product
      const newProduct = {
        code: refCode.current.value,
        name: refName.current.value,
        price: refPrice.current.value
      };
      console.log(newProduct);

      // POST data
      fetch(`${API_URL}/products`, {
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
        body: JSON.stringify(newProduct), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(json => {
        console.log("POST Result", json);
          products.push(json)
          const rows = products.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  <FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  />
                  &nbsp;
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            );
          });
  
          setProducts(products);
          setProductRows(rows);          
          handleClose();
        });
    } else {
      // Update product
      const updatedProduct = {
        // _id is required for updation
        _id: product._id,
        code: refCode.current.value,
        name: refName.current.value,
        price: refPrice.current.value
      };
      console.log(updatedProduct)

      // PUT data
      fetch(`${API_URL}/products`, {
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
        body: JSON.stringify(updatedProduct), // body data type must match "Content-Type" header
      })
      .then(res => res.json())
      .then(json => {
        // Sucessfully updated the product
        console.log("PUT Result", json)
        for (let i=0; i<products.length; i++) {
          if (products[i]._id === updatedProduct._id) {
            products[i] = updatedProduct;
            break;
          }
        }
        
        const rows = products.map((e, i) => {
            return (
              <tr key={i}>
                <td>
                  <FaPencilAlt
                    onClick={() => {
                      handleUpdate(e);
                    }}
                  />
                  &nbsp;
                  <FaTrashAlt
                    onClick={() => {
                      handleDelete(e);
                    }}
                  />
                </td>
                <td>{e.code}</td>
                <td>{e.name}</td>
                <td>{e.price}</td>
              </tr>
            );
          });
  
          setProducts(products);
          setProductRows(rows);     
          handleClose();
        });
    }
  };

  return (
    <>
      <Container>
        <h1>Product Management</h1>
        {/* API_URL: {API_URL} */}
        <Button variant="outline-dark" onClick={handleShowAdd}>
          <FaPlus /> Add
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>&nbsp;</th>
              <th className={style.textCenter}>Code</th>
              <th className={style.textCenter}>Name</th>
              <th className={style.textCenter}>Price/Unit</th>
            </tr>
          </thead>
          <tbody>
            {productRows}
          </tbody>
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
            {modeAdd ? "Add New Product" : "Update Product"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Row>
              <Col>Code</Col>
              <Col>
                <input type="text" ref={refCode} defaultValue={product.code} />
              </Col>
            </Row>
            <Row>
              <Col>Name</Col>
              <Col>
                <input type="text" ref={refName} defaultValue={product.name} />
              </Col>
            </Row>
            <Row>
              <Col>Price</Col>
              <Col>
                <input type="number" ref={refPrice} defaultValue={product.price} />
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
