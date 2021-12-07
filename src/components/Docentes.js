import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { isEmpty, size } from "lodash";
import { Stack, Container, Row, Col, Button } from "react-bootstrap";
import {  addDocument,  deleteDocument,  getCollection,  updateDocument,} from "./actions";

function App2() {
  const [task, setTask] = useState("");
  const [apMat, setApeMat] = useState("");
  const [apPat, setApePat] = useState("");
  const [grupos, setGrupo] = useState("");
  const [perfil, setPerfil] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getCollection("docentes");
      console.log(result);
      if (result.statusResponse) {
        setTasks(result.data);
      }
    })();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      console.log("Task vacío");
      return;
    }

    const result = await addDocument("docentes", {
      nombre: task,
      apPat: apPat,
      apMat: apMat,
      grupos: grupos,
      perfil: "docente",
      telefono: telefono,
      correo: correo,
    });
    if (!result.statusResponse) {
      setError(result.error);
      return;
    }

    setTasks([
      ...tasks,
      {
        id: result.data.id,
        nombre: task,
        apPat: apPat,
        apMat: apMat,
        grupos: grupos,
        perfil: "Docente",
        telefono: telefono,
        correo: correo,
      },
    ]);
    setTask("");
    setApePat("");
    setApeMat("");
    setGrupo("");
    setTelefono("");
    setCorreo("");
  };

  const saveTask = async (e) => {
    e.preventDefault();
    if (isEmpty(task)) {
      console.log("Task vacío");
      return;
    }

    const result = await updateDocument("docentes", id, {
      nombre: task,
      apPat: apPat,
      apMat: apMat,
      grupos: grupos,
      perfil: perfil,
      telefono: telefono,
      correo: correo,
    });
    if (!result.statusResponse) {
      setError(result.error);
      return;
    }

    const editedTasks = tasks.map((item) =>
      item.id === id
        ? {
            id,
            nombre: task,
            apPat: apPat,
            apMat: apMat,
            grupos: grupos,
            perfil: perfil,
            telefono: telefono,
            correo: correo,
          }
        : item
    );
    setTasks(editedTasks);
    setEditMode(false);
    setTask("");
    setId("");
    setApeMat("");
    setApePat("");
    setGrupo("");
    setPerfil("");
    setTelefono("");
    setCorreo("");
  };

  const deleteTask = async (id) => {
    const result = await deleteDocument("docentes", id);
    if (!result.statusResponse) {
      setError(result.error);
      return;
    }
    const filteredTasks = tasks.filter((task) => task.id !== id);
    setTasks(filteredTasks);
  };

  const editTask = (tarea) => {
    setTask(tarea.nombre);
    setApeMat(tarea.apMat);
    setApePat(tarea.apPat);
    setGrupo(tarea.grupos);
    setPerfil(tarea.perfil);
    setTelefono(tarea.telefono);
    setCorreo(tarea.correo);
    setEditMode(true);
    setId(tarea.id);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row ">
          <div className="col col-md-12">
            <h4 className="text-center">
              {editMode
                ? "Modificar datos del docente"
                : "Registrar nuevo docente"}
            </h4>
            <form onSubmit={editMode ? saveTask : addTask}>
              <Row className="mb-4">
                <div className="col-12 col-md-4">
                  <h6>Nombre</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Ingresar un nombre"
                    onChange={(text) => setTask(text.target.value)}
                    value={task}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <h6>Apellido Paterno</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Ingresar apellido paterno"
                    onChange={(text) => setApePat(text.target.value)}
                    value={apPat}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <h6>Apellido materno</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Ingresar apellido materno"
                    onChange={(text) => setApeMat(text.target.value)}
                    value={apMat}
                    required
                  />
                </div>

                <div className="col-12 col-md-4">
                  <h6>Correo</h6>
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Ej. 10A"
                    onChange={(text) => setCorreo(text.target.value)}
                    value={correo}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <h6>Grupo</h6>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Ej. 10A"
                    onChange={(text) => setGrupo(text.target.value)}
                    value={grupos}
                    required
                  />
                </div>
                <div className="col-12 col-md-4">
                  <h6>Teléfono</h6>
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Ingresar un teléfono"
                    onChange={(text) => setTelefono(text.target.value)}
                    value={telefono}
                    required
                  />
                </div>
              </Row>

              <button
                className={
                  editMode
                    ? "btn btn-primary btn-block"
                    : "btn btn-primary btn-block"
                }
                type="submit"
              >
                {" "}
                {editMode ? "Guardar" : "Agregar"}
              </button>
            </form>
          </div>
          <div className="col col-md-12">
            {size(tasks) === 0 ? (
              <h5 className="text-center">Aun no hay alumnos</h5>
            ) : (
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido Paterno</th>
                    <th scope="col">Apellido Materno</th>
                    <th scope="col">Correo</th>
                    <th scope="col">Grupo</th>
                    <th scope="col">Perfil</th>
                    <th scope="col">Teléfono</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id}>
                      <td>{task.nombre}</td>
                      <td>{task.apPat}</td>
                      <td>{task.apMat}</td>
                      <td>{task.correo}</td>
                      <td>{task.grupos}</td>
                      <td>{task.perfil}</td>
                      <td>{task.telefono}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm float-right "
                          onClick={() => deleteTask(task.id)}
                        >
                          Eliminar{" "}
                        </button>
                        <button
                          className="btn btn-success btn-sm float-right "
                          onClick={() => editTask(task)}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default App2;
