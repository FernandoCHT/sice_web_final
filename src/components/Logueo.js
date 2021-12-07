import React, { useState } from "react";
import { Stack, Container, Form, Button } from "react-bootstrap";
import firebaseApp from "../credenciales";
import {  getAuth,  createUserWithEmailAndPassword,  signInWithEmailAndPassword,  signInWithRedirect,  GoogleAuthProvider,} from "firebase/auth";
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const Logueo = () => {
  const [estaRegistrandose, setEstaRegistrandose] = useState(false);
  async function submitHandler(e) {
    e.preventDefault();
    const correo = e.target.formBasicEmail.value;
    const contra = e.target.formBasicPassword.value;
    if (estaRegistrandose) {
      //si se registra
      const usuario = await createUserWithEmailAndPassword(
        auth,
        correo,
        contra
      );
    } else {
      // si está iniciando sesión
      signInWithEmailAndPassword(auth, correo, contra);
    }
  }
  return (
    <Container class="col-4 col-md-12">
      <Stack gap={3}>
        <h1 className="text-center ">
          {estaRegistrandose ? "Regístrate" : "inicia sesión"}
        </h1>
        <Form className="text-center border p-3 " onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              className="center"
              type="email"
              placeholder="Ingresa tu correo"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingresa tu contraseña" required />
          </Form.Group>
          <Button variant="dark" type="submit">
            {estaRegistrandose ? "Regístrate" : "Inicia sesión"}
          </Button>
        </Form>
        <div class="d-grid gap-2 col-md-3 mx-auto">
        <Button
          variant="primary"
          type="submit"
          style={{ width: "300px" }}
          onClick={() => signInWithRedirect(auth, googleProvider)}
        >
          Acceder con Google
        </Button>
        <Button
          style={{ width: "300px" }}
          variant="secondary"
          onClick={() => setEstaRegistrandose(!estaRegistrandose)}
        >
          {estaRegistrandose
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </Button>
        </div>
      </Stack>
    </Container>
  );
};
export default Logueo;
