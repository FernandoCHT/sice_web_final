import React, { useState, useEffect } from "react";
import "bootstrap/dist/js/bootstrap";
import { Stack, Row, Col } from "react-bootstrap";

import firebaseApp from "../credenciales";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

import { Container, Button } from "react-bootstrap";

import AgregarTarea from "./AgregarTarea";
import ListadoTareas from "./ListadoTareas";
import Alumnos from "./App";
import Docentes from "./Docentes";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

const Home = ({ correoUsuario }) => {
  const [alumnos, setAlumnos] = useState(null);
  const [docentes, setDocentes] = useState(null);
  const [archvios, setArchivos] = useState(null);
  const [arrayTareas, setArrayTareas] = useState(null);
  const fakeData = [
    
  ];

  async function buscarDocumentOrCrearDocumento(idDocumento) {
    //crear referencia al documento
    const docuRef = doc(firestore, `usuarios/${idDocumento}`);
    // buscar documento
    const consulta = await getDoc(docuRef);
    // revisar si existe
    if (consulta.exists()) {
      // si sí existe
      const infoDocu = consulta.data();
      return infoDocu.tareas;
    } else {
      // si no existe
      await setDoc(docuRef, { tareas: [...fakeData] });
      const consulta = await getDoc(docuRef);
      const infoDocu = consulta.data();
      return infoDocu.tareas;
    }
  }

  useEffect(() => {
    async function fetchTareas() {
      const tareasFetchadas = await buscarDocumentOrCrearDocumento(
        correoUsuario
      );
      setArrayTareas(tareasFetchadas);
    }

    fetchTareas();
  }, []);

  return (
    <>
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <a class="navbar-brand" href="">
            SICE
          </a>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
              <a class="nav-link active" aria-current="page" href="">
                Inicio
              </a>
            </div>
          </div>
        </div>
        <h4 class="text-light">Sesión iniciada</h4>
        <div className="">
          <Button onClick={() => signOut(auth)}>Cerrar sesión</Button>
        </div>
      </nav>
      <br />
      <br />

      <Container>
        <Row>
          <div className="col-12 col-md-4">
            {/*Botón mostrar alumnos*/}
            <Button
              style={{ width: "300px" }}
              variant="secondary"
              onClick={() => setAlumnos(!alumnos)}
            >
              Alumnos
            </Button>
          </div>

          {/*###########*/}
          <div className="col-12 col-md-4">
            <Button
              style={{ width: "300px" }}
              variant="secondary"
              onClick={() => setDocentes(!docentes)}
            >
              Docentes
            </Button>
          </div>

          {/*###########*/}

          <div className="col-12 col-md-4">
            <Button
              style={{ width: "300px" }}
              variant="secondary"
              onClick={() => setArchivos(!archvios)}
            >
              Archivos
            </Button>
          </div>
        </Row>

        {!alumnos ? " " : <Alumnos />}
        {!docentes ? " " : <Docentes />}

        {archvios ? (
          <Container>
            <hr />
            <AgregarTarea
              arrayTareas={arrayTareas}
              setArrayTareas={setArrayTareas}
              correoUsuario={correoUsuario}
            />
            {arrayTareas ? (
              <ListadoTareas
                arrayTareas={arrayTareas}
                setArrayTareas={setArrayTareas}
                correoUsuario={correoUsuario}
              />
            ) : null}
          </Container>
        ) : null}
      </Container>
    </>
  );
};

export default Home;
