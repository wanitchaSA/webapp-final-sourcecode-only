import { useState, useRef, useEffect } from "react";
import {
  Navbar,
  Nav,
  Container,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import { useLocalStorage } from "react-use";
import QuotationTable from "./QuotationTable";

function Quotation() {
  const API_URL = process.env.REACT_APP_API_URL;
  const dateRef = useRef();
  const itemRef = useRef();
  const priceRef = useRef();
  const qtyRef = useRef();
  const totalRef = useRef();

  const [localDataItems, setLocalDataItems, remove] = useLocalStorage(
    "data-items",
    JSON.stringify([])
  );

  const [dataItems, setDataItems] = useState(JSON.parse(localDataItems));

  const [products, setProducts] = useState([]);
  const [productOptions, setProductOptions] = useState([]);
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState(0);
  const [itemName, setItemName] = useState("");
  //const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        data = data.filter((e) => "code" in e);

        console.log(data);
        const z = data.map((v) => (
          <option key={v._id} value={v._id}>
            {v.name}
          </option>
        ));
        setProducts(data);
        setProductOptions(z);
      });
  }, []);

  const deleteProduct = () => {
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log("Item to be deleted", item);
    fetch(`${API_URL}/products`, {
      method: "DELETE",
      body: JSON.stringify({
        _id: item._id,
      }),
    })
      .then((res) => res.json)
      .then((data) => {
        console.log("Delete ", data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addItem = () => {
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log(item);
    var itemObj = {
      _id: item._id,
      code: item.code,
      date: dateRef.current.value,
      name: item.name,
      price: priceRef.current.value,
      qty: qtyRef.current.value,
    };

    dataItems.push(itemObj);
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
    console.log("after", dataItems);
  };

  const findItem = () => {
    let item = products.find((v) => itemRef.current.value === v._id);
    setItemName(item.name);
    //console.log(item.name);
    //console.log(itemName);
  }

  const saveItem = () => {
    findItem();
    const newQuotation = {
        date: dateRef.current.value.split(' ')[0],
        item: itemName,
        quantity: qtyRef.current.value,
        price: priceRef.current.value,
        total: priceRef.current.value*qtyRef.current.value
      };
      console.log(newQuotation);
      console.log("date", date);

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
  }

  const updateDataItems = (dataItems) => {
    setDataItems([...dataItems]);
    setLocalDataItems(JSON.stringify(dataItems));
  };

  const clearDataItems = () => {
    setDataItems([]);
    setLocalDataItems(JSON.stringify([]));
  };

  const productChange = () => {
    console.log("productChange", itemRef.current.value);
    let item = products.find((v) => itemRef.current.value === v._id);
    console.log("productChange", item);
    priceRef.current.value = item.price;
    console.log(priceRef.current.value);
  }; 
  
  return (
    <Container style={{paddingTop: "20px", fontFamily: "georgia"}}>
      <Row>
        <Col md={4} style={{ backgroundColor: "pink", padding: "20px"}}>
          <Row>
            <Col>
              Date
              <Form.Control type="date" ref={dateRef} onChange={(e) => setDate(dateRef.current.value)}></Form.Control>
            </Col>
          </Row>
          <Row>
            <Col>
              Item
              <Form.Select ref={itemRef} onChange={productChange}>
                {productOptions}
              </Form.Select>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Price Per Unit</Form.Label>
              <Form.Control
                type="number"
                ref={priceRef}
                value={price}
                onChange={(e) => setPrice(priceRef.current.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" ref={qtyRef} defaultValue={1} />
            </Col>
          </Row>
          <hr />
          <div className="d-grid gap-2">
            <Button variant="success" onClick={saveItem}>
              Save 
            </Button>
            <Button variant="dark" onClick={addItem}>
              Add to Draft 
            </Button>
            {/*<Button variant="danger" onClick={deleteProduct}>
              Delete
            </Button>*/}
          </div>
          {/* {JSON.stringify(dataItems)} */}
        </Col>
        <Col md={8}>
          <QuotationTable
            data={dataItems}
            clearDataItems={clearDataItems}
            updateDataItems={updateDataItems}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Quotation;