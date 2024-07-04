//evaliacion 3 Jeriam Rogers



import  { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";


const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [productoEditado, setProductoEditado] = useState(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const productosPorPagina =3;

  useEffect(() => {
    const productosAlmacenados = JSON.parse(localStorage.getItem("productos"));
    if (productosAlmacenados && productosAlmacenados.length > 0) {
      setProductos(productosAlmacenados);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("productos", JSON.stringify(productos));
  }, [productos]);

  const agregarProducto = (event) => {
    event.preventDefault();

    if (productoEditado) {
      const productosActualizados = productos.map((producto) => {
        if (producto.id === productoEditado.id) {
          return {
            ...producto,
            nombre,
            categoria,
            precio,
          };
        }
        return producto;
      });

      setProductos(productosActualizados);
      setProductoEditado(null);
    } else {
      const nuevoProducto = {
        id: Math.random().toString(),
        nombre,
        categoria,
        precio,
      };

      setProductos([...productos, nuevoProducto]);
    }

    setNombre("");
    setCategoria("");
    setPrecio("");
  };

  const cambiarNombre = (event) => {
    setNombre(event.target.value);
  };

  const cambiarCategoria = (event) => {
    setCategoria(event.target.value);
  };

  const cambiarPrecio = (event) => {
    setPrecio(event.target.value);
  };

  const editarProducto = (producto) => {
    setNombre(producto.nombre);
    setCategoria(producto.categoria);
    setPrecio(producto.precio);
    setProductoEditado(producto);
  };

  const eliminarProducto = (id) => {
    const productosActualizados = productos.filter(
      (producto) => producto.id !== id
    );
    setProductos(productosActualizados);
  };

  const filtrarProductos = () => {
    return productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
  };

  const ordenarProductos = () => {
    const productosOrdenados = [...productos].sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
    setProductos(productosOrdenados);
  };

  const indiceUltimoProducto = paginaActual * productosPorPagina;
  const indicePrimerProducto = indiceUltimoProducto - productosPorPagina;
  const productosPaginaActual = filtrarProductos().slice(indicePrimerProducto, indiceUltimoProducto);

  const cambiarPagina = (numeroPagina) => {
    setPaginaActual(numeroPagina);
  };

  const numeroPaginas = Math.ceil(filtrarProductos().length / productosPorPagina);

  return (
    <Container className="mt-5 text-center">
      <h1 className="text-center mb-4">Catálogo de Productos</h1>
      <Form onSubmit={agregarProducto} className="formulario mt-5 me-auto ms-auto">
        <Row className="justify-content-center">
          <Col xs={12} md={6}>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Nombre del producto"
                value={nombre}
                onChange={cambiarNombre}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Categoría"
                value={categoria}
                onChange={cambiarCategoria}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Precio"
                value={precio}
                onChange={cambiarPrecio}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {productoEditado ? "Guardar cambios" : "Agregar producto"}
            </Button>
          </Col>
        </Row>
      </Form>
      <Form.Group className="mt-5">
        <Form.Control
          type="text"
          placeholder="Buscar productos por nombre o categoria"
          value={terminoBusqueda}
          onChange={(e) => setTerminoBusqueda(e.target.value)}
        />
      </Form.Group>
      <Button className="mt-3"  variant="secondary" onClick={ordenarProductos}>
        Ordenar Alfabéticamente
      </Button>
      <Row className="mt-5">
        {productosPaginaActual.map((producto) => (
          <Col xs={12} md={6} lg={4} key={producto.id} className="mb-3">
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => editarProducto(producto)}
                >
                  Editar <i className="bi bi-pencil"></i>
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => eliminarProducto(producto.id)}
                >
                  Eliminar <i className="bi bi-x-circle"></i>
                </Button>
              </Card.Header>
              <Card.Body>
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text>Categoría: {producto.categoria}</Card.Text>
                <Card.Text>Precio: ${producto.precio}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <nav aria-label="Paginación de productos">
        <ul className="pagination pagination-lg justify-content-center">
          {Array.from({ length: numeroPaginas }, (_, index) => (
            <li key={index + 1} className={`page-item ${paginaActual === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => cambiarPagina(index + 1)}>
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
};

export default Catalogo;
