import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { isEmpty, size } from "lodash";
import {
  addDocument,
  deleteDocument,
  getCollection,
  updateDocument,
} from "./actions";

function App() {
  const [task, setTask] = useState("");
  const [apMat, setApeMat] = useState("");
  const [apPat, setApePat] = useState("");
  const [grupo, setGrupo] = useState("");
  const [matricula, setMatricula] = useState("");
  const [perfil, setPerfil] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");

  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const result = await getCollection("alumnos");
      console.log(result);
      if (result.statusResponse) {
        setTasks(result.data);
      }
    })();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (isEmpty(task) || isEmpty(apPat)) {
      console.log("Task vacío");
      return;
    }

    const result = await addDocument("alumnos", {
      nombre: task,
      apPat: apPat,
      apMat: apMat,
      grupo: grupo,
      matricula: matricula,
      perfil: "alumno",
      telefono: telefono,
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
        grupo: grupo,
        matricula: matricula,
        perfil: "alumno",
        telefono: telefono,
      },
    ]);
    setTask("");
    setApePat("");
    setApeMat("");
    setGrupo("");
    setMatricula("");
    setTelefono("");
  };

  const saveTask = async (e) => {
    e.preventDefault();
    if (isEmpty(task) || isEmpty(apPat)) {
      console.log("Task vacío");
      return;
    }

    const result = await updateDocument("alumnos", id, {
      nombre: task,
      apPat: apPat,
      apMat: apMat,
      grupo: grupo,
      matricula: matricula,
      perfil: perfil,
      telefono: telefono,
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
            grupo: grupo,
            matricula: matricula,
            perfil: perfil,
            telefono: telefono,
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
    setMatricula("");
    setPerfil("");
    setTelefono("");
  };

  const deleteTask = async (id) => {
    const result = await deleteDocument("alumnos", id);
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
    setGrupo(tarea.grupo);
    setMatricula(tarea.matricula);
    setPerfil(tarea.perfil);
    setTelefono(tarea.telefono);
    setEditMode(true);
    setId(tarea.id);
  };

  return (
    <>
      <div className="container mt-5">
        <div className="row ">
          <div className="col col-md-auto">
            <h4 className="text-center">
              {editMode
                ? "Modificar datos del alummno"
                : "Registrar nuevo alumno"}
            </h4>
            <form onSubmit={editMode ? saveTask : addTask}>
              <h6>Nombre</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ingresar un nombre"
                onChange={(text) => setTask(text.target.value)}
                value={task}
                required
              />
              <h6>Apellido Paterno</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ingresar apellido paterno"
                onChange={(text) => setApePat(text.target.value)}
                value={apPat}
                required
              />
              <h6>Apellido materno</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ingresar apellido materno"
                onChange={(text) => setApeMat(text.target.value)}
                value={apMat}
                required
              />
              <h6>Grupo</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ej. 10A"
                onChange={(text) => setGrupo(text.target.value)}
                value={grupo}
                required
              />
              <h6>Matricula</h6>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Ej. UTM170067TIC"
                onChange={(text) => setMatricula(text.target.value)}
                value={matricula}
                required
              />
              <h6>Teléfono</h6>
              <input
                type="number"
                className="form-control mb-2"
                placeholder="Ingresar un teléfono"
                onChange={(text) => setTelefono(text.target.value)}
                value={telefono}
                required
              />
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
          <div className="col col-md-auto">
            {size(tasks) === 0 ? (
              <h5 className="text-center">Aun no hay alumnos</h5>
            ) : (
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido Paterno</th>
                    <th scope="col">Apellido Materno</th>
                    <th scope="col">Grupo</th>
                    <th scope="col">Matricula</th>
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
                      <td>{task.grupo}</td>
                      <td>{task.matricula}</td>
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
                          className="btn btn-success btn-sm float-right"
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
export default App;
